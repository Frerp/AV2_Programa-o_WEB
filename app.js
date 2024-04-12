const express = require("express");
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const Alimento = require('./Model/Alimento')

app.use(express.json());
app.use(express.urlencoded({extended: true}))

//Rotas
app.get("/", (req,res)=>{
	res.send("Home Page");
});

app.post("/", async (req, res)=>{
    console.log(req.body)

    const alimento = new Alimento({
        name: req.body.name,
        category: req.body.category,
        quantity: req.body.quantity,
        expirationDate: req.body.expirationDate,
        price: req.body.price
    });

    await alimento.save()
    .then(data=>{
        res.json(data);
    })
    .catch(err =>{
        res.json({message: err});
        console.log(err)
    });
});

app.get("/alimentos", async(req, res)=>{
    const alimentos = await Alimento.find();
    res.json(alimentos);
})

app.get("/alimento/:id", async(req, res)=>{
    const alimentos = await Alimento.findById(req.params.id);
    res.json(alimentos)
});

app.get("/alimentos/:name", async(req, res)=>{
    const alimentos = await Alimento.find({name: req.params.name});
    res.json(alimentos)
});

// Atualizar um alimento existente pelo ID
app.put("/alimento/:id", async (req, res) => {
    try {
        const updatedFood = await Alimento.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedFood == null) {
            return res.status(404).json({ message: "Food not found" });
        }
        res.json(updatedFood);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete("/alimento/:id", async(req, res)=>{
    const removedAlimento = await Alimento.findByIdAndDelete({_id: req.params.id});
    res.json(removedAlimento);
})

//Conectar ao Banco de Dados - usar URL fornecida pelo Atlas
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

//Servidor
app.listen(3000, ()=>{console.log("Server is running")});
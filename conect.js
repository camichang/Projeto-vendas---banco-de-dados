var mongoose = require("mongoose");

mongoose.connect("mongodb+srv://camila_chang:camila_chang@cluster0.gcljv.mongodb.net/vendas?retryWrites=true&w=majority").then(()=>{
    console.log("banco conectado");
}).catch((err)=>{
    console.log("Erro"+err);
})
// catch é pra emitir se houver um erro
// importando os modulos express e mongoose
var express = require("express");
var mongoose = require("mongoose"); //ferramenta para realizar a modelagem do banco

// select + form produtos;
const app = express();  //criando uma aplicação do express
const port = 3000; //definindo a porta

//conexao com bando de dados, com uso de flags para tratamentos de erros e evitar depreciação de codigos
mongoose.connect("mongodb+srv://usuario:senha@cluster0.gcljv.mongodb.net/vendas?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
// elimina a depreciacao do mongoose
// criando um modelo que irá compor a collection do banco

app.listen(port, () => {
    console.log("servidor rodando na porta " + port);
});
// app.listen é para chamar a porta
// app.get é pra chamar a pasta raiz

const Produtos = mongoose.model("produtos", {
    nome: String,
    vlUnit: Number,
    codigoBarras: String
});
// mongoose da variavel
// atribuições aos produtos, caracteristicas que são importantes para gurdar no banco de dados
// mongoose.model = define a colection

app.set("view engine", "ejs");
// use como o motor de visualização o ejs
app.set("views", __dirname, "/views");
// app.set("views", __dirname+"/views"); é qual vai ser a visualização
app.use(express.urlencoded());
// dizer que os dados podem passar de uma pag para outra
app.use(express.json());
// app.set(express.json()); os dados vao ser transformados em json(pois é mais leve)

// criando rota principal
app.get("/", (req, res) => {
    res.send("pagina inicial")
});

// criando uma rota para listar os produtos cadastrados
// render para renderizar para a pagina que esta na rota
app.get("/produtos", (req, res) => {
    let consulta = Produtos.find({}, (err, produto) => { //o Produtos é da collection
        console.log(consulta); //só serve pra enxergar os itens no console
        if (err) //quando tiver um erro vai retornar o erro do servidor
            return res.status(500).send("Erro ao consultar Produto");
        res.render("produtos", {produto_itens:produto}); //produtos recebe cada produto da consulta

    });
});


// rota para a formprodutos
app.get("/cadastrarProdutos", (req, res) => {
    res.render("formprodutos");
})
// vai renderizar a pagina no caso formprodutos
app.post("/cadastrarProdutos", (req, res) => { //rota para salvar os produtos no banco de dados
    let produto = new Produtos(); //criando um objeto do tipo produto, que veio do model, vai herdar o modelo do model
    produto.nome = req.body.nome;
    // corpo da requisição onde estiver o name do input:nome
    produto.vlUnit = req.body.valor;
    produto.codigoBarras = req.body.codBarras;

    produto.save((err) => {
        // guarda as informações no banco de dados
        if (err)
            return res.status(500).send("Erro ao cadastrar produto")
        // vem o (500) por causa do status, precisa por algum numero
        return res.redirect("/produtos");
    })
});
// variavel recebe um objeto que é o const la de cima, e que vai ter os atributos da const Produtos
// post recebe o formulario

app.get("/deletar_itens/:id", (req, res) => {
    var chave = req.params.id; //req.params.id é o id do paramentro (/deletarAluno/id)
    Produtos.deleteOne({ _id: chave }, (err, result) => { //o _id é do banco de dados 
        if (err)
            return res.status(500).send("Erro ao excluir registro")
    })
    res.redirect("/produtos");
})



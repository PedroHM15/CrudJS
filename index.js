const express = require("express");
const app = express();
const {engine} = require('express-handlebars');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const Handlebars = require('handlebars');
Handlebars.registerHelper('printOnce', function(index, options) {
    if (index === 0) {
        return options.fn(this);
    } else {
        return '';
    }
});


//Conexão com banco de dados MySql.
const sequelize = new Sequelize('teste2','root','123123',{
    host: "localhost",
    dialect: "mysql"
});
//Criando  a const Usuario que esta Criando/Usando a tabela usuarios.
const Usuario = sequelize.define('usuarios',{
    nome: {
        type: Sequelize.STRING
    },
    senha: {
        type: Sequelize.STRING
    },
    idade: {
        type: Sequelize.INTEGER
    },
    cpf: {
        type: Sequelize.STRING(11)
    }
});

//Fazendo com que a tabela Usuario seja criada forçadamente.
//Usar apenas na primeira vez.
//Usuario.sync({force: true});

//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//Configurando Template Engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", "./views");



//Rotas
//Rota padrao localhost:8081.
app.get('/',function(req,res){
    res.render('telaInicial')   
});
//Rota localhost:8081/cadastro
app.get('/cadastro', function(req,res){
    res.render('telaCadastro');
});
app.post('/add', function(req,res){
    Usuario.create({
        nome: req.body.nomeCadastro,

        idade: req.body.idadeCadastro,

        senha: req.body.senhaCadastro,

        cpf: req.body.cpfCadastro

    }).then(function(){
        res.redirect('/')
    }).catch(function(erro){
        res.redirect('/cadastro')
        console.log("Houve um erro: " + erro)
    });
});
//Rota localhost:8081/login
app.get('/login', function(req,res){
    res.render('telaLogin');
});
//Rota localhost:8081/delet
app.get('/delet', function(req,res){
    res.render('telaDeletar');
});
//Rota localhost:8081/del
app.post('/del', function(req,res){
    Usuario.destroy({
        where:{
            [Op.and]: [{nome: req.body.nomeDelet}, {cpf: req.body.cpfDelet}]
        } 
    }).then(function(){
        res.redirect('/')
    }).catch(function(erro){
        res.redirect('/delet')
        console.log("Houve um erro: " + erro)
    });
});
//Rota localhost:8081/editar
app.get('/editar', function(req,res){
    res.render('telaEditar')
});
app.post('/edit', function(req,res){
    Usuario.update({
        nome: req.body.nomeModificado, 
        senha: req.body.senhaModificado, 
        idade: req.body.idadeModificado,
        cpf: req.body.cpfModificado
    },{
        where:{
            nome: req.body.nomeModificar
        }
    }).then(function(){
        res.redirect('/')
    }).catch(function(erro){
        res.redirect('telaEditar')
    })
});
//Rota localhost:8081/usuario
app.post('/usuario', function(req,res){ 
    
    const nome2  = req.body.nomeLogin
    const senha2 = req.body.senhaLogin
    const x = Usuario.findOne({
        where: {
            nome: nome2,
            senha: senha2
        }
    }).then(function(mostrar){
        
        res.render('telaUsuario', {exibir: mostrar});
        
    })
    
});

//Informar qual "porta" o localhost irá usar.
//OBS: Não pode ser uma porta que esta sendo usada.
app.listen(8081, function(){
    console.log("Servidor Rodando da URL http://localhost:8081");
});


const express = require('express');
const cors = require('cors');
const router = require('./src/routes/routes');
const hbs = require('express-handlebars');
const session = require('express-session');
const userController = require('./src/controllers/userController');
const productController = require('./src/controllers/ProductController');
const embalagemController = require('./src/controllers/embalagemController');
const bodyParser = require('body-parser');

const app = express();

//CONFIGURAÇÃO HANDLEBARS
app.engine('hbs',hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main'
}));
app.set('view engine','hbs');
////////FIM CONFIG HBS////////////
app.use(bodyParser.urlencoded({extended:false}));
//CONFIG DO SESSION
app.use(session({
    secret: 'criarChave',
    resave: false,
    saveUninitialized: true
}));

//////ARQUIVOS ESTATICOS EX CSS E JAVASCRIPT
app.use(express.static('public'));


app.use(cors());
app.use(express.json());
app.use(router);

app.listen(5000,()=>{
    console.log('criado');
})

 

app.get('/',(req,res)=>{
    if(req.session.errors){
        var arrayerrors = req.session.errors;
        req.session.errors = '';
        return res.render('index',{NavActiveCad:true,error:arrayerrors});
    }

    if(req.session.success){
        req.session.success = false;
        return res.render('index',{NavActiveCad:true,MsgSuccess: true});
    }
    
    res.render('index',{NavActiveCad:true});
})

app.get('/embalagem',(req,res)=>{
    if(req.session.errors){
        var arrayerrors = req.session.errors;
        req.session.errors = '';
        return res.render('embalagem',{NavActiveEmb:true,error:arrayerrors});
    }

    if(req.session.success){
        req.session.success = false;
        return res.render('embalagem',{NavActiveEmb:true,MsgSuccess: true});
    }
   return res.render('embalagem',{NavActiveEmb:true})
})

app.post('/cadEmb',(req,res)=>{
    var nome = req.body.nome;

     //ARRAY QUE VAI ARMAZENAR OS errors
     const errors = [];

     //REMOVER ESPAÇOS EM BRANCO ANTES E DEPOIS
         nome.trim();
 
     //LIMPAR O NOME DE CARACTERES ESPECIAIS
     nome = nome.replace(/[^A-zÀ-ú\s]/gi,'');
 
     //VERIFICAR SE ESTA VAZIO OU NAO DEFINIDO O CAMPO
 
     if(nome == '' || typeof nome == undefined || nome == null) {
         errors.push({mensagem: "Campo nome nao pode ser vazio"});
     }
 
     //VERIFICAR SE O CAMPO NOME É VALIDO (APENAS LETRAS)
     if(!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)){
         errors.push({mensagem: "Nome inválido!"});
     }

     //VERIFICAR SE TEM errors
    if(errors.length > 0) {
        req.session.errors = errors;
        req.session.success = false;
        console.log(errors)
        return res.redirect('/embalagem');
     }
 
     //SUCESSO NENHUM ERRO
     //SALVAR NO BANCO DE DADOS
     console.log('validação realzizada com sucesso')
     req.session.success = true;
     embalagemController.novaEmbalagem(nome);
     res.redirect('/embalagem');
})


app.get('/produtos',(req,res)=>{
    if(req.session.errors){
        var arrayerrors = req.session.errors;
        req.session.errors = '';
        return res.render('produto',{NavActiveProd:true,error:arrayerrors});
    }

    if(req.session.success){
        req.session.success = false;
        return res.render('produto',{NavActiveProd:true,MsgSuccess: true});
    }
   return res.render('produto',{NavActiveProd:true})
})


//PEGAR DADOS FORMULARIO PRODUTO
app.post('/prod',(req,res)=>{
    
   
    
    console.log(req.body)
    var nome = req.body.nome;
    var cod_barras = req.body.cod_barra;
    var altura = parseFloat(req.body.altura.toString().replace(",", "."));
    var comprimento = parseFloat(req.body.comprimento.toString().replace(",", "."));
    var bloqueio = req.body.bloqueio;
    var largura = parseFloat(req.body.largura.toString().replace(",", "."));
    var peso = parseFloat(req.body.peso.toString().replace(",", "."));


    //ARRAY QUE VAI ARMAZENAR OS errors
    const errors = [];

    //EXPRESSAO REGULAR PARA VERIFICAR SE CONTEM APENAS NUMEROS NO COD_BARRA
    const apenasNumeros = new RegExp('^[0-9]+$')

    if(!apenasNumeros.test(cod_barras) || cod_barras.length > 8 || cod_barras.length < 8) {
        errors.push({mensagem: "Cod de barras inválido!"})
    }
    

   

    //VERIFICAR SE JA EXISTE UM PRODUTO COM O COD_DE_BARRAS
   
        
   //VERIFICAR SE ALTURA , PESO,COMPRIMENTO, LARGURA SAO NUMBER

    if(isNaN(altura) || isNaN(peso) || isNaN(comprimento) || isNaN(largura)) {
        errors.push({mensagem: "Verifique se altura,peso,comprimento,largura sao validos"});
    }

    //TRANSFORMAR O BLOQUEIO PARA TRUE OU FALSE

    if(bloqueio == 'sim'){
        bloqueio = true;
    }else {
        bloqueio = false;
    }

    //REMOVER ESPAÇOS EM BRANCO ANTES E DEPOIS

        nome.trim();

    //LIMPAR O NOME DE CARACTERES ESPECIAIS
    nome = nome.replace(/[^A-zÀ-ú\s]/gi,'');

    //VERIFICAR SE ESTA VAZIO OU NAO DEFINIDO O CAMPO

    if(nome == '' || typeof nome == undefined || nome == null) {
        errors.push({mensagem: "Campo nome nao pode ser vazio"});
    }

    //VERIFICAR SE O CAMPO NOME É VALIDO (APENAS LETRAS)
    if(!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)){
        errors.push({mensagem: "Nome inválido!"});
    }
    

    //VERIFICAR SE TEM errors
    if(errors.length > 0) {
       req.session.errors = errors;
       req.session.success = false;
       console.log(errors)
       return res.redirect('/produtos');
    }

    //SUCESSO NENHUM ERRO
    //SALVAR NO BANCO DE DADOS
    console.log('validação realzizada com sucesso')
    req.session.success = true;

    productController.novoProduto(cod_barras,nome,largura,altura,peso,comprimento,bloqueio)
    
})

//VAI PEGAR OS DADOS DO FORMULARIO  CADASTRO
app.post('/cad',(req,res)=>{
    var nome = req.body.nome;
    var senha = req.body.senha;
    console.log(nome);
    console.log(senha);

    //ARRAY QUE VAI ARMAZENAR OS errors
    const errors = [];

    //REMOVER ESPAÇOS EM BRANCO ANTES E DEPOIS

        nome.trim();
        senha.trim();

    //LIMPAR O NOME DE CARACTERES ESPECIAIS
    nome = nome.replace(/[^A-zÀ-ú\s]/gi,'');

    //VERIFICAR SE ESTA VAZIO OU NAO DEFINIDO O CAMPO

    if(nome == '' || typeof nome == undefined || nome == null) {
        errors.push({mensagem: "Campo nome nao pode ser vazio"});
    }

    //VERIFICAR SE O CAMPO NOME É VALIDO (APENAS LETRAS)
    if(!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)){
        errors.push({mensagem: "Nome inválido!"});
    }

    //VERIFICAR O CAMPO DA SENHA

    if(!/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z$*&@#]{8,}$/.test(senha)){
        errors.push({mensagem: 'Senha inválida'})
    }

    //VERIFICAR SE TEM error
    if(errors.length > 0) {
       req.session.errors = errors;
       req.session.success = false;
       console.log(errors)
       return res.redirect('/');
    }

    //SUCESSO NENHUM ERRO
    //SALVAR NO BANCO DE DADOS
    req.session.success = true;
    userController.novaTarefa(nome,senha,true,'2022-01-01');
    return res.redirect('/');    
})
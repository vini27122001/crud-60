const express = require('express');
const cors = require('cors');
const router = require('./src/routes/routes');
const hbs = require('express-handlebars');
const session = require('express-session');
const userController = require('./src/controllers/userController');
const productController = require('./src/controllers/ProductController');
const embalagemController = require('./src/controllers/embalagemController');
const posicaoController = require('./src/controllers/posicaoController');
const setorController = require('./src/controllers/setorController');
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

app.get('/setor',(req,res)=>{
    if(req.session.errors){
        var arrayerrors = req.session.errors;
        req.session.errors = '';
        return res.render('setor',{NavActiveSet:true,error:arrayerrors});
    }

    if(req.session.success){
        req.session.success = false;
        return res.render('setor',{NavActiveSet:true,MsgSuccess: true});
    }
    
    res.render('setor',{NavActiveSet:true});
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

app.get('/posicao',(req,res)=>{
    if(req.session.errors){
        var arrayerrors = req.session.errors;
        req.session.errors = '';
        return res.render('posicao',{NavActivePos:true,error:arrayerrors});
    }

    if(req.session.success){
        req.session.success = false;
        return res.render('posicao',{NavActivePos:true,MsgSuccess: true});
    }
   return res.render('posicao',{NavActivePos:true})
})

//VALIDAÇAO DA EMBALAGEM
app.post('/cadSetor',(req,res)=>{
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
        return res.redirect('/setor');
     }
 
     //SUCESSO NENHUM ERRO
     //SALVAR NO BANCO DE DADOS
     console.log('validação realzizada com sucesso')
     req.session.success = true;
     setorController.novoSetor(nome);
     res.redirect('/setor');
})

//VALIDAÇAO DA EMBALAGEM
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


//VALIDAÇAO DA POSICAO
app.post('/cadPos',(req,res)=>{
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
        return res.redirect('/posicao');
     }
 
     //SUCESSO NENHUM ERRO
     //SALVAR NO BANCO DE DADOS
     console.log('validação realzizada com sucesso')
     req.session.success = true;
     posicaoController.novaPosicao(nome);
     res.redirect('/posicao');
})




//PEGAR DADOS FORMULARIO PRODUTO
app.post('/prod',(req,res)=>{
    
    var qtd = parseInt(req.body.quantidade);
    var embalagem = req.body.embalagem;
    var posicao = req.body.posicao;
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

    //VALIDAR SE QUANTIDADE CONTEM SO NUMEROS
    if(!apenasNumeros.test(qtd)){
        errors.push({mensagem:'Quantidade inválida!'})
    }

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

    //VERIFICAR SE TEM UMA POSICAO OU SEJA TEM Q SER DIFERENTE DE POSICAO ESTOQUE E EMBALAGEM DIFERENTE DE EMBALAGEM PRODUTO

    if(embalagem == 'Embalagem produto' || posicao == 'Posição estoque') {
        errors.push({mensagem:"Embalagem ou Posição não selecionados!"})
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
       return res.render('produto',{NavActiveProd:true,error:errors});
    }

    //SUCESSO NENHUM ERRO
    //SALVAR NO BANCO DE DADOS
    console.log('validação realzizada com sucesso')
    req.session.success = true;

    productController.novoProduto(cod_barras,nome,posicao,largura,altura,peso,comprimento,embalagem,bloqueio,qtd)
    return res.render('produto',{NavActiveProd:true,MsgSuccess: true});
    
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
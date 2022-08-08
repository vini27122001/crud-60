const connection = require('../database/connection');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/ProductController');
const embalagemController = require('../controllers/embalagemController');
const posicaoController = require('../controllers/posicaoController');
const setorController = require('../controllers/setorController');
const controleController = require('../controllers/ControleController');


//////////////USUARIOS///////////////////////////////////

router.get('/users',userController.listarUsuarios);

router.post('/editar',userController.listarUmUsuario);

router.post('/atualizar',userController.atualizarUsuario);

router.post('/deletar',userController.deletarUmUsuario);





//////////////PRODUTOS///////////////////////////////////


router.post('/prod',productController.novoProduto);

router.get('/produtosListar',productController.listarProdutos);

router.post('/deletarProduto',productController.deletarUmProduto);

router.post('/editarProduto',productController.listarUmProduto);

router.post('/atualizarProduto',productController.atualizarProduto);

router.get('/produtos',embalagemController.listarEmbalagemsEPosicaoProd);




//////////////EMBALAGEMS///////////////////////////////////

router.get('/embalagemListar',embalagemController.listarEmbalagems);

router.post('/editarEmbalagem',embalagemController.listarUmaEmbalagem);

router.post('/atualizarEmbalagem',embalagemController.atualizarEmbalagem);

router.post('/deletarEmbalagem',embalagemController.deletarUmaEmbalagem);




//////////////POSICOES///////////////////////////////////

router.get('/posicaoListar',posicaoController.listarPosicoes);

router.post('/editarPosicao',posicaoController.listarUmaPosicao);

router.post('/atualizarPosicao',posicaoController.atualizarPosicao);

router.post('/deletarPosicao',posicaoController.deletarUmaPosicao);





//////////////SETORES///////////////////////////////////

router.get('/setorListar',setorController.listarSetores);

router.post('/editarSetor',setorController.listarUmSetor);

router.post('/atualizarSetor',setorController.atualizarSetor);

router.post('/deletarSetor',setorController.deletarUmSetor);




//////////////CONTROLE///////////////////////////////////

router.get('/controle',controleController.listarItems);

router.post('/entradaProduto',controleController.adicionarEntrada);


module.exports = router;
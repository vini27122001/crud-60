const connection = require('../database/connection');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/ProductController');
const embalagemController = require('../controllers/embalagemController');



router.get('/users',userController.listarUsuarios);

router.post('/editar',userController.listarUmUsuario);

router.post('/atualizar',userController.atualizarUsuario);

router.post('/deletar',userController.deletarUmUsuario);

router.post('/prod',productController.novoProduto);

router.get('/produtosListar',productController.listarProdutos);

router.post('/deletarProduto',productController.deletarUmProduto);

router.post('/editarProduto',productController.listarUmProduto);

router.post('/atualizarProduto',productController.atualizarProduto);

router.get('/embalagemListar',embalagemController.listarEmbalagems);

router.post('/editarEmbalagem',embalagemController.listarUmaEmbalagem);

router.post('/atualizarEmbalagem',embalagemController.atualizarEmbalagem);

router.post('/deletarEmbalagem',embalagemController.deletarUmaEmbalagem);

module.exports = router;
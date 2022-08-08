const { json } = require('express');
const database = require('../database/connection');
const session = require('express-session');



class ControleController {

    adicionarEntrada(req, res) {
        var qtd = req.body.qtd;
        var id_usuario = req.body.usuario;
        var cod_barra = req.body.produto;
        var id_setor = req.body.setor;
        var nulo = null;

        var qtdReal = 0;

        var data_entrada = new Date();


        database.select('*').table('produto').where({ cod_barra: cod_barra }).then(produtos => {

            console.log(produtos)

            qtdReal = produtos[0].qtd;

            qtdReal -= qtd;


            if (produtos[0].bloqueio == 1) {
                var arrayerrors = []
                arrayerrors.push({ mensagem: 'Produto Bloqueado!' })
                return res.render('controle', { NavActiveCont: true, error: arrayerrors });
            }



            database.select('*').table('usuario').where({ id_usuario: id_usuario }).then(usuarios => {



                if (usuarios[0].bloqueio == 1) {
                    var arrayerrors = []
                    arrayerrors.push({ mensagem: 'Usuario Bloqueado!' })
                    return res.render('controle', { NavActiveCont: true, error: arrayerrors });
                }

                database.where({ cod_barra: cod_barra }).update({ qtd: qtdReal }).table('produto').then(data => {
                    database.insert({ id_setor: id_setor, id_usuario: id_usuario, data_entrada: data_entrada, data_saida: nulo, qtd: qtd, cod_barra: cod_barra }).table("controle").then(data => {

                        return res.redirect('/controle');

                    }).catch(error => {

                    })

                })




            })



        })
    }

    //LISTAR OS ITEMS SELECT DENTRO DE SELECT PARA NAO BUGAR OS SELECT 
    listarItems(req, res) {
        console.log(req.body)

        var produto = [];
        var usuario = [];
        var setor = [];
        var posicao = [];

        database.select('*').table('usuario').then(usuarios => {
            usuario = usuarios

            database.select('*').table('produto').then(produtos => {

                produto = produtos

                database.select('*').table('setor').then(setores => {

                    setor = setores

                    database.select('*').table('posicao').then(teste => {

                        posicao = teste

                        database.select('*').table('embalagem').then(tarefas => {

                            return res.render('controle', { NavActiveCont: true, table: true, embalagems: tarefas, posicaos: posicao, usuarios: usuario, produtos: produto, setores: setor });

                        })

                    })

                })

            })
        })
    }
}


module.exports = new ControleController();
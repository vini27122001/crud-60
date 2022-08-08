const { json } = require('express');
const database = require('../database/connection');
const session = require('express-session');



class EmbalagemController {
    novaEmbalagem(nome) {

        database.insert({ tipo_embalagem: nome }).table("embalagem").then(data => {
            console.log(data)

        }).catch(error => {

        })
    }

    listarEmbalagems(req, res) {


        database.select('*').table('embalagem').then(tarefas => {
            if (tarefas.length > 0) {
                return res.render('embalagemListar', { NavActiveEmbList: true, table: true, embalagems: tarefas });
            } else {
                res.render('embalagemListar', { NavActiveEmbList: true, table: false });
            }
        }).catch(error => {
            console.log(error)
        })
    }

    //LISTAR A EMBALAGEM E A POSICAO NOS SELECTS 
    listarEmbalagemsEPosicaoProd(req, res) {
        var posicao = [];


        database.select('*').table('posicao').then(teste => {

            posicao = teste

            database.select('*').table('embalagem').then(tarefas => {
                if (tarefas.length > 0) {

                    return res.render('produto', { NavActiveProd: true, table: true, embalagems: tarefas, posicaos: posicao });
                } else {
                    res.render('produto', { NavActiveProd: true, table: false });
                }
            }).catch(error => {
                console.log(error)
            })

        })


    }

    listarUmaEmbalagem(req, res) {
        console.log(req.body)
        var id = req.body.id;


        database.select('*').table('embalagem').where({ id_embalagem: id }).then(teste => {


            return res.render('editarEmbalagem', { error: false, id_embalagem: id, tipo_embalagem: teste[0].tipo_embalagem });
        }).catch(error => {
            console.log(error)
            return res.render('editarEmbalagem', { error: true, problema: 'Não é possivel editar esse usuario' })
        })
    }

    atualizarEmbalagem(req, res) {

        var id = req.body.id
        var nome = req.body.tipo


        //ARRAY QUE VAI ARMAZENAR OS ERROS
        const erros = [];

        //REMOVER ESPAÇOS EM BRANCO ANTES E DEPOIS

        nome.trim();

        //LIMPAR O NOME DE CARACTERES ESPECIAIS
        nome = nome.replace(/[^A-zÀ-ú\s]/gi, '');

        //VERIFICAR SE ESTA VAZIO OU NAO DEFINIDO O CAMPO

        if (nome == '' || typeof nome == undefined || nome == null) {
            erros.push({ mensagem: "Campo nome nao pode ser vazio" });
        }

        //VERIFICAR SE O CAMPO NOME É VALIDO (APENAS LETRAS)
        if (!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)) {
            erros.push({ mensagem: "Nome inválido!" });
        }

        //VERIFICAR SE TEM ERROS
        if (erros.length > 0) {
            return res.status(400).send({ status: 400, erro: erros })
        }

        database.where({ id_embalagem: id }).update({ tipo_embalagem: nome }).table('embalagem').then(data => {

            return res.redirect('/embalagemListar');
        }).catch(error => {
            console.log(error)
        })
    }

    deletarUmaEmbalagem(req, res) {
        const id = req.body.id

        database.where({ id_embalagem: id }).del().table('embalagem').then(data => {
            res.redirect('/embalagemListar')
        }).catch(error => {
            if (error.code == 'ER_ROW_IS_REFERENCED_2') {
                res.redirect('/embalagemListar')
            } else {
                const erros = [];
                erros.push({ mensagem: 'Usuário não pode ser deletado' })
                req.session.success = true;
                req.redirect('/embalagemListar')
            }
        })
    }

}

module.exports = new EmbalagemController();
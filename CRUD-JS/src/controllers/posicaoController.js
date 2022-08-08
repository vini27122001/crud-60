const { json } = require('express');
const database = require('../database/connection');
const session = require('express-session');


class PosicaoController {
    novaPosicao(nome) {

        database.insert({ descricao: nome }).table("posicao").then(data => {
            console.log(data)

        }).catch(error => {

        })
    }

    listarPosicoes(req, res) {
        database.select('*').table('posicao').then(tarefas => {
            if (tarefas.length > 0) {
                return res.render('posicaoListar', { NavActivePosList: true, table: true, posicaos: tarefas });
            } else {
                res.render('posicaoListar', { NavActivePosList: true, table: false });
            }
        }).catch(error => {
            console.log(error)
        })
    }

    listarUmaPosicao(req, res) {
        var id = req.body.id;

        database.select('*').table('posicao').where({ id_posicao: id }).then(teste => {


            return res.render('editarposicao', { error: false, id_posicao: id, descricao: teste[0].descricao });
        }).catch(error => {
            console.log(error)
            return res.render('editarposicao', { error: true, problema: 'Não é possivel editar esse usuario' })
        })
    }

    atualizarPosicao(req, res) {
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

        database.where({ id_posicao: id }).update({ descricao: nome }).table('posicao').then(data => {

            return res.redirect('/posicaoListar');
        }).catch(error => {
            console.log(error)
        })
    }

    deletarUmaPosicao(req, res) {
        const id = req.body.id

        database.where({ id_posicao: id }).del().table('posicao').then(data => {
            res.redirect('/posicaoListar')
        }).catch(error => {
            if (error.code == 'ER_ROW_IS_REFERENCED_2') {
                res.redirect('/posicaoListar')
            } else {
                const erros = [];
                erros.push({ mensagem: 'Usuário não pode ser deletado' })
                req.session.success = true;
                req.redirect('/posicaoListar')
            }
        })
    }

}

module.exports = new PosicaoController();
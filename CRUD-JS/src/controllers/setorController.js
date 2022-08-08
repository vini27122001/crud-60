const { json } = require('express');
const database = require('../database/connection');
const session = require('express-session');


class SetorController {
    novoSetor(nome) {

        database.insert({ nome: nome }).table("setor").then(data => {
            console.log(data)

        }).catch(error => {

        })
    }

    listarSetores(req, res) {
        database.select('*').table('setor').then(tarefas => {
            if (tarefas.length > 0) {
                return res.render('setorListar', { NavActiveSetList: true, table: true, setors: tarefas });
            } else {
                res.render('setorListar', { NavActiveSetList: true, table: false });
            }
        }).catch(error => {
            console.log(error)
        })
    }

    listarUmSetor(req, res) {
        var id = req.body.id;

        database.select('*').table('setor').where({ id_setor: id }).then(teste => {


            return res.render('editarsetor', { error: false, id_setor: id, nome: teste[0].nome });
        }).catch(error => {
            console.log(error)
            return res.render('editarsetor', { error: true, problema: 'Não é possivel editar esse usuario' })
        })
    }

    atualizarSetor(req, res) {
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

        database.where({ id_setor: id }).update({ nome: nome }).table('setor').then(data => {

            return res.redirect('/setorListar');
        }).catch(error => {
            console.log(error)
        })
    }

    deletarUmSetor(req, res) {
        console.log(req.body)
        const id = req.body.id

        database.where({ id_setor: id }).del().table('setor').then(data => {
            res.redirect('/setorListar')
        }).catch(error => {
            if (error.code == 'ER_ROW_IS_REFERENCED_2') {
                const erros = [];
                erros.push({ mensagem: 'Usuário não pode ser deletado' })
                req.session.success = true;
                res.redirect('/setorListar')
            } else {
                res.redirect('/setorListar')
            }
        })
    }
}

module.exports = new SetorController();
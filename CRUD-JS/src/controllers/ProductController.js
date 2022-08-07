const { json } = require('express');
const database = require('../database/connection');
const session = require('express-session');


class ProductController {
    novoProduto(cod_barra,nome,largura,altura,peso,comprimento,bloqueio){
        
        var id_emb = 1;
        database.insert({cod_barra,nome,id_emb,largura,altura,peso,comprimento,id_emb,bloqueio}).table("produto").then(data=>{
            
            
        }).catch(error=>{
        console.log(error)
        return res.redirect('/produtos')
        })
    }

    listarProdutos(req,res){
        database.select('*').table('produto').then(tarefas=>{
            var formatada = [];
            if(tarefas.length > 0) {
                for(var i = 0; i < tarefas.length; i++) {
                    if(tarefas[i].bloqueio == 1){
                        formatada.push(tarefas[i]);
                        formatada[i].bloqueio = 'sim'
                    }else{
                        formatada.push(tarefas[i]);
                        formatada[i].bloqueio = 'não'
                    }
                }
                return res.render('produtosListar',{NavActiveProduto:true, table:true,produtos:formatada});
            }else {
                res.render('produtosListar',{NavActiveProduto:true, table:false});
            }
        }).catch(error=>{
            console.log(error)
        })
    }

    listarUmProduto(req,res){
        var id  = req.body.id;
          

        database.select('*').table('produto').where({cod_barra:id}).then(teste=>{
            
            if(teste[0].bloqueio == 1){
                teste[0].bloqueio = 'sim'
            }else{
                teste[0].bloqueio = 'nao'
            }
             return  res.render('editarProduto',{error:false, posicao:teste[0].id_pos, embalagem:teste[0].id_emb ,cod_barra:id, nome:teste[0].nome, bloqueio:teste[0].bloqueio, largura:teste[0].largura, altura:teste[0].altura , comprimento:teste[0].comprimento , peso:teste[0].peso});
        }).catch(error=>{
            console.log(error)
            return res.render('editarProduto',{error:true, problema:'Não é possivel editar esse usuario'})
        })
    }

    atualizarProduto(req,res){
        
        var bloqueio = req.body.bloqueio
        var id = req.body.id
        var nome = req.body.nome
        var posicao = req.body.posicao;
        var altura = req.body.altura;
        var peso = req.body.peso;
        var largura = req.body.largura;
        var comprimento = req.body.comprimento;
        var embalagem = req.body.embalagem;
        
        if(bloqueio == 'sim') {
            bloqueio = true;
        }else{
            bloqueio = false;
        }
        
    
        //ARRAY QUE VAI ARMAZENAR OS ERROS
        const erros = [];
    
        //REMOVER ESPAÇOS EM BRANCO ANTES E DEPOIS
    
            nome.trim();
    
        //LIMPAR O NOME DE CARACTERES ESPECIAIS
        nome = nome.replace(/[^A-zÀ-ú\s]/gi,'');
    
        //VERIFICAR SE ESTA VAZIO OU NAO DEFINIDO O CAMPO
    
        if(nome == '' || typeof nome == undefined || nome == null) {
            erros.push({mensagem: "Campo nome nao pode ser vazio"});
        }
    
        //VERIFICAR SE O CAMPO NOME É VALIDO (APENAS LETRAS)
        if(!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)){
            erros.push({mensagem: "Nome inválido!"});
        }
    
        //VERIFICAR SE TEM ERROS
        if(erros.length > 0) {
          return res.status(400).send({status:400, erro:erros})
        }

        database.where({cod_barra:id}).update({nome:nome,id_pos:posicao,largura:largura,altura:altura,peso:peso,comprimento:comprimento,id_emb:embalagem,bloqueio:bloqueio}).table('produto').then(data=>{
            
           return res.redirect('/produtosListar');
        }).catch(error=>{
            console.log(error)
        })
    }

    deletarUmProduto(req,res){
        const id = req.body.id

        database.where({cod_barra:id}).del().table('produto').then(data=>{
            res.redirect('/produtosListar')
        }).catch(error=>{
           if(error.code == 'ER_ROW_IS_REFERENCED_2'){
            res.redirect('/produtosListar')
           }else{
            const erros = [];
            erros.push({mensagem:'Produto não pode ser deletado'})
            req.session.success = true;
            req.redirect('/produtosListar')
           }
        })
    }
}

module.exports = new ProductController();
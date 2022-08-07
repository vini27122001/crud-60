const { json } = require('express');
const database = require('../database/connection');
const session = require('express-session');


class UserController {
    novaTarefa(nome,senha,bloqueio,data){

        database.insert({nome,senha,bloqueio,data}).table("usuario").then(data=>{
            console.log(data)
            
        }).catch(error=>{
            console.log(error)
        })
    }

    listarUsuarios(req,res){
        database.select('*').table('usuario').then(tarefas=>{
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
                return res.render('users',{NavActiveUsers:true, table:true,usuarios:formatada});
            }else {
                res.render('users',{NavActiveUsers:true, table:false});
            }
        }).catch(error=>{
            console.log(error)
        })
    }

    listarUmUsuario(req,res){
        var id  = req.body.id;  
          

        database.select('*').table('usuario').where({id_usuario:id}).then(teste=>{
            
            
           
            if(teste[0].bloqueio == 1){
                teste[0].bloqueio = 'sim'
            }else{
                teste[0].bloqueio = 'nao'
            }

            return  res.render('editar',{error:false, id:id, nome:teste[0].nome, bloqueio:teste[0].bloqueio,data:teste[0].data});
        }).catch(error=>{
            console.log(error)
            return res.render('editar',{error:true, problema:'Não é possivel editar esse usuario'})
        })
    }

    atualizarUsuario(req,res){
        
        var bloqueio = req.body.bloqueio
        var id = req.body.id
        var nome = req.body.nome
        
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

        database.where({id_usuario:id}).update({bloqueio:bloqueio,nome:nome}).table('usuario').then(data=>{
            
           return res.redirect('/users');
        }).catch(error=>{
            console.log(error)
        })
    }

    deletarUmUsuario(req,res){
        const id = req.body.id

        database.where({id_usuario:id}).del().table('usuario').then(data=>{
            res.redirect('/users')
        }).catch(error=>{
           if(error.code == 'ER_ROW_IS_REFERENCED_2'){
            res.redirect('/users')
           }else{
            const erros = [];
            erros.push({mensagem:'Usuário não pode ser deletado'})
            req.session.success = true;
            req.redirect('/users')
           }
        })
    }

}

module.exports = new UserController();
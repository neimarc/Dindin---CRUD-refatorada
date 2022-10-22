const express = require('express');
const listarCategorias = require('./controladores/categorias');
const { login } = require('./controladores/login');
const {listarTransacoes, detalharTransacao, cadastrarTransacao, atualizarTransacao, 
    excluirTransacao,
    extratoTransacoes} = require('./controladores/transacoes');
const { cadastrarUsuario, obterPerfilUsuario, 
    atualizarPerfilUsuario } = require('./controladores/usuarios');
const filtroDeAutenticacao = require('./intermediarios/filtroDeAutenticacao');
const rotas = express();



rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);


rotas.use(filtroDeAutenticacao);
rotas.get('/usuario', obterPerfilUsuario); 
rotas.put('/usuario', atualizarPerfilUsuario); 

rotas.get('/categoria', listarCategorias);

rotas.get('/transacao', listarTransacoes);
rotas.get('/transacao/:extrato', extratoTransacoes);
rotas.get('/transacao/:id', detalharTransacao); 
rotas.post('/transacao', cadastrarTransacao);
rotas.put('/transacao/:id', atualizarTransacao);
rotas.delete('/transacao/:id', excluirTransacao);

module.exports = rotas
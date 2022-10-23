

const {knex} = require('../bancodedados/conexao');


const jwt = require('jsonwebtoken');



const filtroDeAutenticacao = async (req, res, next) => {
    
    const { authorization } = req.headers;

    
    if (!authorization) {
        return res.status(401).json({ mensagem: 'O usuário não está autenticado' });
    }

    try {
        
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, process.env.SENHA_JWT);

        const existeUsuario = await knex('usuarios').where({id}).first();

        if (!existeUsuario) {
            return res.status(404).json('Usuário não encontrado');
        }

        const { senha, ...usuario } = existeUsuario;

        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

module.exports = filtroDeAutenticacao;

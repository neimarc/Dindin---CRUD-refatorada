const { knex } = require('../bancodedados/conexao');
const bcrypt = require('bcrypt');
const cadastroSchema = require('../validacoes/cadastroSchema');
const atualizacaoSchema = require('../validacoes/atualizacaoSchema');


const cadastrarUsuario = async (req, res) => {
    
    const { nome, email, senha } = req.body;

    try {
        await cadastroSchema.validate(req.body);

       const existeUsuario = await knex('usuarios').where({email}).first();
        
        if (existeUsuario) {
            return res.status(403).json({ mensagem: "O e-mail já está cadastrado" });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const insereCadastro = await knex('usuarios').insert({ nome, email, senha: senhaCriptografada }).returning('*');

        if (!insereCadastro) {
            return res.status(400).json({ mensagem:"O usuário não foi cadastrado"});
        }

        const { senha: _, ...cadastro } = insereCadastro[0];

        return res.status(200).json(cadastro);

    } 
    catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }

}

const obterPerfilUsuario = async (req, res) => {
     
    return res.json(req.usuario);
}

const atualizarPerfilUsuario = async (req, res) => {
    
    let { nome, email, senha } = req.body;
    const {id} = req.usuario; 

    if(!nome && !email && !senha) {
        return res.status(404).json({mensagem: "É necessário ao menos um campo para atualizar"})
    }

    try {
        await atualizacaoSchema.validate(req.body);

        const existeUsuario = await knex('usuarios').where({id}).first();

        if(!existeUsuario) {
            return res.status(404).json('Usuario não encontrado');
        }

        if (email && email !== req.usuario.email) {
            const emailJaExiste = await knex('usuarios').where({email}).first();

            if (emailJaExiste) {

                return res.status(400).json({ mensagem: 'Já existe cadastro para o novo e-mail.' });
            }
        }
        
        if (senha) {
            senha = await bcrypt.hash(senha, 10);
        }

        const usuarioAtualizado = await knex('usuarios').where({id}).update({ nome, email, senha});


        if (!usuarioAtualizado) {
            return res.status(400).json({ mensagem: "O usuário não foi atualizado" });
        }
        return res.status(204).send();

    }
    catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}


module.exports = {
    cadastrarUsuario,
    obterPerfilUsuario,
    atualizarPerfilUsuario
}
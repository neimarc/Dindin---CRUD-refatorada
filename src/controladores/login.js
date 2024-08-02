
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { knex } = require('../bancodedados/conexao');
const loginSchema = require('../validacoes/loginSchema');

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {

        await loginSchema.validate(req.body);

        const usuario = await knex('usuarios').where({ email }).first();

        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }


        const comparaSenha = await bcrypt.compare(senha, usuario.senha);

        if (!comparaSenha) {
            return res.status(400).json({ mensagem: 'E-mail ou senha estão incorretos' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.SENHA_JWT, { expiresIn: '2h' });

        const { senha: _, ...dadosUsuario } = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });

    }
    catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}


module.exports = { login }
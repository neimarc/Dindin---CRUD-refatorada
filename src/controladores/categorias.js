const {knex} = require('../bancodedados/conexao');


const listarCategorias = async (req, res) => {

    try {
        const categorias = await knex('categorias').returning('*');
        return res.json(categorias);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }

}

module.exports = listarCategorias;
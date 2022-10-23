
const {knex, query} = require('../bancodedados/conexao');

const { cadastrarTransacaoSchema, atualizarTransacaoSchema } = require('../validacoes/transacaoSchema');



const listarTransacoes = async (req, res) => {
    const {usuario} = req;

    const {filtro} = req.query;
    
    if(filtro && !Array.isArray(filtro)){
        return res.status(400).json({mensagem: 'O filtro precisa ser um array'})
    }

    try {

        let queryLike = '';
        let arrayFiltro;
        
        if (filtro) {

            arrayFiltro += filtro.map((item) => `%${item}%`);

        
            queryLike += `and c.descricao ilike any($2)`;
            
        }
        
        const queryTransacoes = `
            select t.*, c.descricao as categoria_nome from transacoes t
            left join categorias c
            on t.categoria_id = c.id
            where t.usuario_id = $1
            ${queryLike}
        `        
        const paramFiltro = filtro ? [usuario.id, arrayFiltro] : [usuario.id];
        const transacoes = await query(queryTransacoes, paramFiltro);
        return res.json(transacoes.rows);
        

        // else {
            
        //     const transacoes1 = await knex('transacoes').where({'usuario_id': usuario.id}).returning('*');
    
        //     return res.json(transacoes1);
        // }

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}


const detalharTransacao = async (req, res) => {
    const {usuario} = req;
    const {id} = req.params; 
    
    try {
        
       const transacao = await knex('transacoes').where({'usuario_id': usuario.id, 'id': id });
        
        
        if(transacao <= 0) {
            return res.status(404).json({mensagem: 'Transação não encontrada'});
        }
        
        return res.json(transacao);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

const cadastrarTransacao = async (req, res) => {
    const {usuario} = req;
    const {descricao, valor, data, categoria_id, tipo} = req.body;

   
    if(tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({mensagem: 'O tipo precisa ser "entrada" ou "saída"'});
    }
    
    try {
        
        await cadastrarTransacaoSchema.validate(req.body);
        
       const categoria = await knex('categorias').where({'id': categoria_id });

        if(categoria <= 0) {
            return res.status(404).json({mensagem: 'Categoria não encontrada'});
        }

        const transacaoCadastrada = await knex('transacoes').insert({tipo, descricao, valor, data, 'usuario_id': usuario.id, categoria_id}).returning('*');

        if(transacaoCadastrada <= 0) {
            return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        }
        
        const transacao = transacaoCadastrada[0];
        transacao.categoria_nome = categoria[0].descricao;

        return res.status(201).json(transacao);

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
        
    }
}

const atualizarTransacao = async (req, res) => {
    const {usuario} = req;
    const {descricao, valor, data, categoria_id, tipo} = req.body;
    const {id} = req.params; 

    
    if(!descricao && !valor && !data && !categoria_id && !tipo) {
        return res.status(404).json({mensagem: "É necessário ao menos um campo para atualizar"})
    }
    
    if(tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({mensagem: 'O tipo precisa ser "entrada" ou "saída"'});
    }
    
    try {
        await atualizarTransacaoSchema.validate(req.body);
        
        const transacao = await knex('transacoes').where({'usuario_id': usuario.id, 'id': id });
        
        if(transacao <= 0) {
            return res.status(404).json({mensagem: 'Transação não encontrada'});
        }

        const categoria = await knex('categorias').where({'id': categoria_id });

        if(categoria <= 0) {
            return res.status(404).json({mensagem: 'Categoria não encontrada'});
        }

        const transacaoAtualizada = await knex('transacoes').where({id}).update({descricao, valor, data, categoria_id, tipo});

        if (transacaoAtualizada <= 0) {
                return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
            }

            return res.status(204).send();  

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }

}

const excluirTransacao = async (req, res) => {
    const {usuario} = req;
    const {id} = req.params;

    if (!id) {
        return res.status(400).json({mensagem: 'Número do id é requerido.'})
    }
    
    try {
        const existeTransacao = await knex('transacoes').where({'usuario_id': usuario.id, id}).returning('*');
    
        if(existeTransacao <= 0) {
            return res.status(404).json({mensagem: 'Transacao não encontrada'});
        } 
        
        const transacaoDeletada = await knex('transacoes').where({'usuario_id': usuario.id, id}).delete('*');
    
            if(transacaoDeletada <= 0) {
                return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
            }
    
        return res.send();
        

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
}

const extratoTransacoes = async (req, res) => {
    const {usuario} = req
    
    
    try {
        
        const saldoEntrada = await knex('transacoes').where({'usuario_id': usuario.id, 'tipo': 'entrada'}).sum('valor').returning('*');
        const saldoSaida = await knex('transacoes').where({'usuario_id': usuario.id, 'tipo': 'saida'}).sum('valor').returning('*');
        
        return res.json({
            entrada: Number(saldoEntrada[0].sum) ?? 0,
            saida: Number(saldoSaida[0].sum) ?? 0
        })

    } catch (error) {
        return res.status(500).json({ mensagem: `Erro interno: ${error.message}` });
    }
     
}

module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao,
    extratoTransacoes
};
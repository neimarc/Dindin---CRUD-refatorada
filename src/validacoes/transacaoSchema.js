const yup = require('./configuracao');

const cadastrarTransacaoSchema = yup.object().shape({
    descricao: yup.string().required(),
	valor: yup.number().integer().required(),
	data: yup.date().max(new Date(), 'Não é possível incluir uma data futura').required(),
	categoria_id: yup.number().required(),
	tipo: yup.string().required()
})

const atualizarTransacaoSchema = yup.object().shape({
    descricao: yup.string(),
	valor: yup.number().integer(),
	data: yup.date().max(new Date(), 'Não é possível incluir uma data futura'),
	categoria_id: yup.number(),
	tipo: yup.string()
})

module.exports = {
    cadastrarTransacaoSchema,
	atualizarTransacaoSchema
}
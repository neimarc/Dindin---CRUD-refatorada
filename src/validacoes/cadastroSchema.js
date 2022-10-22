const yup = require('./configuracao');

const cadastroSchema = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().email().required(),
    senha: yup.string().required()
})

module.exports = cadastroSchema;
const yup = require('./configuracao');

const atualizacaoSchema = yup.object().shape({
    nome: yup.string(),
    email: yup.string().email(),
    senha: yup.string()
})

module.exports = atualizacaoSchema;
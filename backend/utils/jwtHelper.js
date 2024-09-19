// Ce fichier utilitaire permet de centraliser la gestion des JSON Web Tokens dans un fichier utilitaire pour simplifier leur création, validation et renouvellement

const jwt = require('jsonwebtoken')
const secret = process.env.SECRET

module.exports = {
    createToken(payload) {
        return jwt.sign(payload, secret, { expiresIn: '1h' })
    },

    verifyToken(token) {
        try {
            return jwt.verify(token, secret)
        } catch (err) {
            return null
        }
    }
}

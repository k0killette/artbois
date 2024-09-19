const Joi = require('joi');

// Middleware pour valider les données utilisateur
const validateUser = (req, res, next) => {
    // Schéma de validation des données avant l'enregistrement d'un utilisateur
    const userSchema = Joi.object({
            firstname: Joi.string()
                .alphanum()
                .min(3)
                .max(50)
                .required(),

            lastname: Joi.string()
                //.alphanum() on ne s'en sert pas ici pour autoriser les noms composés utilisant des tirets ou les noms avec accent
                .min(3)
                .max(50)
                .required(),

            email: Joi.string()
                .email({ minDomainSegments: 2 })
                .min(5)
                .max(100)
                .required(),

            password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,30}$')) // Mot de passe fort avec minimum 8 caractères, des chiffres, lettres maj/min et caractères spéciaux
                .required(),

            repeat_password: Joi.any()
                .valid(Joi.ref('password')) // Valide la correspondance avec password
                .required()
                .messages({ 'any.only': 'Les mots de passe doivent être identiques' }),

            address_1: Joi.string()
                .min(5)
                .max(255)
                .required(),

            address_2: Joi.string()
                .min(5)
                .max(255)
                .optional(),

            zip: Joi.string()
                .pattern(new RegExp('^[0-9]{4,10}$')) // Code postal numérique
                .required(),

            city: Joi.string()
                .min(3)
                .max(100)
                .required(),

            phone: Joi.string()
                .pattern(new RegExp('^[0-9]{10,20}$')) // Numéro de téléphone uniquement composé de chiffres
                .required(),
        })
        .with('password', 'repeat_password') // Assure que repeat_password est requis si password est présent
        .options({ abortEarly: false }) // Affiche toutes les erreurs dans le terminal, et pas seulement la première erreur rencontrée

    // Validation des données présentes dans req.body
    const { error } = userSchema.validate(req.body)

    if (error) {
        return res.json({ status: 400, message: "Erreur de validation des données utilisateur", details: error.details })
    }

    // Si la validation est réussie, on passe à la prochaine étape
    next()
}

// Middleware pour valider les données de connexion
const validateLogin = (req, res, next) => {
    const loginSchema = Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
        .min(8)
        .required()
    })
    
    const { error } = loginSchema.validate(req.body)
    if (error) {
        return res.json({ status: 400, message: "Erreur de validation de la connexion", details: error.details });
    }

    next()
}

// Middleware pour valider les données d'une commande
const validateOrder= (req, res, next) => {
    const orderSchema = Joi.object({
        user_id: Joi.number()
            .integer()
            .required(),
        basket: Joi.array().items(
            Joi.object({
                id: Joi.number()
                    .integer()
                    .required(),
                quantityInCart: Joi.number()
                    .integer()
                    .min(1)
                    .required()
            })
        ).required()
    })

    const { error } = orderSchema.validate(req.body)
    if (error) {
        return res.json({ status: 400, message: "Erreur de validation de la commande", details: error.details });
    }

    next()
}



module.exports = { validateUser, validateLogin, validateOrder }

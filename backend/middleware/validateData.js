/* Ces middlewares permettent la validation des données des utilisateurs, des connexions et des commandes. 
Il utilise la bibliothèque Joi pour définir et appliquer des schémas de validation sur les requêtes HTTP. */

const Joi = require('joi') // Bibliothèque de validation des données

// Middleware pour valider les données avant l'enregistrement d'un utilisateur (inscription ou mise à jour)
const validateUser = (req, res, next) => {
    // Schéma de validation pour les informations de l'utilisateur
    const userSchema = Joi.object({
            firstname: Joi.string()
                .min(3)
                .max(50)
                .required()
                .messages({
                    'string.min': 'Le prénom doit comporter au moins 3 caractères',
                    'string.max': 'Le prénom ne peut pas dépasser 50 caractères',
                    'any.required': 'Le prénom est requis'
                }),

            lastname: Joi.string()
                .min(3)
                .max(50)
                .required()
                .messages({
                    'string.min': 'Le nom doit comporter au moins 3 caractères',
                    'string.max': 'Le nom ne peut pas dépasser 50 caractères',
                    'any.required': 'Le nom est requis'
                }),

            email: Joi.string()
                .email({ minDomainSegments: 2 })
                .min(5)
                .max(100)
                .required()
                .messages({
                    'string.email': 'Veuillez entrer une adresse e-mail valide',
                    'string.min': 'L\'adresse e-mail doit comporter au moins 5 caractères',
                    'any.required': 'L\'adresse e-mail est requise'
                }),

            password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,30}$')) // Mot de passe fort avec minimum 8 caractères, des chiffres, des lettres maj/min et des caractères spéciaux
                .required()
                .messages({
                    'string.pattern.base': 'Le mot de passe doit comporter au minimum 8 caractères, des chiffres, des lettres majuscules et minuscules et des caractères spéciaux',
                    'any.required': 'Le mot de passe est requis'
                }),

            repeat_password: Joi.any()
                .valid(Joi.ref('password')) // Valide la correspondance avec password
                .required()
                .messages({ 
                    'any.only': 'Les mots de passe doivent être identiques',
                    'any.required': 'La confirmation du mot de passe est requise'
                }),

            address_1: Joi.string()
                .min(5)
                .max(255)
                .required()
                .messages({
                    'string.min': 'L\'adresse doit comporter au moins 5 caractères',
                    'any.required': 'L\'adresse est requise'
                }),

            address_2: Joi.string()
                .max(255)
                .allow(''), //Champ optionnel

            zip: Joi.string()
                .pattern(new RegExp('^[0-9]{4,10}$')) // Code postal numérique
                .required()
                .messages({
                    'string.pattern.base': 'Le code postal ne peut comporter que des chiffres',
                    'any.required': 'Le code postal est requis'
                }),

            city: Joi.string()
                .min(3)
                .max(100)
                .required()
                .messages({
                    'string.min': 'La ville doit comporter au moins 3 caractères',
                    'any.required': 'La ville est requise'
                }),

            phone: Joi.string()
                .pattern(new RegExp('^[0-9]{10,20}$')) // Numéro de téléphone uniquement composé de chiffres
                .required()
                .messages({
                    'string.pattern.base': 'Le numéro de téléphone ne peut comporter que des chiffres',
                    'any.required': 'Le numéro de téléphone est requis'
                }),

            terms_accepted: Joi.boolean()
                .valid(true) // Assure que les conditions générales sont acceptées
                .required()
                .messages({
                    'any.only': 'Vous devez accepter les conditions générales',
                }),
                
            recaptcha_token: Joi.string()
                .required() // Vérification du token reCAPTCHA 
        })
        .with('password', 'repeat_password') // Assure que repeat_password est requis si password est présent
        .options({ abortEarly: false }) // Affiche toutes les erreurs dans le terminal, et pas seulement la première erreur rencontrée

    // Validation des données de la requête présentes dans req.body
    const { error } = userSchema.validate(req.body)

    if (error) {
        console.log("Erreurs de validation renvoyées : ", error.details)
        return res.json({ status: 400, message: "Erreur de validation des données utilisateur", details: error.details })
    }

    // Si la validation est réussie, on passe à l'étape suivante
    next()
}

// Middleware pour valider les données de connexion
const validateLogin = (req, res, next) => {
    // Schéma de validation pour les informations de connexion
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
        return res.json({ status: 400, message: "Erreur de validation de la connexion", details: error.details })
    }

    next()
}

// Middleware pour valider les données d'une commande
const validateOrder = (req, res, next) => {
    // Schéma de validation pour les informations des commandes
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
        return res.json({ status: 400, message: "Erreur de validation de la commande", details: error.details })
    }

    next()
}

module.exports = { validateUser, validateLogin, validateOrder }

// Ce fichier utilitaire permet de valider les données (format des e-mails, puissance des mots de passe, valeurs numériques...) saisies dans les champs des formulaires avant de les enregistrer dans la base de données. Cela évite de répéter les mêmes vérifications dans plusieurs contrôleurs.

module.exports = {
    isEmailValid(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    },

    isPasswordStrong(password) {
        // Minimum 8 caractères, avec lettres maj/min, chiffres et symboles
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        return passwordRegex.test(password)
    }
}

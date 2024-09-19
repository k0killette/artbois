const bcrypt = require('bcrypt');


const saltRounds = 10 // Nombre de tours de salage : saler un mot de passe signifie lui ajouter des caractères aléatoires au moment de la génération du hash de sorte à rendre chaque hashage quasi-unique. Ainsi deux mots de passe identiques n'auront pas le même hash

module.exports = {
    hashPassword: (plainPassword) => {
        return bcrypt.hash(plainPassword, saltRounds);
    },

    comparePassword: (plainPassword, hashedPassword) => {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

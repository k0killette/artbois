import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { loginUser } from "../../api/user"
import { useDispatch } from "react-redux"
import { connectUser } from "../../slices/userSlice"

const Login = (props) => {
    // Déclaration des states pour stocker les valeurs de l'email, du mot de passe, les erreurs et la redirection
    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [redirect, setRedirect] = useState(false)

    // Avant de tenter de se connecter on vérifie d'abord si un token existe déjà dans le localStorage, ainsi si l'utilisateur est déjà connecté on le redirige automatiquement
    useEffect(() => {
        const token = window.localStorage.getItem('artbois-token')
        if (token) {
            setRedirect(true)
        }
    }, [])

    // Fonction de gestion de la soumission du formulaire
    const onSubmitForm = (e) => {
        e.preventDefault()
        // On réinitialise l'état de l'erreur à null avant de traiter les informations de connexion
        setError(null)
        // On crée l'objet data contenant les informations du formulaire
        const data = {
            email: email,
            password: password
        }

        // On appelle la fonction loginUser qui interagit avec l'API pour se connecter
        loginUser(data)
            .then((res) => {
                // Si la connexion est réussie, on stocke le token dans le localStorage
                if (res.status === 200) {
                    window.localStorage.setItem('artbois-token', res.token)
                    // On ajoute l'utilisateur connecté au store de Redux
                    let newUser = res.user
                    newUser.token = res.token
                    // On ordonne la connexion à redux
                    dispatch(connectUser(newUser))
                    // On redirige vers la page d'accueil
                    setRedirect(true)
                }
                else {
                    setError(res.msg)
                }
            })
            .catch((err) => {
                console.log(err)
                setError("Une erreur est survenue")
            })
    }

    // Fonction générique pour mettre à jour les valeurs d'email et de mot de passe
    const handleChange = (e) => {
        switch (e.currentTarget.name) {
            case "email":
                setEmail(e.currentTarget.value) // Mise à jour de l'email
                break;
            case "password":
                setPassword(e.currentTarget.value) // Mise à jour du mot de passe
                break;
        }
    }

    // Si l'utilisateur est connecté ou redirigé, on le redirige vers la page d'accueil
    if (redirect) {
        return <Navigate to="/" />
    }

    return (
        <main>
            <h1>Se connecter</h1>
            <section>
                {/* Affichage d'un message d'erreur si la connexion échoue */}
                {error !== null && <p style={{color:`$warningColor`}}>{error}</p>}
                    <form onSubmit={onSubmitForm} id="login">
                        {/* Champ pour saisir l'email */}
                        <label>Adresse e-mail</label>
                        <input type="email" name="email" placeholder="Adresse e-mail" onChange={handleChange} required />
                        {/* Champ pour saisir le mot de passe */}
                        <label>Mot de passe</label>
                        <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
                        {/* Bouton pour soumettre le formulaire */}
                        <button type="submit"><span>Se connecter</span></button>
                    </form>
            </section>
        </main>)
}

export default Login

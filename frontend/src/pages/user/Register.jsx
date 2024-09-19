import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { addOneUser } from "../../api/user"

const Register = (props) => {

    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [address_1, setAddress_1] = useState("")
    const [address_2, setAddress_2] = useState("")
    const [zip, setZip] = useState(0)
    const [city, setCity] = useState("")
    const [phone, setPhone] = useState("")

    const [redirect, setRedirect] = useState(false)
    const [error, setError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const [success, setSuccess] = useState(null)


    const onSubmitForm = (e) => {
        e.preventDefault()
        setError(null)
        setPasswordError(null)

        // Vérification de la concordance des mots de passe 
        if (password !== confirmPassword) {
            setPasswordError("Les mots de passe ne correspondent pas")
            return
        }

        const data = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            address_1: address_1,
            address_2: address_2,
            zip: zip,
            city: city,
            phone: phone
        }

        addOneUser(data)
            .then((res) => {
                if (res.status === 200) {
                    setSuccess("Votre compte a bien été créé")
                    setRedirect(true)
                }
                else {
                    setError(res.msg)
                }
            })
            .catch(err => console.log(err))
    }

    const handleChange = (e) => {
        switch (e.currentTarget.name) {
            case "firstname":
                setFirstname(e.currentTarget.value)
                break;
            case "lastname":
                setLastname(e.currentTarget.value)
                break;
            case "email":
                setEmail(e.currentTarget.value)
                break;
            case "password":
                setPassword(e.currentTarget.value)
                break;
            case "confirmPassword":
                setConfirmPassword(e.currentTarget.value)
                break;
            case "address_1":
                setAddress_1(e.currentTarget.value)
                break;
            case "address_2":
                setAddress_2(e.currentTarget.value)
                break;
            case "zip":
                setZip(e.currentTarget.value)
                break;
            case "city":
                setCity(e.currentTarget.value)
                break;
            case "phone":
                setPhone(e.currentTarget.value)
                break;
        }
    }

    if (redirect) {
        return <Navigate to="/login" />
    }

    return (
        <main>
                    <h1>Créer un compte</h1>
                    <section>
                        {error !== null && <p style={{color: '$warningColor'}}>{error}</p>}
                        { success !== null && <div>
                            <p>{success}</p>
                            <p>Cliquez sur ce bouton pour vous connecter</p><button><Link to="/login">Se connecter</Link></button>
                        </div>
                        }
                        <form onSubmit={onSubmitForm} id="register">
                            <label>Pénom</label>
                            <input type="text" name="firstname" placeholder="Votre prénom" onChange={handleChange} required />
                            
                            <label>Nom</label>
                            <input type="text" name="lastname" placeholder="Votre nom" onChange={handleChange} required />
                            
                            <label>Adresse e-mail</label>
                            <input type="email" name="email" placeholder="Votre mail" onChange={handleChange} required />
                            
                            <label>Mot de passe</label>
                            <input type="password" name="password" placeholder="Votre mot de passe" onChange={handleChange} required />
                            
                            <label>Confirmation du mot de passe</label>
                            <input type="password" name="confirmPassword" placeholder="Confirmez votre mot de passe" onChange={handleChange} required />
                            {/* Affichage du message d'erreur */}
                            {passwordError && <p style={{color: '$warningColor'}}>{passwordError}</p>}
                            
                            <label>Adresse</label>
                            <input type="text" name="address_1" placeholder="Votre adresse" onChange={handleChange} required />
                            
                            <label>Complément d'adresse</label>
                            <input type="text" name="address_2" placeholder="Complément d'adresse" onChange={handleChange} />
                            
                            <label>Code postal</label>
                            <input type="number" name="zip" placeholder="Votre code postal" onChange={handleChange} required />
                            
                            <label>Ville</label>
                            <input type="text" name="city" placeholder="Votre ville" onChange={handleChange} required />
                            
                            <label>Numéro de téléphone</label>
                            <input type="text" name="phone" placeholder="Votre téléphone" onChange={handleChange} required />
                            
                            <button type="submit"><span>Enregistrer</span></button>
                        </form>
                    </section>
                </main>
    )
}

export default Register

import {useState, useEffect} from "react"
import {useSelector, useDispatch} from "react-redux"
import {selectUser, connectUser, logoutUser} from "../../slices/userSlice"
import {updateProfil, deleteUser} from "../../api/user"
import {useNavigate} from "react-router-dom"


const Profile = (props) => {
    
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [msg, setMsg] = useState(null)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [address, setAddress] = useState("")
    const [zip, setZip] = useState(0)
    const [city, setCity] = useState("")
    const [phone, setPhone] = useState("")
    
    const removeUser = (e) => {
        e.preventDefault()
        deleteUser(user.infos.id)
        .then((res) => {
            if(res.status === 200) {
                window.localStorage.removeItem("b4y-token")
                dispatch(logoutUser())
                navigate("/login")
            } else {
                setMsg("Oups, impossible de supprimer le compte!")
            }
        })
        .catch(err=>console.log(err))
    }
    const onSubmitForm =  (e) => {
        e.preventDefault()
        setMsg(null)
        const datas = {
            firstName,
            lastName,
            address,
            zip,
            city,
            phone
        }
        //on envoi la demande de modification vers le back
        updateProfil(datas, user.infos.id)
        .then((res)=>{
            if(res.status !== 200){
                setMsg("Erreur lors de la modification")
            } else {
                //notre utilisateur n'est plus à jour dans redux on va le mettre à jour, on recup les infos d'user mis à jour par la requète ajax
                const token = window.localStorage.getItem("b4y-token")
                //on stock les infos récupérés dans la requète ajax
                let newUser = res.newUser
                newUser.token = token
                //on met à jour le store de redux
                dispatch(connectUser(newUser))
                setMsg('Profil modifié avec succés!')
            }
        })
        .catch(err=>console.log(err))
    }
    
    useEffect(()=>{
        setFirstName(user.infos.firstName)
        setLastName(user.infos.lastName)
        setAddress(user.infos.address)
        setZip(user.infos.zip)
        setCity(user.infos.city)
        setPhone(user.infos.phone)
    }, [user])
    
    return (<section>
        <h2 style={{textAlign: "center"}}>Mon profil</h2>
        {msg !== null && <p style={{textAlign: "center"}}>{msg}</p>}
        <form
                className="b-form"
                onSubmit={onSubmitForm}  
            >
                <input type="text"
                    defaultValue={user.infos.firstName}
                    onChange={(e)=>{
                        setFirstName(e.currentTarget.value)
                    }}
                />
                <input type="text"
                    defaultValue={user.infos.lastName}
                    onChange={(e)=>{
                        setLastName(e.currentTarget.value)
                    }}
                />
                <input type="text"
                    defaultValue={user.infos.address}
                    onChange={(e)=>{
                        setAddress(e.currentTarget.value)
                    }}
                />
                <input type="number"
                    defaultValue={user.infos.zip}
                    onChange={(e)=>{
                        setZip(e.currentTarget.value)
                    }}
                />
                <input type="text"
                    defaultValue={user.infos.city}
                    onChange={(e)=>{
                        setCity(e.currentTarget.value)
                    }}
                />
                <input type="text"
                    defaultValue={user.infos.phone}
                    onChange={(e)=>{
                        setPhone(e.currentTarget.value)
                    }}
                />
                <input type="submit" name="Enregistrer"/>
            </form>
            <button
                style={{textAlign: "center", backgroundColor: "red", color:"white", display:"block", margin: "10px auto", padding: "10px"}}
                onClick={removeUser}
            >
                Supprimer mon compte
            </button>
    </section>)
}

export default Profile
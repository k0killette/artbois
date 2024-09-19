import {useState, useEffect} from "react"
import {config} from "../config"
import {Link} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import PopUp from "./Popup"
import {useSelector, useDispatch} from "react-redux"
import {selectBasket, modifyBasket} from "../slices/basketSlice"

//composant de carte d'un produit
const ArticleDetail = (props) => {
    //on récup notre panier
    const basket = useSelector(selectBasket)
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState("")
    const [error, setError] = useState(false)
    const [isPopUp, setIsPopUp] = useState(false)
    
    //fonction d'ajout au panier
    const onClickBasket = (oldBasket, newProduct) => {
        let myQuantity
        //si il n'a rien écrit dans l'input de quantité
        if(quantity === ""){
            myQuantity = 1
            setQuantity(1)
        } else {
            myQuantity = parseInt(quantity)
        }
        
        if(isNaN(myQuantity || myQuantity <= 0)){
            setError("Veuillez saisir un nombre positif svp!")
        } else {
            setError(null)
            //je clone le panier en faisant péter le read only pour pouvoir le manipuler
            let newBasket = JSON.parse(JSON.stringify(oldBasket))
            //on va parcourir le panier pour vérifier si le produit qu'on veut ajouter et déjà présent ou non
            const same = newBasket.findIndex((b) => b.id === newProduct.id)
            //le produit n'existe pas
            if(same === -1){
                //le newProduct est aussi en read only (props) on le fait péter
                let myProduct = JSON.parse(JSON.stringify(newProduct))
                //on crée une nouvelle propriété pour savoir la quantitée qu'on met au panier
                myProduct.quantityInCart = myQuantity
                //on récupère le panier précédent en ajoutant le produit
                let myBasket = [...newBasket, myProduct]
                //on pousse le panier mis à jour dans le localStorage
                let lsBasket = JSON.stringify(myBasket)
                window.localStorage.setItem("b4y-basket", lsBasket)
                //on pousse dans le store de redux
                dispatch(modifyBasket(myBasket))
            } else {
                //le produit existe déjà dans le panier on rajoute de la quantitée
                newBasket[same].quantityInCart += myQuantity
                //on pousse le panier mis à jour dans le storage
                let lsBasket = JSON.stringify(newBasket)
                window.localStorage.setItem("b4y-basket", lsBasket)
                //on pousse dans le store de redux
                dispatch(modifyBasket(newBasket))
            }
            setIsPopUp(true)
        }
    }
    
    return (<li className="product-mosaic">
        {/* POPUP */}
        {isPopUp && <PopUp 
            msg={`Vous avez ajouté: ${quantity} bière(s) dans votre panier!`}
            onClickClose={()=>{
                setIsPopUp(false)
                setQuantity("")
            }}
        />}
        
        {error !== null && <p>{error}</p>}
        <Link to={`/detail/${props.prod.id}`}>
            <div>
                <h3>{props.prod.name}</h3>
                <img src={config.pict_url + props.prod.photo} alt={`image de la bière ${props.prod.name}`} />
                <p>{props.prod.description.substr(0,50)}</p>
                <p>prix: {props.prod.price} €</p>
            </div>
        </Link>
        <form
            onSubmit={(e)=>{
                e.preventDefault()
                onClickBasket(basket.basket, props.prod)
            }}
        >
            <input type="text"
                onChange={(e)=>{
                    setQuantity(e.currentTarget.value)
                }}
            />
            <button className="addToBasket"><FontAwesomeIcon icon={faPlusCircle}/></button>
        </form>
    </li>)
}

export default ArticleDetail
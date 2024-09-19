import {useState, useEffect} from "react"
import {config} from '../config'
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons'
import {takeOneProduct} from '../api/product'
import PopUp from "../components/Popup"

import {useSelector, useDispatch} from 'react-redux' 
import {selectBasket, modifyBasket} from "../slices/basketSlice"
//import {selectProducts} from "../slices/productSlice"
const Detail = (props) => {
    //const products = useSelector(selectProducts)
    //on recup la state globale basket
    const basket = useSelector(selectBasket)
    const dispatch = useDispatch()
    const [quantity, setQuantity] = useState("")
    const [error, setError] = useState(null)
    const [isPopUp, setIsPopUp] = useState(false)
    const [product, setProduct] = useState(null)
    
    //fonction d'ajout au panier
    const onClickBasket = (oldBasket, newProduct) => {
        let myQuantity
        if(quantity === ""){
            myQuantity = 1
            setQuantity(1)
        } else {
            myQuantity = parseInt(quantity)
        }
        
        if(isNaN(myQuantity)){
            setError("Veuillez saisir un nombre")
        } else {
            setError(null)
            //je copie le panier en faisant péter le read only pour pouvoir le modifier
            let newBasket = JSON.parse(JSON.stringify(oldBasket))
            //on va parcourir le panier pour vérifier si le produit qu'on veut ajouter existe déjà ou non
            const same = newBasket.findIndex((b) => b.id === newProduct.id)
            //le produit n'existe pas
            if(same === -1){
                //le newProduct est aussi en read only on le fait péter
                let myProduct = JSON.parse(JSON.stringify(newProduct))
                //on crée une nouvelle propriété pour savoir la quantitée que souhaite l'acheteur pour se produit
                myProduct.quantityInCart = myQuantity
                //on récupère le panier précédent en ajoutant à celui-ci le nouveau produit, le tout dans une nouveau tableau
                let myBasket = [...newBasket, myProduct]
                //on pousse le panier mis à jour dans le storage
                let lsBasket = JSON.stringify(myBasket)
                window.localStorage.setItem("b4y-basket", lsBasket)
                //on pousse dans le store de redux
                dispatch(modifyBasket(myBasket))
            }else{
                //le produit est déjà dans le panier on rajoute de la quantité
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
    
    useEffect(()=>{
        takeOneProduct(props.params.id)
        .then((res)=>{
            if(res.status === 200){
                setProduct(res.result)
            }
        })
        .catch(err=>console.log(err))
        
        /*const same = products.products.findIndex((b) => b.id === parseInt(props.params.id))
        if(same){
           setProduct(products.products[same])
        }*/
    }, [])
    return (<section>
        <h2 style={{textAlign: "center"}}>Details {props.params.id}</h2>
        {isPopUp && <PopUp 
            msg={`Vous avez ajouté ${quantity} produit(s) dans votre panier`}
            onClickClose={(e)=>{
                setIsPopUp(false)
                setQuantity("")
            }}
        />}
        <Link className="comeBack" to="/product"><FontAwesomeIcon icon={faArrowCircleLeft}/></Link>
        {product !== null && <div className="productDetail">
            <img src={config.pict_url + product.photo} alt={`Image du produit ${product.name}`}/>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
        </div> }
        {error !== null && <p>{error}</p>}
        <form
            style={{textAlign:"center"}}
            onSubmit={(e)=>{
                e.preventDefault()
               onClickBasket(basket.basket, product)
            }}
        >
            <input type="text"
                onChange={(e)=>{
                    setQuantity(e.currentTarget.value)
                }}
            />
            <button className="addToBasket"><FontAwesomeIcon icon={faPlusCircle}/></button>
        </form>
    </section>)
}

export default Detail
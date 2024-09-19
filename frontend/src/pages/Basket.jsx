import { useState, useEffect } from "react"
import { saveOneOrder } from "../api/order";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

//on importe la state de basket de redux + son/ses actions
import { useSelector, useDispatch } from "react-redux"
import { selectBasket, updateBasket, cleanBasket } from "../slices/basketSlice"
import { selectUser } from "../slices/userSlice";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPlus, faMinus, faXmark, faSquarePlus, faSquareMinus} from '@fortawesome/free-solid-svg-icons'

import { config } from "../config";
import { current } from "@reduxjs/toolkit";

const Basket = () => {
  //on récup la state basket
  const currentBasket = useSelector(selectBasket)
  const user = useSelector(selectUser)
  const [error, setError] = useState(null)
  const [redirectToPayment, setRedirectToPayment] = useState(null)
  const [redirectToLogin, setRedirectToLogin] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [nbItems, setNbItems] = useState(0)

  //on récup la fonction useDispatch
  const dispatch = useDispatch()

  useEffect(()=>{
    let number = 0
    currentBasket.basket.forEach(item => {
      number += item.quantityInCart
    });
    setNbItems(number)
  }, [currentBasket.basket])

  const removeProductFromBasket = (oldBasket, product) => {
    //la state lorsqu'on la récup de redux est en mode read only (lecture seule)
    //je transforme l'objet en format json puis le retransforme en objet pour le stocker dans myBasket. Il est maintenant modifiable
    let newBasket = JSON.parse(JSON.stringify(oldBasket));

    //on copie le tableau du panier sans le produit qu'on veut supprimer (array.filter())
    //on dispatch le nouveau panier dans le store
    dispatch(updateBasket(newBasket.filter(item => item.id !== product.id)))
  }

  const addOneQuantity = (oldBasket, product) => {
    let newBasket = JSON.parse(JSON.stringify(oldBasket));
    let index = newBasket.findIndex(item => item.id === product.id)
    newBasket[index].quantityInCart += 1
    dispatch(updateBasket(newBasket))
  }

  const removeOneQuantity = (oldBasket, product) => {
    if (product.quantityInCart === 1){
      removeProductFromBasket(oldBasket, product)
    } else {
      let newBasket = JSON.parse(JSON.stringify(oldBasket));
      let index = newBasket.findIndex(item => item.id === product.id)
      newBasket[index].quantityInCart -= 1
      dispatch(updateBasket(newBasket))
    }
  }

  const deleteBasket = () => {
    dispatch(cleanBasket())
  }

  const handleValidation = () => {

    if (user.isLogged) {
      // je crée l'objet data à envoyer à saveOneOrder
      let data = {
        user_id: user.infos.id,
        basket: currentBasket.basket
      }

      saveOneOrder(data)
      .then((res)=>{
        if (res.status === 200 ){
          // je redirige vers une page de payement/:order_id
          setOrderId(res.order_id)
          setRedirectToPayment(true)
        } else {
          //problème dans la création de commande
          setError(res.msg)
        }
      })
      .catch((err)=>{
        // console.log(err)
        setError("Une erreur est survenue.")
      })
    } else {
      setRedirectToLogin(true)
    }
  }

  if (redirectToPayment && orderId !== null) {
    return <Navigate to={`/payement/${orderId}`}/>
  }

  if(redirectToLogin){
    return <Navigate to={`/login`} />
}

  return (
    <section className="details-basket">
      <h1>Panier</h1>
    { currentBasket.basket.length === 0 ?
      <div>
        <p>Vous n'avez pas encore ajouté d'articles à votre panier ... n'attendez plus!</p>
        <button><Link to="/plants">Découvrez les plantes</Link></button>
      </div> :
      <article>
        { error !== null && <p style={{color:"red"}}>{error}</p>}
        <button className="first-validation" onClick={()=>{handleValidation()}}>Valider ma commande</button>
        <ul className="basket-all-items">
          {currentBasket.basket.map((item=>{
            return (
              <li  key={item.id} className='basket-item' >
                {/* <img src={`${config.pict_url}/${item.photo}`}/> */}
                { item.photo !== "" ? <img src={`${config.pict_url}/${item.photo}`}/> : <img src={`${config.pict_url}/no-pict.jpg`}/>}
                <div className="basket-item-infos">
                  <h3>{item.name}</h3>
                  <div className="change-quantity-zone">
                    <p>Quantité :</p>
                    <FontAwesomeIcon icon={faSquareMinus} onClick={ () => { removeOneQuantity(currentBasket.basket, item)}} />
                    <input placeholder={item.quantityInCart} />
                    <FontAwesomeIcon icon={faSquarePlus} onClick={ ()=>{addOneQuantity(currentBasket.basket, item)}}/>
                  </div>
                  <p><FontAwesomeIcon icon={ faXmark} className='deletItem' onClick={()=>{removeProductFromBasket(currentBasket.basket, item)}}/></p>
                  <p id="price">{item.quantityInCart * item.price} €</p>
                </div>
              </li>

            )
          }))
          }
        </ul>
        <div className="summary">
          <p>Montant total du panier: {currentBasket.totalAmount} €</p>
          <p>Nombre d'articles dans le panier: {nbItems}</p>
        </div>
        <button onClick={deleteBasket}>Supprimer mon panier</button>
        <button onClick={()=>{handleValidation()}}>Valider ma commande</button>
      </article>
      }
    </section>

  )
}

export default Basket;

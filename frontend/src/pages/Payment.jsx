import {loadStripe} from "@stripe/stripe-js"
import CheckoutForm from "./CheckoutForm"
import {Elements} from "@stripe/react-stripe-js"
import { useEffect, useState } from "react"
import { getOneOrder } from "../api/order"
//la clé publique de stripe me permet de brancher l'environnement de l'api stripe à mon compte stripe API
const stripePromise = loadStripe("pk_test_51LrM4tJWWAfWqjZRMDYQ412PPW9HoddKygyLpVu5CUc9PSMhyjXG4nsUtL24lJsasWcE2e5ea3x4gD7CFmflnvsi00UDZcL591")

const Payment = (props) => {
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)

  useEffect(()=> {
    setError(null)
    getOneOrder(props.params.id)
    .then((res)=>{
      if (res.status === 200){
        setOrder(res.order)
      }
      else {
        setError("Une erreur est survenue. Vous ne pouvez pas procéder au paiement.")
      }
    })
    .catch(()=>{
      setError("Une erreur est survenue. Vous ne pouvez pas procéder au paiement.")
    })
  }, [props])

  if (order !== null) {
    return (
      <section className="payement">
      <h1>Paiement</h1>
      { error !== null && <p className="error">{error}</p>}
      <p>Numéro de votre commande : {props.params.id}</p>
      <p>Total de votre commande : {order.totalAmount} €</p>
      {/*On va brancher l'environnement des fonctionnalitées de react-stripe
          qui va permettre d'effectuer les échanges avec l'api stripe de manière sécurisée
      */}
      <Elements stripe={stripePromise}>
          <CheckoutForm orderId={props.params.id} />
      </Elements>
      </section>
    )
  } else {
    return (
      <section className="payement">
      <h1>Paiement</h1>
      <p>Chargement de la session de paiement ...</p>
      </section>
    )
  }
}

export default Payment

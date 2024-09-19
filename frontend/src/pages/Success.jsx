import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { cleanBasket } from '../slices/basketSlice'

const Success = (props) => {
    const dispatch = useDispatch()
    const params = useParams()
    useEffect(() => {
        window.localStorage.removeItem("artbois-basket")
        dispatch(cleanBasket())
    }, [])

    return (
        <section className='success-order'>
            <h1>Art&Bois vous remercie</h1>
            <p>Votre commande a été effectuée avec succès.</p>
            <Link to={`/orders/details/${params.id}`}>Voir votre commande</Link>
      </section>
    )
}
export default Success

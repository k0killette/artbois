import { useEffect, useState } from "react"
import { getOneOrder } from "../api/order"
import { useParams } from "react-router-dom";
import moment from "moment";
import { config } from "../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot} from '@fortawesome/free-solid-svg-icons'
import { useSelector } from "react-redux"
import { selectUser } from "../slices/userSlice";


const OrderDetails = () => {
  const params = useParams()
  const [order, setOrder] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [userData, setUserData] = useState(null)
  const [status, setStatus] = useState("")
  const user = useSelector(selectUser)

  useEffect(()=>{
    getOneOrder(params.id)
    .then((res)=>{
      if (res.status === 200){
        setOrder(res.order)
        setOrderDetails(res.orderDetails)
        setUserData(res.dataUser)

      }
    })
    .catch((err)=>{
      console.log(err)
    })
  }, [params.id])

    useEffect(() => {
      if (order) {
        switch (order.status) {
          case "payed":
            setStatus("payée");
            break;
          case "not_payed":
            setStatus("en attente de paiement");
            break;
          case "shipped":
            setStatus("expédiée");
            break;
          case "in_delivery":
            setStatus("en cours de livraison");
            break;
          case "delivered":
            setStatus("livrée");
            break;
          case "finished":
            setStatus("terminée");
            break;
          default:
            setStatus("statut inconnu");
            break;
        }
      }
    }, [order]);

  if (order !== null && (user.infos.id === order.user_id || user.infos.role === "admin")){
    return (
      <section className="details-order">
        <h1>Commande n° {order.id}</h1>

        <div className="general-infos">
          { user.infos.role === "admin" && <article>
            <h2>Identité du client : {userData.firstName} {userData.lastName} </h2>
          </article>
          }

          <h2><span><FontAwesomeIcon icon={faLocationDot}/> Adresse de livraison : </span>{userData.address} {userData.zip} {userData.city}</h2>

          <h2>Commande passée le {moment(order.creationTimestamp).local("fr").format("DD/MM/YYYY")}</h2>
          <h2>Statut de la commande : {status}</h2>

          <h2>Montant total de la commande : {order.totalAmount} €</h2>
        </div>


        <ul className="order-all-items">
          {orderDetails.map((orderItem=>{
            return (
              <li  key={orderItem.id} className='order-item' >
                { orderItem.photo !== "" ? <img src={`${config.pict_url}/${orderItem.photo}`}/> : <img src={`${config.pict_url}/no-pict.jpg`}/>}

                <div className="order-item-infos">
                  <h3>{orderItem.name}</h3>
                  <p>Quantité : {orderItem.quantity}</p>
                  <p id="price">Prix : {orderItem.total} €</p>
                </div>
              </li>

            )
          }))
          }
        </ul>

      </section>
    )
  }

}

export default OrderDetails

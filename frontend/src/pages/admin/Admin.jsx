import {useState, useEffect} from "react"
import {useSelector, useDispatch} from "react-redux"
import {selectProducts, loadProducts} from "../../slices/productSlice"
import {Link} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import {config} from '../../config'
import {deleteOneProduct, displayProducts} from "../../api/product"
import {getAllOrders} from "../../api/order"
import moment from "moment"

const Admin = (props) => {
    const product = useSelector(selectProducts)
    const dispatch = useDispatch()
    const [orders, setOrders] = useState([])
    
    //suppression d'une bière
    const onClickDeleteProduct = (id) => {
        deleteOneProduct(id)
        .then((res)=>{
            if(res.status === 200){
                displayProducts()
                .then((response) => {
                    if(response.status === 200){
                        dispatch(loadProducts(response.result))
                    }
                    
                })
            } else {
                console.log(res)
            }
        })
        .catch(err=>console.log(err))
    }
    
    useEffect(()=>{
        getAllOrders()
        .then((res)=>{
            if(res.status === 200){
                setOrders(res.result)
            }
        })
        .catch(err=>console.log(err))
    }, [])
    
    return (<section>
        <div>
            <h2>Administration</h2>
            <Link to="/addProduct" style={{display: "block", textAlign: 'center'}}><FontAwesomeIcon icon={faPlusCircle}/> Ajouter une bière!</Link>
            <h3>Mes produits</h3>
            <table className="tableProduct first">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Nom</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {product.products.length > 0 ? product.products.map((b)=>{
                        return <tr key={b.id}>
                            <td><img src={config.pict_url + b.photo}/></td>
                            <td>{b.name}</td>
                            <td>
                                <Link to={`/editProduct/${b.id}`}>modifier</Link>
                                <button
                                    onClick={(e)=>{
                                        e.preventDefault()
                                        onClickDeleteProduct(b.id)
                                    }}
                                >
                                    supprimer
                                </button>
                            </td>
                        </tr>
                    }) : <tr>
                        <td colSpan="3"></td>
                    </tr>}
                </tbody>
            </table>
        </div>
        <hr/>
        <article className="flexTable">
            <h3>Mes commandes</h3>
            <div>
                <h4>En attente de paiement</h4>
                <table className="tableProduct">
                    <thead>
                        <tr>
                            <th>Numéro</th>
                            <th>Prix total</th>
                            <th>Date de confirmation</th>
                            <th>Etat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map((o)=>{
                            if(o.status === "not payed" || o.status === "cancelled"){
                                return <tr key={o.id}>
                                    <td><Link to={`/orderDetail/${o.id}`}>{o.id}</Link></td>
                                    <td>{o.totalAmount} euros</td>
                                    <td>{moment(o.creationTimestamp).format("DD-MM-YYYY")}</td>
                                    <td>{o.status}</td>
                                </tr>
                            }
                        }) : <tr>
                            <td colSpan="3"></td>
                        </tr>}
                    </tbody>
                </table>
            </div>
            
            <div>
                <h4>En cours de traitement</h4>
                <table className="tableProduct">
                    <thead>
                        <tr>
                            <th>Numéro</th>
                            <th>Prix total</th>
                            <th>Date de confirmation</th>
                            <th>Etat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map((o)=>{
                            if(o.status === "payed"){
                                return <tr key={o.id}>
                                    <td><Link to={`/orderDetail/${o.id}`}>{o.id}</Link></td>
                                    <td>{o.totalAmount} euros</td>
                                    <td>{moment(o.creationTimestamp).format("DD-MM-YYYY")}</td>
                                    <td>{o.status}</td>
                                </tr>
                            }
                        }) : <tr>
                            <td colSpan="3"></td>
                        </tr>}
                    </tbody>
                </table>
            </div>
            
            <div>
                <h4>Envoyées</h4>
                <table className="tableProduct">
                    <thead>
                        <tr>
                            <th>Numéro</th>
                            <th>Prix total</th>
                            <th>Date de confirmation</th>
                            <th>Etat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map((o)=>{
                            if(o.status === "shipped"){
                                return <tr key={o.id}>
                                    <td><Link to={`/orderDetail/${o.id}`}>{o.id}</Link></td>
                                    <td>{o.totalAmount} euros</td>
                                    <td>{moment(o.creationTimestamp).format("DD-MM-YYYY")}</td>
                                    <td>{o.status}</td>
                                </tr>
                            }
                        }) : <tr>
                            <td colSpan="3"></td>
                        </tr>}
                    </tbody>
                </table>
            </div>
            
            <div>
                <h4>Terminées</h4>
                <table className="tableProduct">
                    <thead>
                        <tr>
                            <th>Numéro</th>
                            <th>Prix total</th>
                            <th>Date de confirmation</th>
                            <th>Etat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map((o)=>{
                            if(o.status === "finish"){
                                return <tr key={o.id}>
                                    <td><Link to={`/orderDetail/${o.id}`}>{o.id}</Link></td>
                                    <td>{o.totalAmount} euros</td>
                                    <td>{moment(o.creationTimestamp).format("DD-MM-YYYY")}</td>
                                    <td>{o.status}</td>
                                </tr>
                            }
                        }) : <tr>
                            <td colSpan="3"></td>
                        </tr>}
                    </tbody>
                </table>
            </div>
        </article>
    </section>)
}

export default Admin
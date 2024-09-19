import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadOnePlant } from "../../api/plant";
import {config} from "../../config";
import { Link } from "react-router-dom";


import { FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faDroplet, faSun, faTemperatureHigh, faCartPlus, faSquarePlus, faSquareMinus, faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons"

//on importer nos fonction pour lire ou modifier nos states globales présentes dans le store de redux
import { useSelector, useDispatch } from 'react-redux';

//import des states globales product et basket et de leurs actions (ajout au panier, chargement des produits)
import { selectBasket, updateBasket  } from '../../slices/basketSlice';
import { selectUser } from "../../slices/userSlice";


const Details = () => {
  const params = useParams()
  const [plant, setPlant] = useState(null)
  const [chosenQuantity, setChosenQuantity] = useState(1)
  const currentBasket = useSelector(selectBasket)
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  useEffect(()=>{
    loadOnePlant(params.id)
    .then((res)=>{
      setPlant(res.results)
    })
    .catch((err)=>{
      console.log(err)
    })
  }, [params.id])

  const handleChange= (e) => {
    if (e.currentTarget.value !== ""){
      setChosenQuantity(parseInt(e.currentTarget.value))
    }
  }

  const addToBasket = (e, oldBasket, newProduct) => {
    e.preventDefault()

    //la state lorsqu'on la récup de redux est en mode read only (lecture seule)
    //je transforme l'objet en format json puis le retransforme en objet pour le stocker dans myBasket. Il est maintenant modifiable
    let newBasket = JSON.parse(JSON.stringify(oldBasket));

    //on check si le produit que l'on veut mettre dans le panier existe déjà (findIndex)
    const index = newBasket.findIndex(product => product.id === newProduct.id)
    if ( index === -1){
      // on ajoute la propriété quantityInCart à l'objet newproduct(plant)
      newProduct.quantityInCart = chosenQuantity
      //on push dans le panier le nouveau produit
      newBasket.push(newProduct)

      //on dispatch dans le store
      dispatch(updateBasket(newBasket))

    } else { //sinon
      //on met à jour la quantityInCart sur le produit déjà présent
      newBasket[index].quantityInCart += chosenQuantity

      //on dispatch le panier dans le store
      dispatch(updateBasket(newBasket))
    }
  }

  return (
    <>
      { plant !== null &&
      <section className="details-plant">
        <div id="link-to-plants">
          <Link to="/plants" className="button"><FontAwesomeIcon icon={faArrowRotateLeft}/> Retour vers toutes les plantes</Link>
        </div>
        {/* <div id="link-to-plants">
          <Link to="/plants" className="button"><FontAwesomeIcon icon={faArrowRotateLeft}/> Retour vers toutes les plantes</Link>
        </div> */}
        <img src={`${config.pict_url}/${plant.photo}`}/>
        <div className="details-plant-infos">
          <h1>{plant.name}</h1>
          <p>{plant.description}</p>
          <h3>Prix: {plant.price} €</h3>
          <h3>En stock: {plant.quantity}</h3>
        </div>
        <div className="advices">
          <h3>Nos conseils d'entretien</h3>
          <ul>
            <li>
              <h4>Arrosage :
                {Array.from({ length: plant.watering }, (_, index) => (
                  <span key={index}>
                    <FontAwesomeIcon icon={faDroplet} />
                  </span>
                ))}
              </h4>
            </li>
            <li>
              <h4>Luminosité :
                {Array.from({length: plant.brightness}, (_, index) => (
                    <span key={index}>
                       <FontAwesomeIcon icon={faSun} />
                    </span>
                ))}
              </h4>
            </li>
            <li>
              <h4>Temp. : entre {plant.minTemperature} et {plant.maxTemperature}°C <FontAwesomeIcon icon={faTemperatureHigh}/></h4>
            </li>

          </ul>
        </div>

        { user.infos.role !== "admin" &&
        <form onSubmit={(e)=>{addToBasket(e, currentBasket.basket, plant)}}>
          <input name="quantity" id="quantity" placeholder="1" defaultValue={chosenQuantity} onChange={(e)=>{handleChange(e)}}/>
          <button>Ajouter au panier <FontAwesomeIcon icon={faCartPlus}/></button>
        </form>
        }
      </section>
      }
    </>
  )
}

export default Details;

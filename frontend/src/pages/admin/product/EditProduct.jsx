import {useState, useEffect} from "react"
import {useSelector, useDispatch} from 'react-redux' 
import {selectUser} from '../../../slices/userSlice'
import {loadProducts} from '../../../slices/productSlice'
import {Navigate} from 'react-router-dom'

import {takeOneProduct, updateOneProduct, displayProducts} from '../../../api/product'

import axios from 'axios'
import {config} from '../../../config'

const EditProduct = (props) => {
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [quantity, setQuantity] = useState("")
    const [price, setPrice] = useState("")
    const [selectedFile, setFile] = useState(null)
    const [oldPict, setOldPict] = useState(null)
    const [redirect, setRedirect] = useState(false)
    const [error, setError] = useState(null)
    
    //fonction de demande d'enregistrement de l'annonce
    const addProd = (datas) => {
        updateOneProduct(datas, props.params.id)
        .then((res)=>{
            console.log(res)
            //si l'annonce est bien enregistrée
            if(res.status === 200){
                displayProducts()
                .then((response)=>{
                    if(response.status === 200){
                        dispatch(loadProducts(response.result))
                        setRedirect(true)
                    }
                })
                .catch(err=>console.log(err))
            }
        })
        .catch(err=>console.log(err))
    }
    
    const saveCompleteProduct = () => {
        if(selectedFile === null){
            const datas = {
                name: name,
                description: description,
                price: price,
                quantity: quantity,
                photo: oldPict
            }
            addProd(datas)
        } else {
            //on prépare l'objet formData qui permet le transport de l'image dans la requète ajax
            const formData = new FormData()
            formData.append("image", selectedFile)
            //requète ajax d'ajout d'une image
            axios({
                method: "post",
                url: `${config.api_url}/api/v1/product/pict`,
                data: formData,
                headers: {
                    'Content-type': 'multipart/form-data',
                    'x-access-token': user.infos.token
                }
            })
            .then((res)=>{
                //si l'image a bien été enregistrée
                if(res.status === 200){
                    const datas = {
                        name: name,
                        description: description,
                        price: price,
                        quantity: quantity,
                        photo: res.data.url
                    }
                    addProd(datas)
                }
            })
            .catch(err=>console.log(err))
        }
    }
    
    
    const onSubmitForm = (e) => {
        e.preventDefault()
        setError(null)
        if(name === "" || description === "" || price === "" || quantity === ""){
            setError("Tous les champs ne sont pas encore remplis!")
        } else if(isNaN(quantity) || isNaN(price)){
            setError("Les champs prix et quantité doivent obligatoirement être un chiffre!")
        } else {
            saveCompleteProduct()
        }
    }
    
    useEffect(()=>{
        takeOneProduct(props.params.id)
        .then((res)=>{
            setName(res.result.name)
            setDescription(res.result.description)
            setQuantity(res.result.quantity)
            setOldPict(res.result.photo)
            setPrice(res.result.price)
        })
        .catch(err=>console.log(err))
    }, [])
    
    if(redirect){
        return <Navigate to="/admin"/>
    }
    return(<section>
        <h2>Ajouter un produit</h2>
        {error !== null && <p>{error}</p>}
        <form
            className="b-form"
            onSubmit={onSubmitForm}
        >
            <input
                type="text"
                placeholder="Nom de la bière"
                defaultValue={name}
                onChange={(e)=>{
                    setName(e.currentTarget.value)
                }}
            />
            <input
                type="file"
                onChange={(e)=>{
                    setFile(e.currentTarget.files[0])
                }}
            />
            <textarea
                name="description"
                defaultValue={description}
                onChange={(e)=>{
                    setDescription(e.currentTarget.value)
                }}
            ></textarea>
            <input
                type="text"
                defaultValue={quantity}
                placeholder="Quantité disponible"
                onChange={(e)=>{
                    setQuantity(e.currentTarget.value)
                }}
            />
            <input
                type="text"
                defaultValue={price}
                placeholder="Prix de vente"
                onChange={(e)=>{
                    setPrice(e.currentTarget.value)
                }}
            />
            <button>Enregistrer</button>
        </form>
        {oldPict !== null && <img src={config.pict_url + oldPict} alt="image actuelle"/>}
    </section>)
}

export default EditProduct
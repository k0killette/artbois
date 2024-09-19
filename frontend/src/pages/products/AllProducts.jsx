import { Link } from "react-router-dom"
import ArticleProduct from "../../components/ProductCard"

//on importe nos fonction pour lire ou modifier nos states globales présentes dans le store de redux
import { useSelector, useDispatch } from "react-redux"
//import des states globales product et basket et de leurs actions (ajout au panier, chargement des produits)
import { selectBasket, updateBasket } from "../../slices/basketSlice"
import { selectProducts } from "../../slices/productSlice";

const Products = () =>{
  const produits = useSelector(selectProducts)
  //console.log(produits)

  return (
    <section>
        <h1>Boutique</h1>
        { produits.products.length > 0 && <section className="all-products">
        {produits.products.map(product => {
          return <ArticleProduct key={produits.id} product={produits}/>
        })}
      </section>}
    </section>
  )
}

export default Products

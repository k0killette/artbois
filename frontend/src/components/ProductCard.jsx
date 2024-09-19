import {config} from "../config"
import {Link} from "react-router-dom"

const ArticleProduct = (props) => {
  const products = props.products

  return (
    <article className="product-card">
        <img src={`${config.pict_url}/${products.image_url}`}/>
        <h3>{products.name}</h3>
        <p>{products.description.substring(0, 80)}...</p>
        <button><Link to={`/products/${products.id}`} >Je découvre</Link></button>
    </article>
  )
}

export default ArticleProduct

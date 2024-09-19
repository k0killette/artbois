import {useSelector} from "react-redux"
import {selectProducts} from "../slices/productSlice"
import ProductDetail from "../components/product-detail"

const Product = (props) => {
    const produits = useSelector(selectProducts)
    
    return (
        <section>
            <h2>Le bois c'est la vie</h2>
            {produits.products.length > 0 && <ul>
                {produits.products.map((b)=>{
                    return <ProductDetail key={b.id} prod={b} />
                })}
            </ul>}
        </section>
    )
}

export default Product
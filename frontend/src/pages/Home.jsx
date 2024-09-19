import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { selectBasket, updateBasket } from "../slices/basketSlice"
import { selectProducts } from "../slices/productSlice";


const Home = (props) => {

    //On récupère les states
    const allProducts = useSelector(selectProducts)
    const lsBasket = useSelector(selectBasket)
    // On initialise notre fonction dispatch pour modifier une state
    const dispatch = useDispatch()

    return (
        <main>
            <section id="introduction">
                <div id="intro-title">
                    <h1>Bienvenue sur Art&Bois</h1>
                    <p>Le site de référence sur l'ébénisterie d'art</p>
                </div>
            </section>
            <section className="container">
                <article>
                    <h2>Art&Bois, un atelier passionné</h2>
                    <p>Porté par l’ambition de son fondateur Alan Bocquillon, l’atelier Art&Bois est né de l’envie de donner une nouvelle     impulsion à l’ébénisterie d'art en s’inscrivant dans une démarche contemporaine et responsable. Nous sommes les     garants d’un savoir-faire unique et ancestral, enrichi par une expertise technique sans cesse repoussée.</p>
                    <p>Nous répondons à des besoins spécifiques pour une clientèle exigeante dans différents secteurs du luxe. Guidés par     une passion sans limite, nous dessinons, concevons et fabriquons intégralement nos produits dans notre atelier     rémois. Nous avons à cœur d’offrir à nos clients l’expérience du sur-mesure pour délivrer un produit unique.</p>
                    <p>Chaque produit a une histoire, la nôtre est de la faire rayonner.</p>
                    <button><Link to="/atelier" >Notre atelier</Link></button>
                </article>
                <article>
                    <h2>Nos réalisations</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <button><Link to="/realisations" >Nos réalisations</Link></button>
                </article> 
                <article>
                    <h2>Nos actualités</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <button><Link to="/actualites" >Nos actualités</Link></button>
                </article>
                <article>
                    <h2>La boutique</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <button><Link to="/boutique" >La boutique</Link></button>
                </article>
            </section>
        </main>
    )
}

export default Home

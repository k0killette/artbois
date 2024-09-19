import { Link, useNavigate } from "react-router-dom"
import Logo from "../assets/logo/artbois_logo_sable.png"
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { selectUser, logoutUser } from '../slices/userSlice';
import { selectBasket } from '../slices/basketSlice';
import { config } from "../config"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketShopping, faCircleUser, faGear, faRightFromBracket, faXmark, faUserCheck } from '@fortawesome/free-solid-svg-icons'



const Header = (props) => {

    const user = useSelector(selectUser)
    const basket = useSelector(selectBasket)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const logout = (e) => {
        e.preventDefault()
        // On pense à supprimer le token du localstorage (sinon le HOC va reconnecter automatiquement)
        window.localStorage.removeItem('artbois-token')
        // On déconnecte du store
        dispatch(logoutUser())
        // On redirige vers login
        navigate('/login')
    }
    
    const [menuOpen, setMenuOpen] = useState(false)
    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    return (
        <header>
            <div className="container">
                <nav>
                    <div id="main-navigation">
                        <div id="menu-icon" onClick={toggleMenu}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <ul className={menuOpen ? 'open' : ''}>
                            <li><Link to="/atelier"><span>Atelier</span></Link></li>
                            <li><Link to="/realisations"><span>Realisations</span></Link></li>
                            <li><Link to="/actualites"><span>Actualités</span></Link></li>
                            <li><Link to="/boutique"><span>Boutique</span></Link></li>
                        </ul>
                    </div>
                    <div id="logo">
                        <Link to="/"><img src={Logo} alt="Logo Art&Bois atelier d'ébénisterie d'art à Reims"/></Link>
                    </div>
                    <div id="navigation-icon">
                        <ul>
                            <li><Link to="/login"><span><FontAwesomeIcon icon={faCircleUser} className="icon"/></span></Link></li>
                            <li><Link to="/basket"><span><FontAwesomeIcon icon={faBasketShopping} className="icon"/></span></Link></li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>)
}

export default Header

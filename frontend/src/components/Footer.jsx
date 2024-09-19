import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagram } from "@fortawesome/free-brands-svg-icons"
import Logo from "../assets/logo/artbois_logo_sable.png"

const Footer = (props) => {
    return (
        <footer>
            <div className="container">
                <img src={Logo} alt="Logo Art&Bois atelier d'ébénisterie d'art à Reims"/>
                <a href="https://www.artbois.fr/mentions-legales" target="_blank"><p>Mentions Légales</p></a>
                <a href="https://www.artbois.fr/cgv" target="_blank"><p>Conditions générales de Vente</p></a>
                <a href="https://www.instagram.com/" target="_blank"><FontAwesomeIcon icon={faInstagram}/></a>
                <p>&copy; Art&Bois - 2024</p>
            </div>  
        </footer>
    )
}

export default Footer

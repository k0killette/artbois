import ivrogne from "../assets/logo/ivrogne.jpg"

const PopUp = (props) => {
    return (<div className="popUp">
        <p
            className="closePopUp"
            onClick={props.onClickClose}
        >
            X
        </p>
        <h4>Félicitation</h4>
        <p>{props.msg}</p>
        <img src={ivrogne} />
        <button
            onClick={props.onClickClose}
        >
            Retour aux achats
        </button>
    </div>)
}

export default PopUp
module.exports = (OrderDetailModel) => {

    const saveOrderDetails = async (req, res) => {
        try {
            const orderDetails = await OrderDetailModel.saveOneOrderDetails(req.body)
            if (orderDetails.code) {
                res.json({ status: 500, msg: "Erreur lors de l'enregistrement des détails de la commande" })
            } else {
                res.json({ status: 200, msg: "Détails de la commande enregistrés", data: orderDetails })
            }
        } catch (err) {
            res.json({ status: 500, msg: "Echec de l'enregistrement des détails de la commande" })
        }
    }

    const getOrderDetails = async (req, res) => {
        try {
            const orderDetails = await OrderDetailModel.getAllOrderDetails(req.params.ordersId)
            if (orderDetails.code) {
                res.json({ status: 500, msg: "Erreur lors de la récupération des détails de la commande" })
            } else {
                res.json({ status: 200, result: orderDetails })
            }
        } catch (err) {
            res.json({ status: 500, msg: "Echec de la récupération des détails de la commande" })
        }
    }

    return {
        saveOrderDetails,
        getOrderDetails
    }
}

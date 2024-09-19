import axios from 'axios'
import {config} from '../config'
const token = window.localStorage.getItem('artbois-token')

// Enregistrement d'une nouvelle commande
export function saveOneOrder(data){
    return axios.post(`${config.api_url}/api/artbois/orders/save`, data, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Récupération d'une commande
export function getOneOrder(id){
    return axios.get(`${config.api_url}/api/artbois/orders/${id}`, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Récupération de toutes les commandes
export function getAllOrders(){
    return axios.get(`${config.api_url}/api/artbois/orders`, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Récupération des commandes d'un utilisateur
export function getOneUserOrders(usersId){
    return axios.get(`${config.api_url}/api/artbois/orders/users/${usersId}`, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Vérification du paiement
export function checkPayment(data){
    return axios.post(`${config.api_url}/api/artbois/orders/payment`, data, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Validation du paiement et modification du statut de paiement
export function updatePaymentStatus(id, data){
    return axios.put(`${config.api_url}/api/artbois/orders/confirm-payment/${id}`, data, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Modification du statut de la commande
export function updateOrderStatus(id, data){
    return axios.put(`${config.api_url}/api/artbois/orders/update-status/${id}`, data, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

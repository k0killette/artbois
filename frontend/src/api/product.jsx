import axios from "axios"
import {config} from "../config"
const token = window.localStorage.getItem('artbois-token')

// Enregistrement d'un nouveau produit
export function addOneProduct(data){
    return axios.post(`${config.api_url}/api/artbois/products/save`, data, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Récupération d'un produit
export function displayOneProduct(id){
    return axios.get(`${config.api_url}/api/artbois/products/${id}`)
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Récupération de tous les produits
export function displayAllProducts(){
    return axios.get(`${config.api_url}/api/artbois/products`)
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Modification d'un produit
export function updateOneProduct(data, id){
    return axios.put(`${config.api_url}/api/artbois/products/update/${id}`, data, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Suppression d'un produit
export function deleteOneProduct(id){
    return axios.delete(`${config.api_url}/api/artbois/products/delete/${id}`, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

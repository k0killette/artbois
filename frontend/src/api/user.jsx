import axios from "axios"
import {config} from "../config"
const token = window.localStorage.getItem('artbois-token')

// Enregistrement d'un utilisateur
export function addOneUser(data) {
    return axios.post(`${config.api_url}/api/artbois/users/save`, data)
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Récupération d'un utilisateur
export function displayOneUser(id) {
    return axios.get(`${config.api_url}/api/artbois/users/${id}`)
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Récupération de tous les utilisateurs
export function displayAllUsers() {
    return axios.get(`${config.api_url}/api/artbois/users`)
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Connexion d'un utilisateur
export function loginUser(data){
    return axios.post(`${config.api_url}/api/artbois/users/login`, data)
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Modification d'un utilisateur
export function updateOneUser(data, id){
    return axios.put(`${config.api_url}/api/artbois/users/update/${id}`, data, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Suppression d'un utilisateur
export function deleteOneUser(id){
    return axios.delete(`${config.api_url}/api/artbois/users/delete/${id}`, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

// Vérification du token
export function checkMyToken(){
    return axios.get(`${config.api_url}/api/artbois/users/checkToken`, {headers: {"x-access-token": token}})
    .then((res)=>{
        return res.data
    })
    .catch((err) => {
        return err
    })
}

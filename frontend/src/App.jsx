import './css/main.css'

import Header from "./components/Header"
import Footer from "./components/Footer"

import Home from "./pages/Home"
import Products from "./pages/products/AllProducts"
//import Details from "./pages/products/ProductDetails"

import Register from "./pages/user/Register"
import Login from "./pages/user/Login"
//import Profile from "./pages/user/Profile"
//import Logout from "./pages/user/Logout"

//import Admin from "./pages/admin/Admin"
//import AddProduct from "./pages/admin/product/AddProduct"
//import EditProduct from "./pages/admin/product/EditProduct"

//import Basket from "./pages/Basket"
//import Payment from "./pages/Payment"
//import Success from "./pages/Success"
//import OrderDetail from "./pages/OrderDetail"

import {Routes, Route, Navigate} from "react-router-dom"

import RequireAuth from "./helpers/require-auth"

function App() {
  return (
    <div className="app">
        <Header />
        <Routes>
            <Route path="/" element={<RequireAuth child={Home} auth={false} admin={false} />} />
            
            <Route exact path="/products" element={<RequireAuth child={Products} auth={false} admin={false}/>}/>
            
            <Route exact path="/register" element={<RequireAuth child={Register} auth={false} admin={false} />} />
            <Route exact path="/login" element={<RequireAuth child={Login} auth={false} admin={false} />} />
            
        </Routes>
        <Footer />
    </div>
  )
}

export default App

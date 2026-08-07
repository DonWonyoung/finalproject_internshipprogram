
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./components/front/Home"
import Shop from "./components/front/Shop"
import Product from "./components/front/Product"
import Cart from "./components/front/Cart"
import Checkout from "./components/front/Checkout"
import Login from "./components/admin/Login"
import { ToastContainer } from "react-toastify"
import Dashboard from "./components/admin/Dashboard"
import { AdminRequireAuth } from "./components/admin/AdminRequireAuth"

import { default as ShowCategories } from "./components/admin/category/Show"
import { default as CreateCategory } from "./components/admin/category/Create"
import { default as EditCategory } from "./components/admin/category/Edit"

import { default as ShowSubcategories } from "./components/admin/subcategory/Show"
import { default as CreateSubcategory } from "./components/admin/subcategory/Create"
import { default as EditSubcategory } from "./components/admin/subcategory/Edit"

import { default as ShowProducts } from "./components/admin/product/Show"
import { default as CreateProduct } from "./components/admin/product/Create"
import { default as EditProduct } from "./components/admin/product/Edit"

import Register from "./components/front/Register"
import { default as UserLogin } from "./components/front/Login"
import Profile from "./components/front/Profile"
import { RequireAuth } from "./components/front/RequireAuth"
import Confirmation from "./components/front/Confirmation"

import { default as ShowOrders } from "./components/admin/orders/Show"
import { default as OrderDetail } from "./components/admin/orders/Detail"
import MyOrders from "./components/front/MyOrders"
import QrCode from "./components/front/QrCode"
import ChangePassword from "./components/front/ChangePassword"
import { default as ChangeAdminPassword } from "./components/admin/ChangePassword"
import UsersList from "./components/admin/UsersList"

import ForgetPassword from "./components/front/ForgetPassword"
import ResetPassword from "./components/front/ResetPassword"
import { default as ForgetAdminPassword } from "./components/admin/ForgetPassword"
import { default as ResetAdminPassword } from "./components/admin/ResetPassword"
import VerifyEmail from "./components/front/VerifyEmail"
import EmailVerified from "./components/front/EmailVerified"
import ScrollToTop from "./components/common/ScrollToTop"
import Promo from "./components/front/Promo"

function App() {
    return (
    <>
        <BrowserRouter>
        <ScrollToTop />
        <Routes>
            <Route path="/" element={
                <RequireAuth>
                    <Home />
                </RequireAuth>
            } />

            <Route path="/shop" element={
                <RequireAuth>
                    <Shop />
                </RequireAuth>
            } />

            <Route path="/product/:id" element={
                <RequireAuth>
                    <Product />
                </RequireAuth>
            } />

            <Route path="/promos" element={
                <RequireAuth>
                    <Promo />
                </RequireAuth>
            } />

            <Route path="/customer/verify-email" element={<VerifyEmail />} />
            <Route path="/customer/email-verified" element={<EmailVerified />} />

            <Route path="/customer/register" element={<Register />} />
            <Route path="/customer/login" element={<UserLogin />} />
            <Route path="/customer/forget-password" element={<ForgetPassword />} />
            <Route path="/customer/reset-password" element={<ResetPassword />} />

            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/forget-password" element={<ForgetAdminPassword />} />
            <Route path="/admin/reset-password" element={<ResetAdminPassword />} />

            <Route path="/cart" element={
                <RequireAuth>
                    <Cart />
                </RequireAuth>
            } />

            <Route path="/customer/profile" element={
                <RequireAuth>
                    <Profile />
                </RequireAuth>
            } />

            <Route path="/customer/orders" element={
                <RequireAuth>
                    <MyOrders />
                </RequireAuth>
            } />

            <Route path="/customer/orders/details/:id" element={
                <RequireAuth>
                    <OrderDetail />
                </RequireAuth>
            } />

            <Route path="/checkout" element={
                <RequireAuth>
                    <Checkout />
                </RequireAuth>
            } />

            <Route path="/order/qr-code/:id/:token" element={
                <RequireAuth>
                    <QrCode />
                </RequireAuth>
            } />

            <Route path="/order/confirmation/:id/:token" element={
                <RequireAuth>
                    <Confirmation />
                </RequireAuth>
            } />

            <Route path="/customer/change-password" element={
                <RequireAuth>
                    <ChangePassword />
                </RequireAuth>
            } />

            <Route path="/admin/dashboard" element={
                <AdminRequireAuth>
                    <Dashboard />
                </AdminRequireAuth>
            } />

            <Route path="/admin/categories" element={
                <AdminRequireAuth>
                    <ShowCategories />
                </AdminRequireAuth>
            } />

            <Route path="/admin/categories/create" element={
                <AdminRequireAuth>
                    <CreateCategory />
                </AdminRequireAuth>
            } />

            <Route path="/admin/categories/edit/:id" element={
                <AdminRequireAuth>
                    <EditCategory />
                </AdminRequireAuth>
            } />

            <Route path="/admin/subcategories" element={
                <AdminRequireAuth>
                    <ShowSubcategories />
                </AdminRequireAuth>
            } />

            <Route path="/admin/subcategories/create" element={
                <AdminRequireAuth>
                    <CreateSubcategory />
                </AdminRequireAuth>
            } />

            <Route path="/admin/subcategories/edit/:id" element={
                <AdminRequireAuth>
                    <EditSubcategory />
                </AdminRequireAuth>
            } />

            <Route path="/admin/products" element={
                <AdminRequireAuth>
                    <ShowProducts />
                </AdminRequireAuth>
            } />

            <Route path="/admin/products/create" element={
                <AdminRequireAuth>
                    <CreateProduct />
                </AdminRequireAuth>
            } />

            <Route path="/admin/products/edit/:id" element={
                <AdminRequireAuth>
                    <EditProduct />
                </AdminRequireAuth>
            } />

            <Route path="/admin/orders" element={
                <AdminRequireAuth>
                    <ShowOrders />
                </AdminRequireAuth>
            } />

            <Route path="/admin/orders/:id" element={
                <AdminRequireAuth>
                    <OrderDetail />
                </AdminRequireAuth>
            } />

            <Route path="/admin/users" element={
                <AdminRequireAuth>
                    <UsersList />
                </AdminRequireAuth>
            } />

            <Route path="/admin/change-password" element={
                <AdminRequireAuth>
                    <ChangeAdminPassword />
                </AdminRequireAuth>
            } />
        </Routes>
        </BrowserRouter>
        <ToastContainer />
    </>
    )
}

export default App
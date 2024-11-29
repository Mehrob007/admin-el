import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import PromoCodes from '../components/componentsLayout/PromoCodes'
import ShopPage from '../components/componentsLayout/ShopPage'
import Products from '../components/componentsLayout/Products'
import Collections from '../components/componentsLayout/Collections'
import ClothingTypes from '../components/componentsLayout/ClothingTypes'
import PhotoGallery from '../components/componentsLayout/PhotoGallery'

const Layout = lazy(() => import("../components/layout/Layout"))
const Login = lazy(() => import("../components/login/Login"))
const Home = lazy(() => import("../components/componentsLayout/Home"))

const suspense = (htmlElem) => (
    <Suspense fallback={<h1>Loading...</h1>}>{htmlElem}</Suspense>
);
export default function router() {
    return (
        <Routes>
            <Route path="/" element={suspense(<Layout />)}>
                <Route index element={suspense(<Home />)} />
                <Route path="promo-codes" element={suspense(<PromoCodes />)} />
                <Route path="shop-page" element={suspense(<ShopPage />)} />
                <Route path="products" element={suspense(<Products />)} />
                <Route path="collections" element={suspense(<Collections />)} />
                <Route path="clothing-types" element={suspense(<ClothingTypes />)} />
                <Route path="photo-gallery" element={suspense(<PhotoGallery />)} />
            </Route>
            <Route path="/login" element={suspense(<Login />)} />
        </Routes>
    )
}

import { createContext, useState } from "react"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cartData, setCartData] = useState(
        JSON.parse(localStorage.getItem('cart')) || []
    )

    const addToCart = (product, size = null) => {
        let updatedCart = [...cartData]

        const isProductExist = updatedCart.find(item => item.product_id == product.id)

        if (isProductExist) {
            updatedCart = updatedCart.map(item =>
                item.product_id == product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        } else {
            updatedCart.push({
                id: `${product.id}-${Math.floor(Math.random() * 10000000)}`,
                product_id: product.id,
                title: product.title,
                price: product.price,
                quantity: 1,
                image_url: product.image_url
            })
        }

        setCartData(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
    }

    const clearCart = () => {
        setCartData([])
        localStorage.removeItem('cart')
    }

    const total = () => {
        let total = 0
        cartData.forEach(item => {
            total += item.quantity * item.price
        })
        return total
    }

    const updateCartItem = (itemId, newQuantity) => {
        const updatedCart = cartData.map(item =>
            item.id == itemId ? { ...item, quantity: newQuantity } : item
        )
        setCartData(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
    }

    const deleteCartItem = (itemId) => {
        const newCartData = cartData.filter(item => item.id != itemId)
        setCartData(newCartData)
        localStorage.setItem('cart', JSON.stringify(newCartData))
    }

    const getQuantity = () => {
        return cartData.reduce((sum, item) => sum + Number(item.quantity), 0)
    }

    return (
        <CartContext.Provider value={{
            addToCart,
            cartData,
            total,
            updateCartItem,
            deleteCartItem,
            getQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    )
}
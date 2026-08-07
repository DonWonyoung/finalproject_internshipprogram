import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl, userToken } from './http'

const LatestProducts = () => {
    const [products, setProducts] = useState([])
    const latestProducts = async () => {
        await fetch(`${apiUrl}/get-latest-products`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(result => {
            setProducts(result.data)
        })
    }

    useEffect(() => {
        latestProducts()
    }, [])

    return (
        <section className='section-2 pt-5'>
            <div className='container'>
                <div className='d-flex justify-content-between align-items-center'>
                    <h2 className='mb-0'>Produk Terbaru</h2>
                    <Link to='/shop'>
                        <button className='btn btn-secondary'>Lihat semua produk</button>
                    </Link>
                </div>
                <div className='row mt-4'>
                    {
                        products && products.map(product => {
                            return(
                                <div className='col-md-3 col-6' key={`product-${product.id}`}>
                                    <div className='product card border-0'>
                                        <div className='card-img'>
                                            <Link to={`/product/${product.id}`}><img src={product.image_url} className='w-100' /></Link>
                                        </div>
                                        <div className='card-body pt-3'>
                                            <Link to={`/product/${product.id}`}>{product.title}</Link>
                                            <div className='price'>
                                                Rp. {Number(product.price).toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default LatestProducts
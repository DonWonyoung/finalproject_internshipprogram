import { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import Sidebar from '../../common/Sidebar'
import { Link } from 'react-router-dom'
import { adminToken, apiUrl } from '../../common/http'
import Loader from '../../common/Loader'
import Nostate from '../../common/Nostate'
import { toast } from 'react-toastify'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

const Show = () => {
    const [products, setProducts] = useState([])
    const [loader, setLoader] = useState(false)

    const fetchProducts = async () => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/products`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(result => {
            console.log(result)
            setLoader(false)

            if(result.status === 200) setProducts(result.data)
            else console.log('Terjadi kesalahan.')
        })
    }

    const deleteProduct = async (id) => {
        if(confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            const res = await fetch(`${apiUrl}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            }).then(res => res.json()).then(result => {
                if(result.status === 200) {
                    const newProducts = products.filter(product => product.id != id)
                    setProducts(newProducts)
                    toast.success(result.message)
                } else toast.error(result.message)
            })
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <div className='container mb-5'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h4 className='h4 pb-0 mb-0'>List Produk</h4>
                    <Link to='/admin/products/create' className='btn btn-primary'>Buat Produk</Link>
                </div>
                <div className='col-md-3'>
                    <Sidebar />
                </div>
                <div className='col-md-9'>
                    <div className="card shadow">
                        <div className="card-body p-4">
                            {
                                loader === true && <Loader />
                            }
                            {
                                loader === false && products.length == 0 && <Nostate text='Tidak ada produk.' />
                            }
                            {
                                products && products.length > 0 &&
                                <table className='table table-hover'>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Gambar</th>
                                            <th>Nama</th>
                                            <th>Harga</th>
                                            <th>Kuantitas</th>
                                            <th>SKU</th>
                                            <th>Status</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            products && products.map(product => {
                                                return (
                                                    <tr key={`product-${product.id}`}>
                                                        <td>{product.id}</td>
                                                        <td>
                                                            {
                                                                (product.image_url == '') ? <img src='https://placehold.co/50x50' /> : <img src={product.image_url} height='25%' width='25%' />
                                                            }
                                                        </td>
                                                        <td>{product.title}</td>
                                                        <td>{Number(product.price).toLocaleString('id-ID')}</td>
                                                        <td>{product.quantity}</td>
                                                        <td>{product.sku}</td>
                                                        <td>
                                                            {
                                                                product.status == 1 ? <span className='badge text-bg-success'>Tersedia</span> : <span className='badge text-bg-danger'>Habis</span>
                                                            }
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Link to={`/admin/products/edit/${product.id}`} className="action-btn edit-btn"><FiEdit2 /></Link>
                                                                <button onClick={() => deleteProduct(product.id)} className="action-btn delete-btn p-0 fs-5"><FiTrash2 /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Show
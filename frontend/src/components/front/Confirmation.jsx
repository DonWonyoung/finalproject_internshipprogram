import { useEffect, useState } from 'react'
import Layout from '../common/Layout'
import { apiUrl, userToken } from '../common/http'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const Confirmation = () => {
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([])
    const params = useParams()

    const fetchOrder = () => {
        fetch(`${apiUrl}/get-order-details/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(result => {
            setLoading(false)
            if(result.status === 200) {
                setOrder(result.data)
                setItems(result.data.items)
            } else toast.error(result.message)
        })
    }

    useEffect(() => {
        fetchOrder()
    }, [])

    return (
        <Layout>
            <div className='container py-5'>
                {
                    loading === true &&
                    <div className='text-center py-5'>
                        <div className='spinner-border' role='status'>
                            <span className='visually-hidden'>Memuat...</span>
                        </div>
                    </div>
                }
                {
                    loading === false && order &&
                    <div>
                        <div className='row'>
                            <h1 className='text-center fw-bold text-success'>Terima kasih telah membeli produk kami!</h1>
                            <p className='text-muted text-center'>Pesanan Anda telah dimasukkan.</p>
                        </div>
                        <div className='card shadow'>
                            <div className='card-body'>
                                <h3 className='fw-bold'>Kesimpulan Pesanan</h3>

                                <hr />
                                
                                <div className='row'>
                                    <div className='col-6'>
                                        <p><strong>ID Pesanan: </strong> #{order.id}</p>
                                        <p><strong>Tanggal: {new Date(order.created_at).toLocaleDateString('id-ID')}</strong></p>
                                        <p><strong>Status Pesanan: </strong>
                                        {
                                            order.status == 'pending' && <span className='badge bg-warning'>Ditunggu</span>
                                        }
                                        {
                                            order.status == 'shipped' && <span className='badge bg-warning'>Sedang Diantar</span>
                                        }
                                        {
                                            order.status == 'delivered' && <span className='badge bg-success'>Sudah Sampai</span>
                                        }
                                        {
                                            order.status == 'cancelled' && <span className='badge bg-danger'>Dibatalkan</span>
                                        }
                                        </p>
                                        <p><strong>Metode Pembayaran: </strong>
                                        {
                                            order.payment_method === 'qris' && 'QRIS'
                                        }
                                        {
                                            order.payment_method === 'cod' && 'Cash on Delivery'
                                        }
                                        {
                                            order.payment_method === 'credit_card' && 'Kartu Kredit'
                                        }
                                        </p>
                                    </div>
                                    <div className='col-6'>
                                        <p><strong>Nama: </strong>{order.name}</p>
                                        <p><strong>Alamat: </strong>{order.address}, {order.city}, {order.state}, {order.zip}</p>
                                        <p><strong>Nomor Telepon: </strong>{order.mobile}</p>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <table className="table-striped table-bordered table">
                                            <thead className='bg-light'>
                                                <tr>
                                                    <th>Produk</th>
                                                    <th>Kuantitas</th>
                                                    <th width='150'>Harga</th>
                                                    <th width='150'>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    items.map((item) => (
                                                        <tr key={item.id}>
                                                            <td>{item.name}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{Number(item.unit_price).toLocaleString('id-ID')}</td>
                                                            <td>{Number(item.price).toLocaleString('id-ID')}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td className='text-end' colSpan={3}>Subtotal</td>

                                                    <td>Rp. {Number(order.subtotal).toLocaleString('id-ID')}</td>
                                                </tr>

                                                {
                                                    order.discount > 0 &&
                                                    <tr>
                                                        <td className='text-end' colSpan={3}>Diskon</td>

                                                        <td>- Rp. {Number(order.discount).toLocaleString('id-ID')}</td>
                                                    </tr>
                                                }

                                                <tr>
                                                    <td className='text-end fw-bold' colSpan={3}>Total</td>

                                                    <td className='fw-bold'>Rp. {Number(order.total).toLocaleString('id-ID')}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div className='text-center'>
                                        <Link to='/' className='btn btn-primary me-5'>Kembali ke home</Link>
                                        <Link to='/shop' className='btn btn-primary'>Lanjut belanja</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    loading === false && !order &&
                    <div className='row'>
                        <h1 className='text-center fw-bold text-muted'>Pesanan tidak ditemukan!</h1>
                    </div>
                }
            </div>
        </Layout>
    )
}

export default Confirmation
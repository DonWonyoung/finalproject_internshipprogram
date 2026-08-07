import { useEffect, useState } from 'react'
import Layout from '../common/Layout'
import UserSidebar from '../common/UserSidebar'
import { useParams } from 'react-router-dom'
import { apiUrl, userToken } from '../common/http'
import Loader from '../common/Loader'

const OrderDetail = () => {
    const [order, setOrder] = useState([])
    const [loader, setLoader] = useState(false)
    const [items, setItems] = useState([])
    const params = useParams()

    const fetchOrder = async () => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/get-order-details/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(result => {
            setLoader(false)

            if(result.status === 200) {
                setOrder(result.data)
                setItems(result.data.items)
            } else {
                console.log('Terjadi kesalahan.')
            }
        })
    }

    useEffect(() => {
        fetchOrder
    }, [])

    return (
        <Layout>
            <div className='container'>
                <div className='row'>
                    <div className='d-flex justify-content-between mt-5 pb-3'>
                        <h4 className='h4 pb-0 mb-0'>Pesanan</h4>
                    </div>
                    <div className='col-md-3'>
                        <UserSidebar />
                    </div>
                    <div className='col-md-9'>
                        <div className="card shadow">
                            <div className="card-body p-4">
                                {
                                    loader === true && <Loader />
                                }
                                {
                                    loader === false &&
                                    <div>
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <h3>Pesanan #{order.id}</h3>
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
                                            </div>
                                            <div className='col-md-4'>
                                                <div className='text-secondary'>Tanggal</div>
                                                <h4 className='pt-2'>{new Date(order.created_at).toLocaleDateString('id-ID')}</h4>
                                            </div>
                                            <div className='col-md-4'>
                                                <div className='text-secondary'>Status Pembayaran</div>
                                                {
                                                    order.payment_status == 'paid' ? <span className='badge bg-success'>Sudah dibayar</span> : <span className='badge bg-danger'>Belum dibayar</span>
                                                }
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <div className='py-5'>
                                                    <strong>{order.name}</strong>
                                                    <div>{order.email}</div>
                                                    <div>{order.mobile}</div>
                                                    <div>{order.address}, {order.city}, {order.state}, {order.zip}</div>
                                                </div>
                                            </div>
                                            <div className='col-md-4'>
                                                <div className='text-secondary pt-5'>Metode Pembayaran</div>
                                                <p>{order.payment_method}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <h3 className="pb-2 "><strong>List Produk</strong></h3>
                                            {
                                                items.map((item) => {
                                                    return (
                                                        <div key={`${item.id}`} className="row justify-content-end">
                                                            <div className="col-lg-12">
                                                                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                                                    <div className="d-flex">
                                                                    {
                                                                        item.product.image && <img width='50' className="me-3" src={`${item.product.image_url}`} />
                                                                    }
                                                                    <div className="d-flex flex-column">
                                                                        <div className="mb-2"><span>{item.name}</span></div>
                                                                    </div>
                                                                    </div>
                                                                    <div className="d-flex">
                                                                    <div>x {item.quantity}</div>
                                                                    <div className="ps-3">Rp. {item.price}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <div className="row justify-content-end">
                                                <div className="col-lg-12">
                                                    <div className="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                        <div><strong>Total</strong></div>
                                                        <div>Rp. {order.total}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default OrderDetail
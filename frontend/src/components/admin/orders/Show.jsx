import { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import { Link } from 'react-router-dom'
import Sidebar from '../../common/Sidebar'
import { adminToken, apiUrl } from '../../common/http'
import Loader from '../../common/Loader'
import Nostate from '../../common/Nostate'

const Show = () => {
    const [orders, setOrders] = useState([])
    const [loader, setLoader] = useState(false)

    const fetchOrders = async () => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/orders`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(result => {
            setLoader(false)

            if(result.status === 200) setOrders(result.data)
            else console.log('Terjadi kesalahan.')
        })
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    return (
        <div className='container mb-5'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h4 className='h4 pb-0 mb-0'>List Pesanan</h4>
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
                                loader === false && orders.length == 0 && <Nostate text='Tidak ada pesanan.' />
                            }
                            {
                                orders && orders.length > 0 &&
                                <table className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Customer</th>
                                            <th>Email</th>
                                            <th>Jumlah</th>
                                            <th>Tanggal</th>
                                            <th>Status Pembayaran</th>
                                            <th>Status Pesanan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            orders.map((order) => {
                                                return (
                                                    <tr key={`order-${order.id}`}>
                                                        <td><Link to={`/admin/orders/${order.id}`}>{order.id}</Link></td>
                                                        <td>{order.name}</td>
                                                        <td>{order.email}</td>
                                                        <td>{Number(order.total).toLocaleString('id-ID')}</td>
                                                        <td>{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                                                        <td>
                                                            {
                                                                order.payment_status == 'paid' ? <span className='badge bg-success'>Sudah dibayar</span> : <span className='badge bg-danger'>Belum dibayar</span>
                                                            }
                                                        </td>
                                                        <td>
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
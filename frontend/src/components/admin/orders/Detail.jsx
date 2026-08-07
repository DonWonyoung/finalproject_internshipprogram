import { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import { useParams } from 'react-router-dom'
import Sidebar from '../../common/Sidebar'
import { adminToken, apiUrl } from '../../common/http'
import Loader from '../../common/Loader'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const Detail = () => {
    const [order, setOrder] = useState([])
    const [loader, setLoader] = useState(false)
    const [items, setItems] = useState([])
    const params = useParams()

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm()

    const fetchOrder = async () => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/orders/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(result => {
            setLoader(false)

            if(result.status === 200) {
                setOrder(result.data)
                setItems(result.data.items)
                reset({
                    status: result.data.status,
                    payment_status: result.data.payment_status
                })
            } else {
                console.log('Terjadi kesalahan.')
            }
        })
    }

    const updateOrder = async (data) => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/update-order/${params.id}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }, body: JSON.stringify(data)
        }).then(res => res.json()).then(result => {
            setLoader(false)

            if(result.status === 200) {
                setOrder(result.data)
                reset({
                    status: result.data.status,
                    payment_status: result.data.payment_status
                })
                toast.success(result.message)
            } else {
                console.log('Terjadi kesalahan.')
            }
        })
    }

    useEffect(() => {
        fetchOrder()
    }, [])

    return (
        <div className='container'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h4 className='h4 pb-0 mb-0'>Detail Pesanan</h4>
                </div>
                <div className='col-md-3'>
                    <Sidebar />
                </div>
                <div className='col-md-9'>
                    <div className='row'>
                        <div className='col-md-9'>
                            <div className="card shadow mb-5">
                                <div className="card-body p-4">
                                    {
                                        loader === true && <Loader />
                                    }
                                    {
                                        loader === false &&
                                        <div>
                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <h3>Order #{order.id}</h3>
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
                                                    <p>
                                                        {
                                                            order.payment_method == 'qris' && <p>QRIS</p>
                                                        }
                                                        {
                                                            order.payment_method == 'cod' && <p>COD</p>
                                                        }
                                                        {
                                                            order.payment_method == 'credit_card' && <p>Kartu Kredit</p>
                                                        }
                                                    </p>
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
                                                                        <div className="ps-3">Rp. {Number(item.price).toLocaleString('id-ID')}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                <div className="row justify-content-end">
                                                    <div className="col-lg-12">
                                                        <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                                            <div>Subtotal</div>
                                                                <div>Rp. {Number(order.subtotal).toLocaleString('id-ID') ?? 0}</div>
                                                        </div>
                                                        {
                                                            order.discount > 0 &&
                                                            <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                                                <div>Diskon</div>

                                                                <div>- Rp. {Number(order.discount).toLocaleString('id-ID')}</div>
                                                            </div>
                                                        }
                                                        <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                                                            <div>
                                                                <strong>Total</strong>
                                                            </div>

                                                            <div>
                                                                <strong>Rp. {Number(order.total).toLocaleString('id-ID') ?? 0}</strong>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div className="card shadow">
                                <div className="card-body p-4">
                                    <form onSubmit={handleSubmit(updateOrder)}>
                                        <div className='mb-3'>
                                            <label htmlFor='status' className='form-label'>Status Pesanan</label>
                                            <select
                                            {
                                                ...register('status', {required: true})
                                            }
                                            id='status' className='form-select'>
                                                <option value='pending'>Ditunggu</option>
                                                <option value='shipped'>Sedang diantar</option>
                                                <option value='delivered'>Sudah sampai</option>
                                                <option value='cancelled'>Dibatalkan</option>
                                            </select>
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor='payment_status' className='form-label'>Status Pembayaran</label>
                                            <select
                                            {
                                                ...register('payment_status', {required: true})
                                            }
                                            id='payment_status' className='form-select'>
                                                <option value='not_paid'>Belum dibayar (QRIS)</option>
                                                <option value='paid'>Sudah dibayar</option>
                                                <option value='cod_pending'>Belum dibayar (COD)</option>
                                                <option value='expired'>Kedaluarsa</option>
                                            </select>
                                        </div>
                                        <button type='submit' className='btn btn-primary'>Perbarui</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Detail
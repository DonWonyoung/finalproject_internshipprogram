import { useContext, useState } from 'react'
import Layout from '../common/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { CartContext } from '../context/Cart'
import { useForm } from 'react-hook-form'
import { apiUrl, userToken } from '../common/http'
import { toast } from 'react-toastify'

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState('qris')
    const { cartData, total, clearCart } = useContext(CartContext)
    const navigate = useNavigate()
    const [promoCode, setPromoCode] = useState('')
    const [discount, setDiscount] = useState(0)

    const handlePaymentMethod = (e) => {
        setPaymentMethod(e.target.value)
    }

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: async () => {
            fetch(`${apiUrl}/get-profile-details`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken()}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            }).then(res => res.json()).then(result => {
                reset({
                    name: result.data.name,
                    email: result.data.email,
                    address: result.data.address,
                    city: result.data.city,
                    state: result.data.state,
                    zip: result.data.zip,
                    mobile: result.data.mobile
                })
            })
        }
    })

    const applyPromo = () => {
        if (!promoCode.trim()) {
            toast.error('Masukkan kode promo.')
            return
        }

        fetch(`${apiUrl}/apply-promo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
                code: promoCode,
                subtotal: total()
            })
        }).then(res => res.json()).then(result => {
            if(result.status === 200) {
                setDiscount(result.discount)
                toast.success(result.message)
            } else {
                setDiscount(0)
                toast.error(result.message)
            }

        }).catch(err => {
            toast.error('Terjadi kesalahan.')
        })
    }

    const saveOrder = (formData) => {
        const newFormData = {
            ...formData,
            total: total() - discount,
            promo_code: promoCode,
            payment_method: paymentMethod,
            status: 'pending',
            cart: cartData.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                title: item.title
            }))
        }
        fetch(`${apiUrl}/save-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(newFormData)
        }).then(res => res.json()).then(result => {
            if(result.status === 200) {

                clearCart()

                if (paymentMethod === 'qris') {
                    navigate(`/order/qr-code/${result.id}/${result.payment_token}`)
                }
                else if (paymentMethod === 'cod') {
                    navigate(`/order/confirmation/${result.id}/${result.payment_token}`)
                }
                else if (paymentMethod === 'credit_card') {
                    if(result.checkout_url) {
                        window.location.href = result.checkout_url
                    } else {
                        toast.error('Checkout URL tidak ditemukan.')
                    }
                }

            } else {
                toast.error(result.message)
            }
        })
        .catch(err => {
            console.error(err)
            toast.error('Terjadi kesalahan.')
        })
    }

    const processOrder = (data) => {
        if (!window.confirm("Apakah Anda sudah yakin dengan pesanan Anda?")) return

        saveOrder(data)
    }

    return (
        <Layout>
            <div className='container pb-5'>
                <div className='row'>
                    <div className='col-md-12'>
                        <nav aria-label="breadcrumb" className='py-4'>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Checkout</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <form onSubmit={handleSubmit(processOrder)}>
                    <div className='row'>
                        <div className='col-md-7'>
                            <h3 className='border-bottom pb-3'><strong>Detail Pembayaran</strong></h3>
                            <div className='row pt-3'>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input placeholder='John Doe'
                                        {
                                            ...register('name', {required: 'Kolom nama wajib diisi.'})
                                        }
                                        type='text' className={`form-control ${errors.name && 'is-invalid'}`} />
                                        {
                                            errors.name && <p className='invalid-feedback'>{errors.name?.message}</p>
                                        }
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input placeholder='someone@example.com'
                                        {
                                            ...register('email', {
                                                required: 'Kolom email wajib diisi.',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Alamat email tidak valid.'
                                                }
                                            })
                                        }
                                        type='text' className={`form-control ${errors.email && 'is-invalid'}`} />
                                        {
                                            errors.email && <p className='invalid-feedback'>{errors.email?.message}</p>
                                        }
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <textarea placeholder='Address'
                                    {
                                        ...register('address', {required: 'Kolom alamat wajib diisi.'})
                                    }
                                    className={`form-control ${errors.address && 'is-invalid'}`} rows={3}></textarea>
                                    {
                                        errors.address && <p className='invalid-feedback'>{errors.address?.message}</p>
                                    }
                                </div>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input placeholder='City'
                                        {
                                            ...register('city', {required: 'Kolom kota wajib diisi.'})
                                        }
                                        type='text' className={`form-control ${errors.city && 'is-invalid'}`} />
                                        {
                                            errors.city && <p className='invalid-feedback'>{errors.city?.message}</p>
                                        }
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input placeholder='State'
                                        {
                                            ...register('state', {required: 'Kolom provinsi wajib diisi.'})
                                        }
                                        type='text' className={`form-control ${errors.state && 'is-invalid'}`} />
                                        {
                                            errors.state && <p className='invalid-feedback'>{errors.state?.message}</p>
                                        }
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input placeholder='Post code'
                                        {
                                            ...register('zip', {required: 'Kolom kode pos wajib diisi.'})
                                        }
                                        type='text' className={`form-control ${errors.zip && 'is-invalid'}`} />
                                        {
                                            errors.zip && <p className='invalid-feedback'>{errors.zip?.message}</p>
                                        }
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input placeholder='Phone number'
                                        {
                                            ...register('mobile', {required: 'Kolom nomor telepon wajib diisi.'})
                                        }
                                        type='text' className={`form-control ${errors.mobile && 'is-invalid'}`} />
                                        {
                                            errors.mobile && <p className='invalid-feedback'>{errors.mobile?.message}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-5'>
                            <h3 className='border-bottom pb-3'><strong>List Produk</strong></h3>
                            <table className='table'>
                                <tbody>
                                    {
                                        cartData && cartData.map(item => {
                                            return (
                                                <tr key={`cart-${item.id}`}>
                                                    <td width={100}><img src={item.image_url} height='50%' width='50%' /></td>
                                                    <td width={600}>
                                                        <h4>{item.title}</h4>
                                                        <div className='d-flex align-items-center pt-3'>
                                                            <span>Rp. {Number(item.price).toLocaleString('id-ID')}</span>
                                                            <div className='ps-5'>x {item.quantity}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>

                            <div className='mt-3'>
                                <label className='form-label'>Kode Promo (opsional)</label>

                                <div className='d-flex'>
                                    <input type='text' className='form-control' placeholder='Masukkan kode promo' value={promoCode}
                                    onChange={(e) => {
                                        setPromoCode(e.target.value)

                                        if (!e.target.value.trim()) {
                                            setDiscount(0)
                                        }
                                    }} />

                                    <button type='button' className='btn btn-secondary ms-2' onClick={applyPromo}>
                                        Apply
                                    </button>
                                </div>
                            </div>

                            <div className='row mt-4'>
                                <div className='col-md-12'>

                                    <div className='d-flex justify-content-between'>
                                        <div>Subtotal</div>
                                        <div>Rp. {Number(total()).toLocaleString('id-ID')}</div>
                                    </div>

                                    <div className='d-flex justify-content-between pt-2'>
                                        <div>Diskon</div>
                                        <div>- Rp. {Number(discount).toLocaleString('id-ID')}</div>
                                    </div>

                                    <div className='d-flex justify-content-between border-top mt-2 pt-3'>
                                        <div>
                                            <strong>Total</strong>
                                        </div>

                                        <div>
                                            <strong>Rp. {Number(total() - discount).toLocaleString('id-ID')}</strong>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <h3 className='border-bottom pt-4 pb-3'><strong>Metode Pembayaran</strong></h3>

                            <div>
                                <input type="radio" name="payment_method" value="qris" onChange={handlePaymentMethod} checked={paymentMethod === 'qris'} />
                                <label className="form-label ps-2">QRIS</label>

                                <input type="radio" name="payment_method" value="cod" onChange={handlePaymentMethod} checked={paymentMethod === 'cod'} className="ms-3" />
                                <label className="form-label ps-2">COD</label>

                                <input type="radio" name="payment_method" value="credit_card" onChange={handlePaymentMethod} checked={paymentMethod === 'credit_card'} className="ms-3" />
                                <label className="form-label ps-2">Kartu Kredit</label>
                            </div>


                            <div className='d-flex py-3'>
                                <button className='btn btn-primary'>Bayar Sekarang</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

export default Checkout
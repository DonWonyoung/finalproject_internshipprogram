import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { apiUrl, userToken } from '../common/http'
import Layout from '../common/Layout'

const QrCode = () => {
    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState(null)
    const [qrCode, setQrCode] = useState('')
    const {id, token} = useParams()

    useEffect(() => {
        fetch(`${apiUrl}/order/qr-code/${id}/${token}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(result => {
            if (result.success) {
                setOrder(result.order)
                setQrCode(result.qr_code)
            } else toast.error(result.message)
        }).catch(() => toast.error('Gagal mengambil QR code')).finally(() => setLoading(false))
    }, [id, token])

    const handleDownloadQR = () => {
        if(!qrCode) return

        const link = document.createElement('a')
        link.href = qrCode
        link.download = `QRIS-${order.id}-${order.payment_token}-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Layout>
            <div className='container py-5 text-center'>
                {
                    loading && (
                        <div className='py-5'>
                            <div className='spinner-border' role='status'>
                                <span className='visually-hidden'>Memuat...</span>
                            </div>
                        </div>
                    )
                }
                {
                    !loading && order && (
                        <div>
                            <h2 className='mb-5 fw-bold'>Scan QR untuk Pembayaran</h2>
                            <img src={qrCode} alt="QR Code" width="250" height="250" className='shadow rounded' />

                            <div className="mt-3">
                                <button className="btn btn-outline-dark" onClick={handleDownloadQR}>
                                    Unduh Kode QR
                                </button>
                            </div>

                            <div className='mt-5'>
                                <p><strong>Total:</strong> Rp. {Number(order.total).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    )
                }
                {
                    !loading && !order && (
                        <h3 className='text-center fw-bold text-muted'>Gagal membuat kode QR, silakan coba lagi.</h3>
                    )
                }

                <div className='d-flex justify-content-center py-3'>
                    <button className='btn btn-primary' disabled={loading || !qrCode}
                        onClick={() => {
                            if (!loading && qrCode) {
                                window.location.href = `/order/confirmation/${id}/${token}`
                            }
                        }}
                    >
                        {loading ? 'Menyiapkan QR…' : 'Selesai'}
                    </button>
                </div>
            </div>
        </Layout>
    )
}

export default QrCode
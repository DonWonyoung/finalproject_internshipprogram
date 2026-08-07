import { useContext, useEffect, useState } from 'react'
import Layout from '../common/Layout'
import { Rating } from 'react-simple-star-rating'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { apiUrl, userToken } from '../common/http'
import { CartContext } from '../context/Cart'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'

const Product = () => {
    const [product, setProduct] = useState([])
    const [productImages, setProductImages] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const params = useParams()
    const {addToCart} = useContext(CartContext)
    const [reviews, setReviews] = useState([])
    const [rating, setRating] = useState(0)

    const [editMode, setEditMode] = useState(false)
    const [editReviewId, setEditReviewId] = useState(null)

    const user = JSON.parse(localStorage.getItem('userInfo'))
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm()

    const fetchProduct = async () => {
        setIsLoading(true)

        const res = await fetch(`${apiUrl}/get-product/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        })
        
        const result = await res.json()

        if (result.status === 200) {
            setProduct(result.data)
            setProductImages(result.data.product_images)
        }

        setIsLoading(false)
    }

    const fetchReviews = () => {
        fetch(`${apiUrl}/get-reviews/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(result => {
            if(result.status === 200) setReviews(result.data)
        })
    }

    const handleAddToCart = () => {
        if (product.quantity === 0) {
            toast.error("Stok produk ini sudah habis.")
            return
        }
        
        addToCart(product, null)
        toast.success('Berhasil menambahkan produk ke keranjang.')
    }

    const handleAddReview = async (data) => {
        if (rating === 0) {
            toast.error("Kolom rating wajib diisi.")
            return
        }

        const response = await fetch(`${apiUrl}/add-review`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
                product_id: params.id,
                rating: rating,
                description: data.description
            })
        })

        const result = await response.json()

        if (result.status === 200) {
            toast.success("Berhasil menambahkan ulasan.")
            reset()
            setRating(0)
            fetchReviews()
        } else {
            toast.error("Gagal menambahkan ulasan.")
        }
    }

    const startEditReview = (review) => {
        setEditMode(true)
        setEditReviewId(review.id)
        setRating(review.rating)
        // ✅ set nilai ke react-hook-form
        setValue('description', review.description)
    }


    const handleUpdateReview = async (data) => {
        const response = await fetch(`${apiUrl}/update-review/${editReviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
                rating: rating,
                description: data.description
            })
        })

        const result = await response.json()

        if (result.status === 200) {
            toast.success('Berhasil mengedit ulasan.')
            setEditMode(false)
            setEditReviewId(null)
            setRating(0)
            reset() // ✅ reset form react-hook-form
            fetchReviews()
        } else {
            toast.error('Gagal mengedit ulasan.')
        }
    }

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) return

        const response = await fetch(`${apiUrl}/delete-review/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        })

        const result = await response.json()

        if (result.status === 200) {
            toast.success("Berhasil menghapus ulasan.")
            fetchReviews() // refresh daftar ulasan
        } else toast.error("Gagal menghapus ulasan.")
    }

    useEffect(() => {
        fetchProduct()
        fetchReviews()
    }, [])

    const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0

    return (
        <Layout>
            <div className='container product-detail'>
                <div className='row'>
                    <div className='col-md-12'>
                        <nav aria-label="breadcrumb" className='py-4'>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item" aria-current="page"><Link to='/shop'>Toko</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">{product.title}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className='row mb-5'>
                    <div className='col-md-5'>
                        <div className='row'>
                            <div className='col-10'>
                                {
                                    productImages && productImages.map(product_image => {
                                        return (
                                            <div key={`image-${product_image.id}`}>
                                                <div className='content'>
                                                    <img src={product_image.image_url} className='w-100' />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='col-md-7'>
                        <h2>{product.title}</h2>
                        
                        {/* Tempat Rating */}
                        <div className="d-flex align-items-center mb-2">
                            <Rating size={20} readonly
                            initialValue={
                                reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0
                            }
                            />
                            <span className="ps-2">{averageRating}/5.0 ({reviews.length} ulasan)</span>
                        </div>

                        <div className='price h3 py-3'>
                            Stok: {product.quantity}
                        </div>

                        <div className='price h3 py-3'>
                            Rp. {Number(product.price).toLocaleString('id-ID')} &nbsp;
                        </div>

                        <div>{product.short_description}</div>

                        <div className='add-to-favorites my-4'>
                            <button onClick={handleAddToCart} className='btn btn-primary' disabled={isLoading || product.quantity === 0}>
                                {isLoading ? 'Memuat produk...' : product.quantity === 0 ? 'Stok Habis' : 'Tambahkan ke keranjang'}
                            </button>
                        </div>

                        <hr />

                        <div>
                            <strong>SKU: </strong>
                            {product.sku}
                        </div>
                    </div>
                </div>
                <div className='row pb-5'>
                    <div className='col-md-12'>
                        <Tabs defaultActiveKey="description" id="uncontrolled-tab-example" className="mb-3">
                            <Tab eventKey="description" title="Deskripsi">
                                <div dangerouslySetInnerHTML={{__html:product.description}}></div>
                            </Tab>
                            {/* Tempat Ulasan */}
                            <Tab eventKey="reviews" title={`Ulasan (${reviews.length})`}>
                                <div className="reviews">
                                    {
                                        reviews.length > 0 ? (
                                            reviews.map((review) => (
                                                <div key={review.id} className="border-bottom py-3">
                                                    <div className="d-flex justify-content-between">
                                                        <strong>{review.user?.name}</strong>
                                                        <div className="text-end">
                                                            {/* Bintang rating */}
                                                            <Rating size={20} readonly initialValue={review.rating} />
                                                            {/* Angka rating di bawah bintang */}
                                                            <div className="text-black" style={{ fontSize: '1rem' }}>
                                                                {review.rating.toFixed(1)}/5.0
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="mb-0">{review.description}</p>
                                                    <small className="text-black">
                                                        {new Date(review.created_at).toLocaleDateString('id-ID', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}{' '}
                                                        {new Date(review.created_at).toLocaleTimeString('id-ID', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false
                                                        })} WIB
                                                        {user && Number(user.id) === review.user_id && (
                                                            <div className="d-flex gap-3 mt-1">
                                                                <button className="badge bg-primary" onClick={() => startEditReview(review)}>Edit</button>
                                                                <button className="badge bg-danger" onClick={() => handleDeleteReview(review.id)}>Hapus</button>
                                                            </div>
                                                        )}
                                                    </small>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-black">Belum ada ulasan untuk produk ini.</p>
                                        )
                                    }

                                    {/* Form tambah/edit ulasan */}
                                    {user && (
                                        <form onSubmit={handleSubmit(editMode ? handleUpdateReview : handleAddReview)} className="mt-4">
                                            <h5>{editMode ? "Edit ulasan dan rating Anda" : "Beri ulasan dan rating Anda"}</h5>

                                            <Rating size={25} transition allowFraction initialValue={rating} onClick={setRating} />

                                            <textarea
                                            {
                                                ...register('description', {required: 'Kolom ulasan wajib diisi.'})
                                            }
                                            className={`form-control mt-3 ${errors.description ? "is-invalid" : ""}`} placeholder='Masukkan ulasan Anda.'></textarea>
                                            {
                                                errors.description && <p className='invalid-feedback'>{errors.description.message}</p>
                                            }

                                            <button type="submit" className="btn btn-primary mt-3">
                                                {editMode ? "Simpan Perubahan" : "Kirim Ulasan"}
                                            </button>

                                            {editMode && (
                                                <button type="button" className="btn btn-secondary mt-3 ms-2"
                                                onClick={() => {
                                                    setEditMode(false)
                                                    setEditReviewId(null)
                                                    setRating(0)
                                                    reset() // ✅ reset textarea
                                                }}>Batalkan</button>
                                            )}
                                        </form>
                                    )}
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Product
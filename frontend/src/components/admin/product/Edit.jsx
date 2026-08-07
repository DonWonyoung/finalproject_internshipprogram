import { useEffect, useMemo, useRef, useState } from "react"
import Layout from "../../common/Layout"
import { Link, useNavigate, useParams } from "react-router-dom"
import Sidebar from "../../common/Sidebar"
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import JoditEditor from 'jodit-react'
import { adminToken, apiUrl } from "../../common/http"

const Edit = ({placeholder}) => {
    const editor = useRef(null)
    const [content, setContent] = useState('')
    const [disable, setDisable] = useState(false)
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [productImages, setProductImages] = useState([])
    const navigate = useNavigate()
    const params = useParams()

    const config = useMemo(() => ({
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        placeholder: placeholder || ''
    }), [placeholder])

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`${apiUrl}/products/${params.id}`, {
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            const result = await res.json()

            if(result.status === 200) {
                const data = result.data

                setProductImages(data.product_images)

                // 🔥 isi React Hook Form
                reset({
                    title: data.title,
                    category: String(data.category_id),
                    subcategory: String(data.subcategory_id),
                    sku: data.sku,
                    quantity: data.quantity,
                    short_description: data.short_description,
                    price: data.price,
                    barcode: data.barcode,
                    status: String(data.status),
                    is_featured: data.is_featured,
                })

                // 🔥 isi Jodit
                setContent(data.description || '')
            }
        }

        fetchProduct()
    }, [params.id, reset])
    
    const saveProduct = async (data) => {
        const formData = {...data, "description": content}
    
        setDisable(true)
    
        const res = await fetch(`${apiUrl}/products/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }, body: JSON.stringify(formData)
        }).then(res => res.json()).then(result => {
            setDisable(false)
    
            if(result.status === 200) {
                toast.success(result.message)
                navigate('/admin/products')
            } else {
                const formErrors = result.errors
                Object.keys(formErrors).forEach((field) => {
                    setError(field, {message: formErrors[field][0]})
                })
            }
        })
    }

    const fetchCategories = async () => {
        const res = await fetch(`${apiUrl}/categories`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(result => {
            setCategories(result.data)
        })
    }
    
    const fetchSubcategories = async () => {
        const res = await fetch(`${apiUrl}/subcategories`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(result => {
            setSubcategories(result.data)
        })
    }
    
    const handleFile = async (e) => {
        const formData = new FormData()
        const file = e.target.files[0]
        formData.append('image', file)
        formData.append('product_id', params.id)
        setDisable(true)

        const res = await fetch(`${apiUrl}/save-product-image`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }, body: formData
        }).then(res => res.json()).then(result => {
            if (result.status === 200) {
                productImages.push(result.data)
                setProductImages(productImages)
            } else toast.error(result.errors.image[0])
            
            setDisable(false)
            e.target.value = ''
        })
    }

    const changeImage = async (image) => {
        const res = await fetch(`${apiUrl}/change-product-default-image?product_id=${params.id}&image=${image}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(result => {
            if (result.status === 200) toast.success(result.message)
            else console.log('Terjadi kesalahan')
        })
    }

    const deleteImage = async (id) => {
        if(confirm('Apakah Anda yakin ingin menghapus foto produk ini?')) {
            const res = await fetch(`${apiUrl}/delete-product-image/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            }).then(res => res.json()).then(result => {
                if(result.status === 200){
                    const newProductImages = productImages.filter(productImage => productImage.id != id)
                    setProductImages(newProductImages)
                    toast.success(result.message)
                }
                else toast.error(result.message)
            })
        }
    }

    useEffect(() => {
        fetchCategories()
        fetchSubcategories()
    }, [])

    return (
        <div className='container'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h4 className='h4 pb-0 mb-0'>Produk / Edit</h4>
                </div>
                <div className='col-md-3'>
                    <Sidebar />
                </div>
                <div className='col-md-9'>
                    <form onSubmit={handleSubmit(saveProduct)}>
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <div className='mb-3'>
                                    <label htmlFor='' className='form-label'>Nama</label>
                                    <input placeholder="Name"
                                    {
                                        ...register('title', {required: 'Kolom nama wajib diisi.'})
                                    }
                                    type='text' className={`form-control ${errors.title && 'is-invalid'}`} />
                                    {
                                        errors.title && <p className='invalid-feedback'>{errors.title?.message}</p>
                                    }
                                </div>

                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className='mb-3'>
                                            <label className='form-label' htmlFor=''>Kategori</label>
                                            <select
                                            {
                                                ...register('category', {required: 'Tolong pilih kategori.'})
                                            }
                                            className={`form-control ${errors.category && 'is-invalid'}`}>
                                                <option value=''>Pilih kategori</option>
                                                {
                                                    categories && categories.map((category) => {
                                                        return (
                                                            <option key={`category-${category.id}`} value={category.id}>{category.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            {
                                                errors.category && <p className='invalid-feedback'>{errors.category?.message}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='mb-3'>
                                            <label htmlFor='' className='form-label'>Subkategori</label>
                                            <select
                                            {
                                                ...register('subcategory', {required: 'Tolong pilih subkategori.'})
                                            }
                                            className={`form-control ${errors.subcategory && 'is-invalid'}`}>
                                                <option value=''>Pilih subkategori</option>
                                                {
                                                    subcategories && subcategories.map((subcategory) => {
                                                        return (
                                                            <option key={`subcategory-${subcategory.id}`} value={subcategory.id}>{subcategory.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            {
                                                errors.subcategory && <p className='invalid-feedback'>{errors.subcategory?.message}</p>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label' htmlFor=''>Deskripsi Singkat</label>
                                    <textarea placeholder="Short description"
                                    {
                                        ...register('short_description')
                                    }
                                    className='form-control' rows={3}></textarea>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label' htmlFor=''>Deskripsi Lengkap</label>
                                    <JoditEditor ref={editor} value={content} config={config} tabIndex={1} onBlur={newContent => setContent(newContent)} />
                                </div>

                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className='mb-3'>
                                            <label className='form-label' htmlFor=''>Harga</label>
                                            <input placeholder="Price"
                                            {
                                                ...register('price', {required: 'Kolom harga wajib diisi.'})
                                            }
                                            type='text' className={`form-control ${errors.price && 'is-invalid'}`} />
                                            {
                                                errors.price && <p className='invalid-feedback'>{errors.price?.message}</p>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className='mb-3'>
                                            <label className='form-label' htmlFor=''>SKU</label>
                                            <input placeholder="SKU"
                                            {
                                                ...register('sku', {required: 'Kolom SKU wajib diisi.'})
                                            }
                                            type='text' className={`form-control ${errors.sku && 'is-invalid'}`} />
                                            {
                                                errors.sku && <p className='invalid-feedback'>{errors.sku?.message}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='mb-3'>
                                            <label className='form-label' htmlFor=''>Barcode</label>
                                            <input placeholder="Barcode"
                                            {
                                                ...register('barcode', {required: 'Kolom barcode wajib diisi.'})
                                            }
                                            type='text' className='form-control' />
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className='mb-3'>
                                            <label className='form-label' htmlFor=''>Kuantitas</label>
                                            <input placeholder="Quantity"
                                            {
                                                ...register('quantity')
                                            }
                                            type='text' className='form-control' />
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='mb-3'>
                                            <label htmlFor='' className='form-label'>Status</label>
                                            <select
                                                {
                                                    ...register('status', {required: 'Tolong pilih status.'})
                                                }
                                                className={`form-control ${errors.status && 'is-invalid'}`}>
                                                    <option value=''>Pilih status</option>
                                                    <option value='1'>Aktif</option>
                                                    <option value='0'>Tidak aktif</option>
                                            </select>
                                            {
                                                errors.status && <p className='invalid-feedback'>{errors.status?.message}</p>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className='mb-3'>
                                    <label htmlFor='' className='form-label'>Unggulan</label>
                                    <select
                                        {
                                            ...register('is_featured', {required: 'Tolong pilih apakah produk ini unggulan atau bukan.'})
                                        }
                                        className={`form-control ${errors.is_featured && 'is-invalid'}`}>
                                            <option value=''>Select whether the product is featured or not</option>
                                            <option value='yes'>Ya</option>
                                            <option value='no'>Tidak</option>
                                    </select>
                                    {
                                        errors.is_featured && <p className='invalid-feedback'>{errors.is_featured?.message}</p>
                                    }
                                </div>

                                <div className='mb-3'>
                                    <label htmlFor='' className='form-label'>Gambar</label>
                                    <input onChange={handleFile} type='file' className='form-control' /> 
                                </div>

                                <div className='mb-3'>
                                    <div className='row'>
                                        {
                                            productImages && productImages.map((productImage, index) => {
                                                return (
                                                    <div className='col-md-3' key={`image-${index}`}>
                                                        <div className='card-shadow'>
                                                            <img src={productImage.image_url} className='w-100' />
                                                        </div>
                                                        <button type="button" className='btn btn-danger mt-3 w-100' onClick={() => deleteImage(productImage.id)}>Hapus</button>
                                                        <button type="button" className='btn btn-secondary mt-3 w-100' onClick={() => changeImage(productImage.image)}>Tetapkan sebagai Default</button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button disabled={disable} type='submit' className='btn btn-primary mt-3 mb-3 me-5'>Perbarui Produk</button>
                        <Link to='/admin/products' className='btn btn-primary'>Kembali ke List Produk</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Edit
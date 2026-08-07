import { useEffect, useState, useRef, useMemo } from 'react'
import Layout from '../../common/Layout'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../../common/Sidebar'
import { useForm } from 'react-hook-form'
import { adminToken, apiUrl } from '../../common/http'
import { toast } from 'react-toastify'
import JoditEditor from 'jodit-react'

const Create = ({ placeholder }) => {
    const editor = useRef(null)
    const [content, setContent] = useState('')
    const [disable, setDisable] = useState(false)
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [gallery, setGallery] = useState([])
    const [galleryImages, setGalleryImages] = useState([])
    const navigate = useNavigate()

    const config = useMemo(() => ({
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        placeholder: 'Full description'
    }), [placeholder])

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm()
    
    const saveProduct = async (data) => {
        const formData = {...data, "description": content, "gallery": gallery}
    
        setDisable(true)
    
        const res = await fetch(`${apiUrl}/products`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }, body: JSON.stringify(formData)
        }).then(res => res.json()).then(result => {
            setDisable(false)
    
            if (result.status === 200) {
                toast.success(result.message)
                navigate('/admin/products')
            } else if (result.errors) {
                Object.keys(result.errors).forEach((field) => {
                    setError(field, {
                        message: result.errors[field][0]
                    })
                })
            } else {
                toast.error(result.message || 'Terjadi kesalahan pada server')
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
            console.log(result)
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
        setDisable(true)

        const res = await fetch(`${apiUrl}/temp-images`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }, body: formData
        }).then(res => res.json()).then(result => {
            setGallery(prev => [...prev, result.data.id])

            setGalleryImages(prev => [
                ...prev,
                result.data.image_url
            ])

            setDisable(false)
            e.target.value = ''
        })
    }

    const deleteImage = (image) => {
        const newGallery = galleryImages.filter(gallery => gallery != image)
        setGalleryImages(newGallery)
    }

    useEffect(() => {
        fetchCategories()
        fetchSubcategories()
    }, [])

    return (
        <div className='container'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h4 className='h4 pb-0 mb-0'>Produk / Buat</h4>
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
                                    <input placeholder='Name'
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
                                                <option value=''>Pilih Kategori</option>
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
                                                <option value=''>Pilih Subkategori</option>
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
                                    <textarea placeholder='Short description'
                                    {
                                        ...register('short_description')
                                    }
                                    className='form-control' rows={3}></textarea>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label' htmlFor=''>Deskripsi Lengkap</label>
                                    <JoditEditor
                                        {
                                            ...register('description')
                                        }
                                        ref={editor}
                                        value={content}
                                        config={config}
                                        tabIndex={1} // tabIndex of textarea
                                        onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                                        onChange={newContent => { }}
                                    />
                                </div>

                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className='mb-3'>
                                            <label className='form-label' htmlFor=''>Harga</label>
                                            <input placeholder='Price'
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
                                            <input placeholder='SKU'
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
                                            <input placeholder='Barcode'
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
                                            <input placeholder='Quantity'
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
                                                    <option value='1'>Tersedia</option>
                                                    <option value='0'>Habis</option>
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
                                            <option value=''>Tolong pilih apakah produk ini unggulan atau tidak</option>
                                            <option value='1'>Ya</option>
                                            <option value='0'>Tidak</option>
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
                                            galleryImages && galleryImages.map((image, index) => {
                                                return (
                                                    <div className='col-md-3' key={`image-${index}`}>
                                                        <div className='card-shadow'>
                                                            <img src={image} className='w-100' />
                                                        </div>
                                                        <button className='btn btn-danger mt-3 w-100' onClick={() => deleteImage(image)}>Hapus</button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button disabled={disable} type='submit' className='btn btn-primary mt-3 mb-3 me-5'>Buat Produk</button>
                        <Link to='/admin/products' className='btn btn-primary'>Kembali ke List Produk</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Create
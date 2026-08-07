import { useEffect, useState } from 'react'
import Layout from '../common/Layout'
import { Link, useSearchParams } from 'react-router-dom'
import { apiUrl, userToken } from '../common/http'
import Loader from '../common/Loader'
import Nostate from '../common/Nostate'

const Shop = () => {
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [products, setProducts] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchKeyword, setSearchKeyword] = useState('')
    const [loader, setLoader] = useState(false)
    
    const [categoryChecked, setCategoryChecked] = useState(() => {
        const category = searchParams.get('category')
        return category ? category.split(',') : []
    })
    const [subcategoryChecked, setSubcategoryChecked] = useState(() => {
        const subcategory = searchParams.get('subcategory')
        return subcategory ? subcategory.split(',') : []
    })

    const fetchProducts = () => {
        setLoader(true)
        let search = []
        let params = ''

        if(categoryChecked.length > 0) search.push(['category', categoryChecked])
        if(subcategoryChecked.length > 0) search.push(['subcategory', subcategoryChecked])
        if (searchKeyword) search.push(['keyword', searchKeyword])
        
        if(search.length > 0) {
            params = new URLSearchParams(search)
            setSearchParams(params)
        } else setSearchParams([])

        fetch(`${apiUrl}/get-products?${params}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(result => {
            setLoader(false)

            if(result.status === 200) setProducts(result.data)
            else console.log('Something went wrong')
        })
    }

    const fetchCategories = () => {
        fetch(`${apiUrl}/get-categories`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(result => {
            if(result.status === 200) setCategories(result.data)
            else console.log('Something went wrong')
        })
    }

    const fetchSubategories = () => {
        fetch(`${apiUrl}/get-subcategories`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(result => {
            if(result.status === 200) setSubcategories(result.data)
            else console.log('Something went wrong')
        })
    }

    const handleCategory = (e) => {
        const {checked, value} = e.target
        if(checked) {
            setCategoryChecked(pre => [...pre, value])
        } else {
            setCategoryChecked(categoryChecked.filter(id => id != value))
        }
    }

    const handleSubcategory = (e) => {
        const {checked, value} = e.target
        if(checked) {
            setSubcategoryChecked(pre => [...pre, value])
        } else {
            setSubcategoryChecked(subcategoryChecked.filter(id => id != value))
        }
    }

    useEffect(() => {
        fetchCategories(),
        fetchSubategories(),
        fetchProducts()
    }, [categoryChecked, subcategoryChecked])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchProducts()
        }, 500) // delay 0.5 detik (500/1000)
        return () => clearTimeout(delayDebounce)
    }, [searchKeyword])

    return (
        <Layout>
            <div className='container'>
                <nav aria-label="breadcrumb" className='py-4'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Toko</li>
                    </ol>
                </nav>
                <div className='row'>
                    <div className='col-md-3'>
                        <div className='card shadow border-0 mb-3'>
                            <div className='card-body p-4'>
                                <h3>Kategori</h3>
                                <ul>
                                    {
                                        categories && categories.map(category => {
                                            return (
                                                <li className='mb-2' key={`category-${category.id}`}>
                                                    <input type='checkbox' value={category.id} onClick={handleCategory} defaultChecked={searchParams.get('category') ? searchParams.get('category').includes(category.id) : false} />
                                                    <label htmlFor='' className='ps-2'>{category.name}</label>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>

                        <div className='card shadow border-0 mb-3'>
                            <div className='card-body p-4'>
                                <h3>Subkategori</h3>
                                <ul>
                                    {
                                        subcategories && subcategories.map(subcategory => {
                                            return (
                                                <li className='mb-2' key={`subcategory-${subcategory.id}`}>
                                                    <input type='checkbox' value={subcategory.id} onClick={handleSubcategory} defaultChecked={searchParams.get('subcategory') ? searchParams.get('subcategory').includes(subcategory.id) : false} />
                                                    <label htmlFor='' className='ps-2'>{subcategory.name}</label>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-9'>
                        <div className='d-flex justify-content-end mb-4'>
                            <input type='text' className='form-control w-100' placeholder='Cari produk' value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
                        </div>
                        {
                            loader === true && <Loader />
                        }
                        {
                            loader === false && products.length == 0 && <Nostate text='Tidak ada produk' />
                        }
                        {
                            products && products.length > 0 &&
                            <div className='row pb-5'>
                                {
                                    products && products.length > 0 ? (
                                        products.map(product => (
                                            <div className='col-md-4 col-6' key={product.id}>
                                                <div className='product card border-0'>
                                                    <div className='card-img'>
                                                        <Link to={`/product/${product.id}`}>
                                                            <img src={product.image_url} className='w-100' />
                                                        </Link>
                                                    </div>
                                                    <div className='card-body pt-3'>
                                                        <Link to={`/product/${product.id}`}>{product.title}</Link>
                                                        <div className='price'>
                                                            Rp. {Number(product.price).toLocaleString('id-ID')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className='text-center py-5'>
                                            <h5 className='text-muted'>Tidak ada produk dengan kategori dan subkategori yang dipilih.</h5>
                                        </div>
                                    )
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Shop
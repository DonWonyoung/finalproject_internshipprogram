import { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import { Link } from 'react-router-dom'
import Sidebar from '../../common/Sidebar'
import { adminToken, apiUrl } from '../../common/http'
import Loader from '../../common/Loader'
import Nostate from '../../common/Nostate'
import { toast } from 'react-toastify'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

const Show = () => {
    const [categories, setCategories] = useState([])
    const [loader, setLoader] = useState(false)

    const fetchCategories = async () => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/categories`, {
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
                setCategories(result.data)
            } else {
                console.log('Terjadi kesalahan.')
            }
        })
    }

    const deleteCategory = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            const res = await fetch(`${apiUrl}/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            }).then(res => res.json()).then(result => {
                if(result.status === 200) {
                    const newCategories = categories.filter(category => category.id != id)
                    setCategories(newCategories)
                    toast.success(result.message)
                } else console.log('Terjadi kesalahan.')
            })
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <div className='container mb-5'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h4 className='h4 pb-0 mb-0'>List Kategori</h4>
                    <Link to='/admin/categories/create' className='btn btn-primary'>Buat Kategori</Link>
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
                                loader === false && categories.length == 0 && <Nostate text='Tidak ada kategori.' />
                            }
                            {
                                categories && categories.length > 0 &&
                                <table className='table table-hover'>
                                    <thead>
                                        <tr>
                                            <th width='50'>ID</th>
                                            <th>Nama</th>
                                            <th width='100'>Status</th>
                                            <th width='100'>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            categories && categories.map(category => {
                                                return (
                                                    <tr key={`category-${category.id}`}>
                                                        <td>{category.id}</td>
                                                        <td>{category.name}</td>
                                                        <td>
                                                            {
                                                                category.status == 1 ? <span className='badge text-bg-success'>Aktif</span> : <span className='badge text-bg-danger'>Tidak aktif</span>
                                                            }
                                                        </td>
                                                        <td>
                                                            <div className='d-flex align-items-center'>
                                                                <Link to={`/admin/categories/edit/${category.id}`} className='action-btn edit-btn'><FiEdit2 /></Link>
                                                                <Link onClick={() => deleteCategory(category.id)} className='action-btn delete-btn ms-2'><FiTrash2 /></Link>
                                                            </div>
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
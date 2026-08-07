import { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import Sidebar from '../../common/Sidebar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { adminToken, apiUrl } from '../../common/http'
import { useForm } from 'react-hook-form'

const Edit = () => {
    const [disable, setDisable] = useState(false)
    const navigate = useNavigate()
    const params = useParams()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    // ✅ FETCH DATA DI SINI
    useEffect(() => {
        const fetchSubcategory = async () => {
            const res = await fetch(`${apiUrl}/subcategories/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            const result = await res.json()
            console.log(result)

            if (result.status === 200) {
                // 🔥 INI YANG MENGISI FORM
                reset({
                    name: result.data.name,
                    status: String(result.data.status) // ⬅️ penting!
                })
            }
        }

        fetchSubcategory()
    }, [params.id, reset])

    const saveSubcategory = async (data) => {
        setDisable(true)

        const res = await fetch(`${apiUrl}/subcategories/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }, body: JSON.stringify(data)
        }).then(res => res.json()).then(result => {
            setDisable(false)

            if(result.status === 200) {
                toast.success(result.message)
                navigate('/admin/subcategories')
            } else {
                console.log('Terjadi kesalahan.')
            }
        })
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h4 className='h4 pb-0 mb-0'>Subkategori / Edit</h4>
                </div>
                <div className='col-md-3'>
                    <Sidebar />
                </div>
                <div className='col-md-9'>
                    <form onSubmit={handleSubmit(saveSubcategory)}>
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <div className='mb-3'>
                                    <label htmlFor='' className='form-label'>Nama</label>
                                    <input placeholder='Name'
                                        {
                                            ...register('name', {required: 'Kolom nama wajib diisi.'})
                                        }
                                        type='text' className={`form-control ${errors.name && 'is-invalid'}`} />
                                    {
                                        errors.name && <p className='invalid-feedback'>{errors.name?.message}</p>
                                    }
                                </div>

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
                        <button disabled={disable} type='submit' className='btn btn-primary mt-3 mb-3 me-5'>Perbarui Subkategori</button>
                        <Link to='/admin/subcategories' className='btn btn-primary'>Kembali ke List Subkategori</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Edit
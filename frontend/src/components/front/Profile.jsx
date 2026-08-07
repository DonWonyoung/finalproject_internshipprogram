import { useState } from 'react'
import Layout from '../common/Layout'
import UserSidebar from '../common/UserSidebar'
import { useForm } from 'react-hook-form'
import { apiUrl, userToken } from '../common/http'
import { toast } from 'react-toastify'
import Loader from '../common/Loader'

const Profile = () => {
    const [loading, setLoading] = useState(true)

    const {
        register,
        reset,
        setError,
        handleSubmit,
        formState: {errors}
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
                setLoading(false)
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

    const updateProfile = async (data) => {
        fetch(`${apiUrl}/update-profile`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }, body: JSON.stringify(data)
        }).then(res => res.json()).then(result => {
            if(result.status === 200) toast.success(result.message)
            else {
                const formErrors = result.errors
                Object.keys(formErrors).forEach((field) => {
                    setError(field, {message: formErrors[field][0]})
                })
            }
        })
    }

    return (
        <Layout>
            <div className='container mb-5'>
                <div className='row'>
                    <div className='d-flex justify-content-between mt-5 pb-3'>
                        <h4 className='h4 pb-0 mb-0'>Profil</h4>
                    </div>
                    <div className='col-md-3'>
                        <UserSidebar />
                    </div>
                    <div className='col-md-9'>
                        <div className='card shadow'>
                            <div className='card-body p-4'>
                                {
                                    loading === true && <Loader />
                                }
                                {
                                    loading === false &&
                                    <form onSubmit={handleSubmit(updateProfile)}>
                                        <div className='row'>
                                            <div className='mb-3 col-md-6'>
                                                <label htmlFor='name' className='form-label'>Nama</label>
                                                <input placeholder='John Doe'
                                                {
                                                    ...register('name', {required: 'Kolom nama wajib diisi.'})
                                                }
                                                type='text' id='name' className={`form-control ${errors.name && 'is-invalid'}`} />
                                                {errors.name && <p className='text-danger'>{errors.name?.message}</p>}
                                            </div>
                                            <div className='mb-3 col-md-6'>
                                                <label htmlFor='email' className='form-label'>Email</label>
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
                                                type='email' id='email' className={`form-control ${errors.email && 'is-invalid'}`} />
                                                {errors.email && <p className='text-danger'>{errors.email?.message}</p>}
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='mb-3'>
                                                <label htmlFor='address' className='form-label'>Alamat</label>
                                                <textarea placeholder='Address'
                                                {
                                                    ...register('address')
                                                }
                                                id='address' className='form-control' />
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='mb-3 col-md-6'>
                                                <label htmlFor='city' className='form-label'>Kota</label>
                                                <input placeholder='City'
                                                {
                                                    ...register('city')
                                                }
                                                type='text' id='city' className='form-control' />
                                            </div>
                                            <div className='mb-3 col-md-6'>
                                                <label htmlFor='state' className='form-label'>Provinsi</label>
                                                <input placeholder='State'
                                                {
                                                    ...register('state')
                                                }
                                                type='text' id='state' className='form-control' />
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='mb-3 col-md-6'>
                                                <label htmlFor='zip' className='form-label'>Kode Pos</label>
                                                <input placeholder='Post code'
                                                {
                                                    ...register('zip')
                                                }
                                                type='text' id='zip' className='form-control' />
                                            </div>
                                            <div className='mb-3 col-md-6'>
                                                <label htmlFor='mobile' className='form-label'>Nomor Telepon</label>
                                                <input placeholder='Phone number'
                                                {
                                                    ...register('mobile')
                                                }
                                                type='text' id='mobile' className='form-control' />
                                            </div>
                                        </div>
                                        <button className='btn btn-primary mt-4'>Perbarui profil</button>
                                    </form>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile
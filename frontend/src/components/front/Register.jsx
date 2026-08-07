import { useState } from 'react'
import Layout from '../common/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiUrl, googleUrl } from '../common/http'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import background from '../../assets/images/background.jpeg'

const Register = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm()

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState({new: false})

    const togglePassword = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] })
    }

    const onSubmit = async (data) => {
        const res = await fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            }, body: JSON.stringify(data)
        }).then(res => res.json()).then(result => {
            if(result.status === 200) {
                toast.success(result.message)
                navigate('/customer/verify-email')
            } else {
                const formErrors = result.errors
                Object.keys(formErrors).forEach((field) => {
                    setError(field, {message: formErrors[field][0]})
                })
            }
        })
    }

    return (
        <div className='d-flex justify-content-center align-items-center'
        style={{
            backgroundImage: `url(${background})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            height: '100vh', // penuh 1 layar
            width: '100vw'  // penuh 1 layar
        }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='card shadow border-0 form-width'>
                    <div className='card-body p-4'>
                        <h3 className='text-center border-bottom pb-2 mb-3'>Register</h3>
                        <div className='mb-3'>
                            <label htmlFor='' className='form-label'>Nama</label>
                            <input placeholder='John Doe'
                                {
                                    ...register('name', {required: 'Kolom nama wajib diisi.'})
                                }
                            type='text' className={`form-control ${errors.name && 'is-invalid'}`} />
                            {
                                errors.name && <p className='invalid-feedback'>{errors.name?.message}</p>
                            }
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='' className='form-label'>Email</label>
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
                            type='email' className={`form-control ${errors.email && 'is-invalid'}`} />
                            {
                                errors.email && <p className='invalid-feedback'>{errors.email?.message}</p>
                            }
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='' className='form-label'>Kata Sandi</label>
                            <div className='input-group'>
                                <input placeholder='••••••••'
                                {
                                    ...register('password', {required: 'Kolom kata sandi wajib diisi.'})
                                }
                                type={showPassword.new ? 'text' : 'password'} className={`form-control ${errors.password && 'is-invalid'}`} />
                                <span className='input-group-text' style={{ cursor: 'pointer' }} onClick={() => togglePassword('new')}>
                                    {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            {
                                errors.password && <p className='invalid-feedback'>{errors.password?.message}</p>
                            }
                        </div>

                        <button className='btn btn-secondary mt-3 w-100'>Register</button>

                        {/* Tombol Login Google */}
                        <Link to={`${googleUrl}/auth/google`} className="btn btn-light border mt-3 w-100 d-flex align-items-center justify-content-center gap-2">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" style={{ width: "20px", height: "20px" }} />
                            <span>Daftar dengan Google</span>
                        </Link>

                        <div className='d-flex justify-content-center pt-4 pb-2'>
                            <Link to='/customer/login'>Sudah punya akun? Login</Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register
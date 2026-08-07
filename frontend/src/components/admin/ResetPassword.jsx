import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '../common/Layout'
import { toast } from 'react-toastify'
import { apiUrl } from '../common/http'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import background from '../../assets/images/background.jpeg'

const ResetPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()
    
    const navigate = useNavigate()
    const query = new URLSearchParams(useLocation().search)
    const token = query.get("token")
    const email = query.get("email")

    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false
    })

    const togglePassword = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] })
    }

    const onSubmit = async (data) => {
        const response = await fetch(`${apiUrl}/admin/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
                email,
                token,
                password: data.password,
                password_confirmation: data.password_confirmation
            })
        })

        const result = await response.json()

        if (result.status === 200) {
            toast.success("Berhasil mengatur kata sandi.")
            navigate("/admin/login")
        } else toast.error("Gagal mereset kata sandi.")
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
                        <h3 className='text-center border-bottom pb-2 mb-3'>Reset Kata Sandi</h3>
                        <div className="mb-3">
                            <label className="form-label">Kata Sandi Baru</label>
                            <div className='input-group'>
                                <input placeholder='••••••••'
                                {
                                    ...register("password", {required: 'Kolom kata sandi baru wajib diisi.'})
                                }
                                type={showPassword.new ? 'text' : 'password'} className={`form-control ${errors.password && 'is-invalid'}`} />
                                <span className='input-group-text' style={{ cursor: 'pointer' }} onClick={() => togglePassword('new')}>
                                    {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                {
                                    errors.password && <p className='invalid-feedback'>{errors.password?.message}</p>
                                }
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Konfirmasi Kata Sandi</label>
                            <div className='input-group'>
                                <input placeholder='••••••••'
                                {
                                    ...register("password_confirmation", {required: 'Kolom konfirmasi kata sandi wajib diisi.'})
                                }
                                type={showPassword.confirm ? 'text' : 'password'} className={`form-control ${errors.password_confirmation && 'is-invalid'}`} />
                                <span className='input-group-text' style={{ cursor: 'pointer' }} onClick={() => togglePassword('confirm')}>
                                    {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                {
                                    errors.password_confirmation && <p className='invalid-feedback'>{errors.password_confirmation?.message}</p>
                                }
                            </div>
                        </div>

                        <button className="btn btn-secondary w-100 mt-3">Konfirmasi</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword
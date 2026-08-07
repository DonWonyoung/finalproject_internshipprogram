import { useContext, useState } from "react"
import Layout from "../common/Layout"
import { useForm } from "react-hook-form"
import { apiUrl } from "../common/http"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import { AdminAuthContext } from "../context/AdminAuth"
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import background from '../../assets/images/background.jpeg'

const Login = () => {
    const { login } = useContext(AdminAuthContext)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState({current: false})

    const togglePassword = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] })
    }

    const onSubmit = async (data) => {
        const res = await fetch(`${apiUrl}/admin/login`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                'ngrok-skip-browser-warning': 'true'
            }, body: JSON.stringify(data)
        }).then((res) => res.json()).then((result) => {
            if (result.status === 200) {
                const adminInfo = {
                    token: result.token,
                    id: result.id,
                    name: result.name,
                }
                localStorage.setItem("adminInfo", JSON.stringify(adminInfo))
                login(adminInfo)
                navigate("/admin/dashboard")
            } else toast.error(result.message)
        })
    }

    return (
        <div className="d-flex justify-content-center align-items-center"
        style={{
            backgroundImage: `url(${background})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            height: '100vh', // penuh 1 layar
            width: '100vw'  // penuh 1 layar
        }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card shadow border-0 form-width">
                    <div className="card-body p-4">
                        <h3 className="text-center border-bottom pb-2 mb-3">Admin Login</h3>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label">Email</label>
                            <input placeholder="someone@example.com"
                            {
                                ...register("email", {
                                    required: 'Kolom email wajib diisi.',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Alamat email tidak valid.',
                                    }
                                })
                            }
                            type="text"
                            className={`form-control ${errors.email && "is-invalid"}`}
                            />
                            {
                                errors.email && (<p className="invalid-feedback">{errors.email?.message}</p>)
                            }
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label">Kata Sandi</label>
                            <div className="input-group">
                                <input placeholder="••••••••"
                                {
                                    ...register("password", {required: 'Kolom kata sandi wajib diisi.'})
                                }
                                type={showPassword.current ? 'text' : 'password'} className={`form-control ${errors.password && 'is-invalid'}`} />
                                <span className='input-group-text' style={{ cursor: 'pointer' }} onClick={() => togglePassword('current')}>
                                    {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            {
                                errors.password && <p className="invalid-feedback">{errors.password?.message}</p>
                            }
                        </div>

                        <div className='d-flex justify-content-center'>
                            <Link to='/admin/forget-password'>Lupa kata sandi?</Link>
                        </div>

                        <button className="btn btn-secondary mt-3 w-100">Login</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login
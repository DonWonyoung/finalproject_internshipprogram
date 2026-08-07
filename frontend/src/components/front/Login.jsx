import { useContext, useEffect, useState } from 'react'
import Layout from '../common/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiUrl, googleUrl } from '../common/http'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { AuthContext } from '../context/Auth'
import background from '../../assets/images/background.jpeg'

const Login = () => {
    const [resendCooldown, setResendCooldown] = useState(0)
    const [resendLoading, setResendLoading] = useState(false)
    const [showResend, setShowResend] = useState(false)
    const [lastEmail, setLastEmail] = useState("")
    const { login } = useContext(AuthContext)

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

    useEffect(() => {
        if (resendCooldown <= 0) return

        const timer = setInterval(() => {
            setResendCooldown(prev => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [resendCooldown])

    const resendVerification = async (email) => {
        if (resendCooldown > 0) {
            toast.error(`Mohon tunggu ${resendCooldown} detik untuk menghindari spam.`)
            return
        }
        setResendLoading(true)

        try {
            const res = await fetch(`${apiUrl}/customer/resend-verification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({ email })
            })

            const result = await res.json()

            if (res.status === 429) {
                toast.error("Terlalu sering meminta link verifikasi.")
            } else {
                toast.success("Jika email terdaftar, link verifikasi telah dikirim.")
                setResendCooldown(60) // mulai cooldown
            }
        } catch {
            toast.error("Terjadi kesalahan server.")
        } finally {
            setResendLoading(false)
        }
    }

    const onSubmit = async (data) => {
        try {
            const res = await fetch(`${apiUrl}/customer/login`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(data)
            })

            let result
            try {
                result = await res.json()
            } catch (e) {
                toast.error("Response server tidak valid.")
                return
            }

            if (res.status === 200) {
                const userInfo = {
                    token: result.token,
                    id: Number(result.id),
                    name: result.name,
                    verified: result.email_verified_at ? true : false
                }

                localStorage.setItem("userInfo", JSON.stringify(userInfo))
                login(userInfo)
                navigate('/')

            } else if (res.status === 403) {
                setShowResend(true)
                setLastEmail(data.email)
                toast.error("Email belum diverifikasi. Silakan kirim ulang link verifikasi.")
            } else {
                toast.error(result.message || "Login gagal.")
            }

        } catch (error) {
            toast.error("Tidak dapat terhubung ke server.")
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get("token")
        const id = params.get("id")
        const name = params.get("name")
        const verified = params.get("verified") === "1"

        if(token) {
            const userInfo = {
                token,
                id: Number(id),
                name,
                verified
            }

            localStorage.setItem("userInfo", JSON.stringify(userInfo))
            login(userInfo)

            if (userInfo.verified) navigate("/")
            else navigate('/customer/verify-email')
        }
    }, [])

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
                        <h3 className='text-center border-bottom pb-2 mb-3'>Login</h3>
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
                                    type={showPassword.current ? 'text' : 'password'} className={`form-control ${errors.password && 'is-invalid'}`} />
                                <span className='input-group-text' style={{ cursor: 'pointer' }} onClick={() => togglePassword('current')}>
                                    {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                {
                                    errors.password && <p className='invalid-feedback'>{errors.password?.message}</p>
                                }
                            </div>
                        </div>

                        <div className='d-flex justify-content-center'>
                            <Link to='/customer/forget-password'>Lupa kata sandi?</Link>
                        </div>

                        <button className='btn btn-secondary mt-3 w-100'>Login</button>
                        {showResend && (
                            <button type="button" disabled={resendCooldown > 0 || resendLoading} onClick={() => resendVerification(lastEmail)} className="btn btn-warning mt-2 w-100">
                                {resendCooldown > 0 ? `Tunggu ${resendCooldown} detik` : resendLoading ? "Mengirim link..." : "Kirim ulang link verifikasi"}
                            </button>
                        )}

                        <button type='button' className="btn btn-light border mt-2 w-100 d-flex align-items-center justify-content-center gap-2" onClick={() => window.location.href = `${googleUrl}/auth/google`}>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" style={{ width: "20px", height: "20px" }} />
                            Login dengan Google
                        </button>

                        <div className='d-flex justify-content-center pt-4 pb-2'>
                            <Link to='/customer/register'>Belum punya akun? Register</Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login
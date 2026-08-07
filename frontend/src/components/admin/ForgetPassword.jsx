import Layout from "../common/Layout"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { apiUrl } from "../common/http"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import background from '../../assets/images/background.jpeg'

const ForgetPassword = () => {
    const [loading, setLoading] = useState(false)
    const [cooldown, setCooldown] = useState(0)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        if (cooldown <= 0) return

        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [cooldown])

    const onSubmit = async (data) => {
        if (cooldown > 0) {
            toast.error(`Mohon tunggu ${cooldown} detik untuk menghindari spam.`)
            return
        }
        setLoading(true)

        try {
            const res = await fetch(`${apiUrl}/admin/forget-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            toast.success("Jika email terdaftar, link reset sudah dikirim.")
            setCooldown(60)
        } catch (err) {
            toast.error("Terjadi kesalahan server.")
        } finally {
            setLoading(false)
        }
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
                        <h3 className="text-center border-bottom pb-2 mb-3">Lupa Kata Sandi</h3>
                    <div className="mb-3">
                        <label htmlFor="" className="form-label">Email</label>
                        <input placeholder="someone@example.com"
                        {
                            ...register("email", {required: 'Kolom email wajib diisi.'})
                        }
                        type="email" className={`form-control ${errors.email && "is-invalid"}`} />
                        {
                            errors.email && <p className="invalid-feedback">{errors.email?.message}</p>
                        }
                    </div>

                    <div className="d-flex justify-content-center">
                        <Link to="/admin/login">Kembali ke menu login</Link>
                    </div>

                    <button disabled={loading || cooldown > 0} className="btn btn-secondary mt-3 w-100">
                        {cooldown > 0 ? `Tunggu ${cooldown} detik` : loading ? "Mengirim link..." : "Kirim Link Reset"}
                    </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ForgetPassword
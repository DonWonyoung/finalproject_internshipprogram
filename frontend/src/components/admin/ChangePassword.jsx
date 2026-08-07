import { useState } from 'react'
import { adminToken, apiUrl } from '../common/http'
import Layout from '../common/Layout'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Sidebar from '../common/Sidebar'
import { toast } from 'react-toastify'

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    })
    
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const togglePassword = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const res = await fetch(`${apiUrl}/admin/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`,
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify(formData)
        }).then(res => res.json()).then(result => {
            if(result.status === 200) {
                toast.success('Berhasil mengubah kata sandi.')
                setFormData({
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: ''
                })
            } else toast.error('Gagal mengubah kata sandi.')
        })
    }

    return (
        <div className='container mb-5'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h4 className='h4 pb-0 mb-0'>Ganti Kata Sandi</h4>
                </div>
                <div className='col-md-3'>
                    <Sidebar />
                </div>
                <div className='col-md-9'>
                    <div className='card shadow'>
                        <div className='card-body p-4'>
                            <form onSubmit={handleSubmit}>
                                {/* Password Lama */}
                                <div className='mb-3 position-relative'>
                                    <label className='form-label'>Kata Sandi Sekarang</label>
                                    <div className='input-group'>
                                        <input placeholder='••••••••' type={showPassword.current ? 'text' : 'password'} name='current_password' className='form-control' value={formData.current_password} onChange={handleChange} required />
                                        <span className='input-group-text' style={{ cursor: 'pointer' }} onClick={() => togglePassword('current')}>
                                            {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </div>

                                {/* Password Baru */}
                                <div className='mb-3 position-relative'>
                                    <label className='form-label'>Kata Sandi Baru</label>
                                    <div className='input-group'>
                                        <input placeholder='••••••••' type={showPassword.new ? 'text' : 'password'} name='new_password' className='form-control' value={formData.new_password} onChange={handleChange} required />
                                        <span className='input-group-text' style={{ cursor: 'pointer' }} onClick={() => togglePassword('new')}>
                                            {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </div>

                                {/* Konfirmasi Password Baru */}
                                <div className='mb-3 position-relative'>
                                    <label className='form-label'>Konfirmasi Kata Sandi Baru</label>
                                    <div className='input-group'>
                                        <input placeholder='••••••••' type={showPassword.confirm ? 'text' : 'password'} name='new_password_confirmation' className='form-control' value={formData.new_password_confirmation} onChange={handleChange} required />
                                        <span className='input-group-text' style={{ cursor: 'pointer' }} onClick={() => togglePassword('confirm')}>
                                            {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </div>

                                <button type='submit' className='btn btn-primary'>Ubah Kata Sandi</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword
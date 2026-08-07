import Layout from '../common/Layout'
import { Link } from 'react-router-dom'
import background from '../../assets/images/background.jpeg'

const EmailVerified = () => {
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
            <div className='card shadow border-0 p-5'>
                <h3>Email berhasil diverifikasi!</h3>
                <p>Sekarang Anda dapat login ke akun Anda.</p>
                <Link className="btn btn-secondary mt-3" to="/customer/login">Login Sekarang</Link>
            </div>
        </div>
    )
}

export default EmailVerified
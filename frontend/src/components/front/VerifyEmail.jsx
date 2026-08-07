import Layout from '../common/Layout'
import background from '../../assets/images/background.jpeg'

const VerifyEmail = () => {
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
            <div className="card shadow border-0 p-4">
                <h4 className="text-center">Verifikasi Email Anda</h4>
                <p className="text-center mt-3">
                    Kami telah mengirim link verifikasi ke email Anda.
                    Silakan buka email tersebut dan klik link untuk mengaktifkan akun Anda.
                </p>
            </div>
        </div>
    )
}

export default VerifyEmail
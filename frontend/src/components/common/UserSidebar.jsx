import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/Auth'

const UserSidebar = () => {
    const { logout } = useContext(AuthContext)

    return (
        <div className='card shadow mb-5 sidebar'>
            <div className='card-body p-4'>
                <ul>
                    <li>
                        <Link to='/customer/profile'>Profil</Link>
                    </li>
                    <li>
                        <Link to='/customer/orders'>Pesanan</Link>
                    </li>
                    <li>
                        <Link to='/customer/change-password'>Ganti Kata Sandi</Link>
                    </li>
                    <li>
                        <Link to='/customer/login' onClick={logout}>Logout</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default UserSidebar
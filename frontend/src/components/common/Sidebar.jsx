import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AdminAuthContext } from '../context/AdminAuth'

const Sidebar = () => {
    const { logout } = useContext(AdminAuthContext)

    return (
        <div className='card shadow mb-5 sidebar'>
            <div className='card-body p-4'>
                <ul>
                    <li>
                        <Link to='/admin/dashboard'>Dasbor</Link>
                    </li>
                    <li>
                        <Link to='/admin/categories'>Kategori</Link>
                    </li>
                    <li>
                        <Link to='/admin/subcategories'>Subkategori</Link>
                    </li>
                    <li>
                        <Link to='/admin/products'>Produk</Link>
                    </li>
                    <li>
                        <Link to='/admin/orders'>Pesanan</Link>
                    </li>
                    <li>
                        <Link to='/admin/users'>Pengguna</Link>
                    </li>
                    <li>
                        <Link to='/admin/change-password'>Ganti Kata Sandi</Link>
                    </li>
                    <li>
                        <Link to='/admin/login' onClick={logout}>Logout</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar
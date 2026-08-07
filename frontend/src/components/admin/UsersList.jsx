import { useEffect, useState } from 'react'
import Layout from '../common/Layout'
import Sidebar from '../common/Sidebar'
import { adminToken, apiUrl } from '../common/http'
import Loader from '../common/Loader'
import Nostate from '../common/Nostate'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const UsersList = () => {
    const [users, setUsers] = useState([])
    const [loader, setLoader] = useState(false)

    const fetchUsers = async () => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/users`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(result => {
            setLoader(false)

            if(result.status === 200) {
                setUsers(result.data)
            } else {
                console.log('Terjadi kesalahan.')
            }
        })
    }

    const deleteUser = async (id) => {
        if(confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            const res = await fetch(`${apiUrl}/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            }).then(res => res.json()).then(result => {
                if(result.status === 200) {
                    const newUsers = users.filter(user => user.id != id)
                    setUsers(newUsers)
                    toast.success(result.message)
                } else toast.error(result.message)
            })
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div className='container mb-5'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h4 className='h4 pb-0 mb-0'>List Pengguna</h4>
                </div>
                <div className='col-md-3'>
                    <Sidebar />
                </div>
                <div className='col-md-9'>
                    <div className="card shadow">
                        <div className="card-body p-4">
                            {
                                loader === true && <Loader />
                            }
                            {
                                loader === false && users.length == 0 && <Nostate text='Tidak ada pengguna.' />
                            }
                            {
                                users && users.length > 0 &&
                                <table className='table table-hover'>
                                    <thead>
                                        <tr>
                                            <th>Nama</th>
                                            <th>Email</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            users && users.map(user => {
                                                return (
                                                    <tr key={`user-${user.id}`}>
                                                        <td>{user.name}</td>
                                                        <td>{user.email}</td>
                                                        <td>
                                                            <Link onClick={() => deleteUser(user.id)} className='btn btn-danger'>Hapus Pengguna</Link>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersList
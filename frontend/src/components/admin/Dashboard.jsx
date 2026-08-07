import { useEffect, useState } from 'react'
import Layout from '../common/Layout'
import Sidebar from '../common/Sidebar'
import { Link } from 'react-router-dom'
import { adminToken, apiUrl } from '../common/http'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const Dashboard = () => {
    const [counts, setCounts] = useState({
        users: 0,
        orders: 0,
        products: 0,
        monthly_sales: []
    })

    const [loader, setLoader] = useState(false)

    const fetchCounts = async () => {
        setLoader(true)
        try {
            const res = await fetch(`${apiUrl}/dashboard`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${adminToken()}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            const result = await res.json()
            setLoader(false)

            if (result.status === 200) {
                setCounts(result.data)
            } else {
                console.log('Terjadi kesalahan.')
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat mengambil data dasbor:', error)
            setLoader(false)
        }
    }
    
    useEffect(() => {
        fetchCounts()
    }, [])

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'Mei', 'Jun', 'Jul', 'Agu',
        'Sep', 'Okt', 'Nov', 'Des'
    ]

    const salesData = Array(12).fill(0)

    counts.monthly_sales.forEach(item => {
        salesData[item.month - 1] = item.total_sales
    })

    const chartData = {
        labels: monthNames,
        datasets: [
            {
                label: 'Penjualan Bulanan',
                data: salesData,
                borderColor: '#0d6efd',
                backgroundColor: 'rgb(19, 137, 221)'
            }
        ]
    }

    return (
        <div className='container'>
            <div className='row'>
                <div className='d-flex justify-content-between mt-5 pb-3'>
                    <h4 className='h4 pb-0 mb-0'>Dasbor</h4>
                </div>
                <div className='col-md-3'>
                    <Sidebar />
                </div>
                <div className='col-md-9'>
                    <div className='row'>
                        <div className='col-md-4'>
                            <div className='card shadow'>
                                <div className='card-body'>
                                    <h2 className='text-center'>{counts.users}</h2>
                                    <span><center>Pengguna</center></span>
                                </div>
                                <div className="card-footer">
                                    <Link to='/admin/users'><center>Lihat List Pengguna</center></Link>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='card shadow'>
                                <div className='card-body'>
                                    <h2 className='text-center'>{counts.orders}</h2>
                                    <span><center>Pesanan</center></span>
                                </div>
                                <div className="card-footer">
                                    <Link to='/admin/orders'><center>Lihat List Pesanan</center></Link>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='card shadow'>
                                <div className='card-body'>
                                    <h2 className='text-center'>{counts.products}</h2>
                                    <span><center>Produk</center></span>
                                </div>
                                <div className="card-footer">
                                    <Link to='/admin/products'><center>Lihat List Produk</center></Link>
                                </div>
                            </div>
                        </div>
                        <div className='row py-4'>
                            <div className='col-md-12'>
                                <div className='card shadow'>
                                    <div className='card-body'>
                                        <h4 className='mb-4'>Statistik Penjualan Per Bulan</h4>
                                        <Line data={chartData} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
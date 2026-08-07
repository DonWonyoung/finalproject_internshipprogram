import React, { useEffect, useState } from 'react'
import 'swiper/css'
import Layout from '../common/Layout'
import { apiUrl, userToken } from '../common/http'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Link } from 'react-router-dom'
import Loader from '../common/Loader'
import Nostate from '../common/Nostate'

const Promo = () => {
    const [promos, setPromos] = useState([])
    const [loader, setLoader] = useState(true)

    const fetchPromos = async () => {
        setLoader(true)

        try {
            const response = await fetch(`${apiUrl}/promos`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken()}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            const result = await response.json()

            console.log(result)

            if (response.ok) {
                setPromos(result)
            } else {
                console.log('Terjadi kesalahan.')
                setPromos([])
            }

        } catch (error) {
            console.log(error)
            setPromos([])
        } finally {
            setLoader(false)
        }
    }

    useEffect(() => {
        fetchPromos()
    }, [])

    return (
        <Layout>
            <div className='container'>
                <nav aria-label="breadcrumb" className='py-4'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/">Home</Link>
                        </li>

                        <li className="breadcrumb-item active">
                            Promo
                        </li>
                    </ol>
                </nav>

                {loader && <Loader />}

                {!loader && promos.length === 0 && (
                    <Nostate text='Tidak ada promo' />
                )}

                {!loader && promos.length > 0 && (
                    <section className="section-1">
                        {promos.map((promo) => (
                            <div key={promo.id}
                            style={{ 
                                marginBottom: "20px",
                                border: "1px solid black",
                                padding: "10px",
                                borderRadius: "10px"
                            }}>
                                <img src={promo.image_url} alt={promo.name}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        display: "block"
                                    }}
                                />

                                <p style={{ marginTop: "10px" }}>
                                    {promo.description}
                                </p>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </Layout>
    )
}

export default Promo
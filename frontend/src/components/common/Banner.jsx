import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useEffect, useState } from 'react'
import { apiUrl, userToken } from './http'

const Banner = () => {
    const [promos, setPromos] = useState([])

    useEffect(() => {
        fetch(`${apiUrl}/promos`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`,
                'ngrok-skip-browser-warning': 'true'
            }
        }).then(res => res.json()).then(data => setPromos(data)).catch(err => console.error(err))
    }, [])

    return (
        <section className='section-1'>
            <Swiper spaceBetween={0} slidesPerView={1}>
                {promos.map((promo) => (
                    <SwiperSlide key={promo.id}>
                        <div
                        className="content"
                        style={{
                            backgroundImage: `url(${promo.image_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center center",
                            backgroundRepeat: "no-repeat",
                            height: "100%",
                            width: "100%"
                        }}
                        ></div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}

export default Banner
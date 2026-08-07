import LatestProducts from '../common/LatestProducts'
import Banner from '../common/Banner'
import Layout from '../common/Layout'
import FeaturedProducts from '../common/FeaturedProducts'

const Home = () => {
    return (
        <>
            <Layout>
                <Banner />
                <LatestProducts />
                <FeaturedProducts />
            </Layout>
        </>
    )
}

export default Home
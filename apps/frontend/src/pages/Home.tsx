import { Link } from 'react-router-dom';

const HomePage = () => {

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Descubre tu próxima
              <span className="text-yellow-400"> gran lectura</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Miles de libros esperándote. Desde clásicos atemporales hasta los últimos bestsellers, 
              encuentra todo lo que necesitas para alimentar tu pasión por la lectura.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/catalog"
                className="px-8 py-4 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
              >
                Explorar Catálogo
              </Link>
              <button className="px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-800 transition-colors">
                Ver Ofertas
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

  )
}

export default HomePage;
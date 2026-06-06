import { MapPin, Store, Sparkles } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: 'register' | 'discover') => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="size-full flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-800 font-medium">
            <Sparkles className="size-5" />
            Descubre Durango
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
            Comercio Local Inteligente
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conecta con los negocios tradicionales de Durango de forma rápida y sencilla
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Discover Card */}
          <button
            onClick={() => onNavigate('discover')}
            className="group relative overflow-hidden bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-orange-200"
          >
            <div className="relative z-10 space-y-4">
              <div className="size-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="size-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Descubrir</h2>
              <p className="text-gray-600 text-lg">
                Explora comercios locales, rutas turísticas y encuentra los mejores lugares de Durango
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  Antojitos
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Mezcal
                </span>
                <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                  Artesanías
                </span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Register Card */}
          <button
            onClick={() => onNavigate('register')}
            className="group relative overflow-hidden bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-purple-200"
          >
            <div className="relative z-10 space-y-4">
              <div className="size-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Store className="size-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Registrar Negocio</h2>
              <p className="text-gray-600 text-lg">
                Registra tu comercio en menos de 2 minutos usando tu voz. Sin formularios complicados.
              </p>
              <div className="flex items-center gap-2 text-purple-600 font-semibold">
                <Sparkles className="size-5" />
                <span>Powered by IA</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-500 text-sm">
          <p>Plataforma desarrollada para el Hackathon Durango 2026</p>
        </div>
      </div>
    </div>
  );
}

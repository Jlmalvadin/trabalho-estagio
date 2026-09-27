'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/types';

const PIAUI_HIGHLIGHTS = [
  { icon: '🌊', title: 'Litoral', text: 'Delta do Parnaíba, Barra Grande, Pedra do Sal e o Cajueiro-Rei.' },
  { icon: '🪨', title: 'Serra da Capivara', text: 'Patrimônio Mundial com a maior concentração de pinturas rupestres das Américas.' },
  { icon: '⛰️', title: 'Sete Cidades e Pedro II', text: 'Formações rochosas, mirantes e a cidade serrana da opala.' },
  { icon: '⛪', title: 'Cidades Históricas', text: 'Oeiras, a primeira capital, além de Piracuruca, Amarante e Campo Maior.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden bg-gradient-to-br from-blue-600 to-green-600">
        {/* Animated Background Elements - mais sutis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white opacity-10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white opacity-10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white opacity-10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Logo/Title */}
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
              Descubra Piauí
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/90">
              Do litoral ao sertão. Explore os encantos do estado!
            </p>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed animate-fadeIn animation-delay-500">
            Mergulhe na rica cultura, história e natureza do Piauí. Nossa plataforma interativa te guia pelos principais pontos turísticos, museus, parques e monumentos do estado.
          </p>

          {/* Stats - Mais simples, com ícones sutis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fadeIn animation-delay-1000">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 shadow-lg">
              <div className="text-4xl text-white mb-3">📍</div>
              <div className="text-2xl font-bold text-white mb-1">15+</div>
              <div className="text-white/80">Locais Incríveis</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 shadow-lg">
              <div className="text-4xl text-white mb-3">🗺️</div>
              <div className="text-2xl font-bold text-white mb-1">{CATEGORIES.length}</div>
              <div className="text-white/80">Categorias</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 shadow-lg">
              <div className="text-4xl text-white mb-3">✨</div>
              <div className="text-2xl font-bold text-white mb-1">Totalmente</div>
              <div className="text-white/80">Interativo</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn animation-delay-1500">
            <Link
              href="/mapa"
              className="group bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-full shadow-xl transition-all hover:scale-105 hover:bg-gray-100 flex items-center gap-3"
            >
              <svg className="w-6 h-6 group-hover:rotate-6 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-4.418 0-8 3.582-8 8 0 4.218 5.61 10.592 7.234 12.38.384.41.986.41 1.37 0 1.624-1.788 7.234-8.162 7.234-12.38 0-4.418-3.582-8-8-8zm0 11.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
              </svg>
              <span>Explorar o Mapa</span>
            </Link>
            <a
              href="#sobre"
              className="group bg-transparent text-white font-semibold text-lg px-8 py-4 rounded-full border-2 border-white/40 hover:border-white transition-all hover:scale-105 flex items-center gap-3 backdrop-blur-sm shadow-md"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 6h2v10h-2v-10zm1 14c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z"/>
              </svg>
              <span>Saiba Mais</span>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/60">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
              Sobre o Projeto
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Uma plataforma moderna para conhecer e explorar as belezas do Piauí.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="text-5xl text-blue-500 mb-4">🗺️</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Mapa Interativo</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Navegue por um mapa completo com todos os pontos turísticos do Piauí,
                com localização precisa e informações detalhadas.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="text-5xl text-green-500 mb-4">📸</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Fotos e Descrições</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Visualize fotos dos locais e leia descrições completas sobre a história
                e características de cada ponto turístico.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="text-5xl text-yellow-500 mb-4">🧭</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Como Chegar</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Integração com Google Maps para você traçar a melhor rota
                até o local que deseja visitar.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="text-5xl text-purple-500 mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Busca Avançada</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Encontre rapidamente o que procura com nossa busca por nome,
                categoria ou bairro.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="text-5xl text-pink-500 mb-4">📱</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">100% Responsivo</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Acesse de qualquer dispositivo - desktop, tablet ou smartphone -
                com uma experiência otimizada.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="text-5xl text-orange-500 mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Rápido e Moderno</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Desenvolvido com as tecnologias mais modernas para oferecer
                uma experiência rápida e fluida.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/mapa"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-green-600 to-yellow-500 hover:from-blue-700 hover:via-green-700 hover:to-yellow-600 text-white font-bold text-xl px-10 py-5 rounded-full shadow-2xl transition-all hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-4.418 0-8 3.582-8 8 0 4.218 5.61 10.592 7.234 12.38.384.41.986.41 1.37 0 1.624-1.788 7.234-8.162 7.234-12.38 0-4.418-3.582-8-8-8zm0 11.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
              </svg>
              <span>Começar a Explorar</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Explore o Piauí */}
      <section id="piaui" className="bg-gradient-to-br from-green-600 to-blue-700 py-20 px-4 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Explore o Piauí</h2>
            <p className="text-xl text-white/85 max-w-2xl mx-auto">
              Teresina é só o começo. Do litoral ao sertão, conheça outros destinos do estado.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {PIAUI_HIGHLIGHTS.map(item => (
              <div key={item.title} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/mapa?regiao=piaui"
              className="inline-flex items-center gap-3 bg-white text-green-700 font-bold text-lg px-8 py-4 rounded-full shadow-xl transition-all hover:scale-105 hover:bg-gray-100"
            >
              <span>Ver o mapa do Piauí</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Descubra Piauí</h3>
            <p className="text-gray-400">Desenvolvido com ❤️ por João Lucas para promover o turismo no Piauí</p>
          </div>
          <div className="flex justify-center gap-8 text-sm text-gray-400 mb-6">
            <span className="flex items-center gap-2">
              <span className="text-green-400">🌱</span>
              Natureza
            </span>
            <span className="flex items-center gap-2">
              <span className="text-blue-400">💧</span>
              Rios
            </span>
            <span className="flex items-center gap-2">
              <span className="text-yellow-400">☀️</span>
              Sol
            </span>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Descubra Piauí · João Lucas. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
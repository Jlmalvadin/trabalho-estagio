import { getPointsStats } from '@/lib/pointsServer';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const stats = await getPointsStats();

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Dashboard Administrativo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total de Pontos Turísticos</h2>
          <p className="text-5xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-gray-500 mt-2">Locais cadastrados no sistema.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Categorias Ativas</h2>
          <div className="text-2xl font-bold text-green-600">{stats.categories.filter(cat => cat.count > 0).length}</div>
          <ul className="mt-4 space-y-2 text-gray-700 text-sm">
            {stats.categories.map((cat: any) => (
              <li key={cat.value} className="flex justify-between items-center">
                <span>{cat.label}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">{cat.count}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Ações Rápidas</h2>
            <p className="text-gray-500 mb-4">Gerencie os pontos turísticos.</p>
          </div>
          <div className="space-y-3">
            <Link 
              href="/admin/points/new" 
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              Adicionar Novo Ponto
            </Link>
            <Link 
              href="/admin/points" 
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m7 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v6m12 0v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6"/></svg>
              Ver Todos os Pontos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
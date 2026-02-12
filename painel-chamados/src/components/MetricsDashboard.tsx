import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';

interface MetricsProps {
  total: number;
  status: {
    ABERTO: number;
    ANDAMENTO: number;
    ENCERRADO: number;
  }
}

export function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricsProps | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const response = await api.get('/metrics');
        setMetrics(response.data);
      } catch (err) {
        console.log("Erro ao carregar métricas");
      }
    }
    loadMetrics();
  }, []);

  if (!metrics) return <div className="p-4">Carregando gráficos...</div>;

  // Dados formatados para o gráfico do Recharts
  const data = [
    { name: 'Aberto', value: metrics.status.ABERTO, color: '#EF4444' }, // Vermelho
    { name: 'Em Andamento', value: metrics.status.ANDAMENTO, color: '#3B82F6' }, // Azul
    { name: 'Encerrado', value: metrics.status.ENCERRADO, color: '#10B981' }, // Verde
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-700 mb-4">Visão Geral do Sistema</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* LADO ESQUERDO: Cards com números */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-500 text-sm font-bold">TOTAL DE CHAMADOS</p>
            <p className="text-3xl font-bold text-gray-800">{metrics.total}</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
            <p className="text-red-500 text-sm font-bold">PENDENTES</p>
            <p className="text-3xl font-bold text-red-600">{metrics.status.ABERTO}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
            <p className="text-blue-500 text-sm font-bold">EM ATENDIMENTO</p>
            <p className="text-3xl font-bold text-blue-600">{metrics.status.ANDAMENTO}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
            <p className="text-green-500 text-sm font-bold">FINALIZADOS</p>
            <p className="text-3xl font-bold text-green-600">{metrics.status.ENCERRADO}</p>
          </div>
        </div>

        {/* LADO DIREITO: Gráfico de Pizza */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60} // Faz virar um gráfico de "Rosca" (Donut)
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
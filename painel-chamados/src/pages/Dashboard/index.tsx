import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/Button';
import { api } from '../../services/api';
import { NewTicketModal } from '../../components/NewTicketModal';
import { TicketDetailModal } from '../../components/TicketDetailModal';
import {MetricsDashboard} from '../../components/MetricsDashboard'
import { NewClientModal } from '../../components/NewClientModal';

// Importando formatador de data
import { format, formatDistance } from 'date-fns';
import {ptBR} from 'date-fns/locale';

export interface TicketProps {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  started_at?: string; // Novo
  ended_at?: string;   // Novo
  customer_id: string;
  customer?: {
    name: string;
  };
  technician?: {
    name: string;
  };
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [tickets, setTickets] = useState<TicketProps[]>([]);
  
  const [modalNewTicketOpen, setModalNewTicketOpen] = useState(false);
  const [modalDetailOpen, setModalDetailOpen] = useState(false);
  const [ticketDetail, setTicketDetail] = useState<TicketProps>();
  const [searchText, setSearchText] = useState('');
  const [modalClientOpen, setModalClientOpen] = useState(false);

  async function loadTickets() {
    if (!user) return;
    const response = await api.get('/tickets');
    setTickets(response.data);
  }

  useEffect(() => {
    loadTickets();
  }, [user]);

  function handleOpenModalDetail(ticket: TicketProps) {
    setTicketDetail(ticket);
    setModalDetailOpen(true);
  }

  // Função para calcular "Tempo de Vida" do chamado
  function calculateDuration(ticket: TicketProps) {
    // Se está FECHADO, calcula quanto tempo levou (Fim - Criação)
    if (ticket.status === 'ENCERRADO' && ticket.ended_at) {
      const duration = formatDistance(new Date(ticket.ended_at), new Date(ticket.created_at), { locale: ptBR });
      return `Levou: ${duration}`;
    }

    // Se está ABERTO ou ANDAMENTO, calcula quanto tempo está esperando (Agora - Criação)
    return `Aberto há: ${formatDistance(new Date(), new Date(ticket.created_at), { locale: ptBR })}`;
  }

  // Função auxiliar para formatar data
  function formatDate(dateString?: string) {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm");
  }

  if (!user) return <div className="flex justify-center items-center h-screen">Carregando...</div>;


// FILTRAMOS A LISTA GERAL (Baseado no que foi digitado)
  const filteredTickets = tickets.filter(ticket => {
    // Se a busca estiver vazia, retorna o chamado normal
    if (searchText === '') return true;

    const searchLower = searchText.toLowerCase();

    // Verifica Título, ID ou Nome do Cliente
    return (
      ticket.title.toLowerCase().includes(searchLower) ||
      String(ticket.id).includes(searchLower) ||
      ticket.customer?.name.toLowerCase().includes(searchLower) ||
      false // Segurança caso customer seja undefined
    );
  });

  // 2. AGORA SEPARAMOS AS COLUNAS USANDO A LISTA JÁ FILTRADA
  // Note que agora usamos 'filteredTickets' em vez de 'tickets'
  const openTickets = filteredTickets.filter(t => t.status === 'ABERTO');
  const progressTickets = filteredTickets.filter(t => t.status === 'EM ANDAMENTO');
  const closedTickets = filteredTickets.filter(t => t.status === 'ENCERRADO');

  // Componente de Card (Para não repetir código nas colunas)
  const TicketCard = ({ ticket }: { ticket: TicketProps }) => (
    <div onClick={() => handleOpenModalDetail(ticket)} className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer border border-gray-100 transition-all mb-3 relative overflow-hidden group">
      {/* Borda colorida lateral baseada no status */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        ticket.status === 'ABERTO' ? 'bg-green-500' : 
        ticket.status === 'EM ANDAMENTO' ? 'bg-blue-500' : 'bg-gray-400'
      }`}></div>

      <div className="pl-3">
        <div className="flex justify-between items-start mb-2">
          <span className="font-bold text-gray-800 text-sm truncate pr-2">#{ticket.id} - {ticket.title}</span>
        </div>
        
        {user.role === 'TECH' && (
          <p className="text-xs text-gray-500 mb-2">Cliente: <span className="font-medium text-gray-700">{ticket.customer?.name}</span></p>
        )}

        {ticket.technician && (
             <p className="text-xs text-gray-500 mb-1">
               Atendido por: <span className="font-medium text-blue-600">{ticket.technician.name}</span>
             </p>
          )}

        <div className="mt-2 mb-1">
          <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
            ⏳ {calculateDuration(ticket)}
          </span>
        </div>

        <div className="text-[10px] text-gray-400 flex flex-col gap-0.5 mt-3 border-t pt-2 border-gray-50">
          <span>📅 Criado: {formatDate(ticket.created_at)}</span>
          {ticket.started_at && <span className="text-blue-600">🚀 Iniciado: {formatDate(ticket.started_at)}</span>}
          {ticket.ended_at && <span className="text-green-600">🏁 Finalizado: {formatDate(ticket.ended_at)}</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      
      {/* CABEÇALHO */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="w-screen px-4 sm:px-6 lg:px-10 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Nex<span className="text-blue-600">Support</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role === 'TECH' ? 'Técnico' : 'Cliente'}</p>
            </div>
            <Button onClick={signOut} style={{ backgroundColor: '#ef4444', height: '36px', padding: '0 16px' }}>Sair</Button>
          </div>
        </div>
      </header>

      <main className="w-screen mt-8 px-4 sm:px-6 lg:px-10">
        
        <div className="flex justify-between items-center mb-8">
          {/* BARRA DE BUSCA */}
          <div className="w-full max-w-md relative">
            <input 
              type="text" 
              placeholder="🔍 Buscar por ID, assunto ou cliente..." 
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* BOTÃO NOVO CHAMADO (Mova para cá para ficar alinhado) */}
          {user.role !== 'TECH' && (
             <button 
              onClick={() => setModalNewTicketOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 ml-4"
            >
              + Novo
            </button>
          )}

          {user.role === 'TECH' && (
              <button 
                onClick={() => setModalClientOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full shadow transition-transform hover:scale-105 flex items-center gap-2"
              >
                + Cliente
              </button>
            )}

        </div>

        {/* --- ÁREA DE MÉTRICAS (SÓ PARA TÉCNICOS) --- */}
        {user.role === 'TECH' && (
          <MetricsDashboard />
        )}
        {/* ------------------------------------------- */}

        {/* --- LAYOUT DE COLUNAS (KANBAN) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLUNA 1: ABERTO */}
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Em Aberto ({openTickets.length})
            </h2>
            <div className="bg-gray-50/50 rounded-xl p-2 min-h-[200px]">
              {openTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
              {openTickets.length === 0 && <p className="text-center text-gray-400 text-xs py-10">Nada por aqui</p>}
            </div>
          </div>

          {/* COLUNA 2: EM ANDAMENTO */}
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Em Andamento ({progressTickets.length})
            </h2>
            <div className="bg-gray-50/50 rounded-xl p-2 min-h-[200px]">
              {progressTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
              {progressTickets.length === 0 && <p className="text-center text-gray-400 text-xs py-10">Nenhum atendimento</p>}
            </div>
          </div>

          {/* COLUNA 3: FINALIZADO */}
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              Finalizados ({closedTickets.length})
            </h2>
            <div className="bg-gray-50/50 rounded-xl p-2 min-h-[200px]">
              {closedTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
              {closedTickets.length === 0 && <p className="text-center text-gray-400 text-xs py-10">Histórico vazio</p>}
            </div>
          </div>

        </div>
      </main>

      <NewTicketModal 
        isOpen={modalNewTicketOpen}
        onRequestClose={() => setModalNewTicketOpen(false)}
        userId={user.id}
        onSuccess={loadTickets}
      />

      <TicketDetailModal 
        isOpen={modalDetailOpen}
        onRequestClose={() => setModalDetailOpen(false)}
        ticket={ticketDetail}
        onUpdate={loadTickets}
        user_id={user.id}
        user_role={user.role}
      />

      {modalClientOpen && (
        <NewClientModal
          isOpen={modalClientOpen}
          onRequestClose={() => setModalClientOpen(false)}
        />
      )}
    </div>
  );
}
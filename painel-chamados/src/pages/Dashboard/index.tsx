import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/Button";
import { api } from "../../services/api";
import { FiUsers, FiX, FiEdit } from "react-icons/fi";

import { NewTicketModal } from "../../components/NewTicketModal";
import { TicketDetailModal } from "../../components/TicketDetailModal";
import { MetricsDashboard } from "../../components/MetricsDashboard";
import { NewClientModal } from "../../components/NewClientModal";

// Importando formatador de data
import { format, formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface TicketProps {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  started_at?: string; // Novo
  ended_at?: string; // Novo
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
  const [searchText, setSearchText] = useState("");
  const [modalClientOpen, setModalClientOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function handleEditClick(user: any) {
    setEditingUser(user);
    setNewName(user.name);
    setNewPassword(""); // A senha sempre começa vazia por segurança
    setShowEditModal(true);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.put("/users", {
        id: editingUser.id,
        name: newName,
        password: newPassword,
      });

      // Fecha o modal de edição e recarrega a lista
      setShowEditModal(false);
      handleOpenUsersModal();
      alert("Usuário atualizado com sucesso!");
    } catch (error) {
      console.log(error);
      alert("Erro ao atualizar usuário.");
    }
  }

  async function handleOpenUsersModal() {
    const response = await api.get("/users");
    setUsers(response.data);
    setShowUsersModal(true);
  }

  async function loadTickets() {
    if (!user) return;
    const response = await api.get("/tickets");
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
    if (ticket.status === "ENCERRADO" && ticket.ended_at) {
      const duration = formatDistance(
        new Date(ticket.ended_at),
        new Date(ticket.created_at),
        { locale: ptBR },
      );
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

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );

  // FILTRAMOS A LISTA GERAL (Baseado no que foi digitado)
  const filteredTickets = tickets.filter((ticket) => {
    // Se a busca estiver vazia, retorna o chamado normal
    if (searchText === "") return true;

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
  const openTickets = filteredTickets.filter((t) => t.status === "ABERTO");
  const progressTickets = filteredTickets.filter(
    (t) => t.status === "EM ANDAMENTO",
  );
  const closedTickets = filteredTickets.filter((t) => t.status === "ENCERRADO");

  // Componente de Card (Para não repetir código nas colunas)
  const TicketCard = ({ ticket }: { ticket: TicketProps }) => (
    <div
      onClick={() => handleOpenModalDetail(ticket)}
      className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer border border-gray-100 transition-all mb-3 relative overflow-hidden group"
    >
      {/* Borda colorida lateral baseada no status */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          ticket.status === "ABERTO"
            ? "bg-green-500"
            : ticket.status === "EM ANDAMENTO"
              ? "bg-blue-500"
              : "bg-gray-400"
        }`}
      ></div>

      <div className="pl-3">
        <div className="flex justify-between items-start mb-2">
          <span className="font-bold text-gray-800 text-sm truncate pr-2">
            #{ticket.id} - {ticket.title}
          </span>
        </div>

        {user.role === "TECH" && (
          <p className="text-xs text-gray-500 mb-2">
            Cliente:{" "}
            <span className="font-medium text-gray-700">
              {ticket.customer?.name}
            </span>
          </p>
        )}

        {ticket.technician && (
          <p className="text-xs text-gray-500 mb-1">
            Atendido por:{" "}
            <span className="font-medium text-blue-600">
              {ticket.technician.name}
            </span>
          </p>
        )}

        <div className="mt-2 mb-1">
          <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
            ⏳ {calculateDuration(ticket)}
          </span>
        </div>

        <div className="text-[10px] text-gray-400 flex flex-col gap-0.5 mt-3 border-t pt-2 border-gray-50">
          <span>📅 Criado: {formatDate(ticket.created_at)}</span>
          {ticket.started_at && (
            <span className="text-blue-600">
              🚀 Iniciado: {formatDate(ticket.started_at)}
            </span>
          )}
          {ticket.ended_at && (
            <span className="text-green-600">
              🏁 Finalizado: {formatDate(ticket.ended_at)}
            </span>
          )}
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
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Nex<span className="text-blue-600">Support</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">
                {user.role === "TECH" ? "Técnico" : "Cliente"}
              </p>
            </div>

            <button
              onClick={handleOpenUsersModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-2"
            >
              <FiUsers size={20} color="#FFF" />
              Ver Usuários
            </button>

            <Button
              onClick={signOut}
              style={{
                backgroundColor: "#ef4444",
                height: "36px",
                padding: "0 16px",
              }}
            >
              Sair
            </Button>
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
          {user.role !== "TECH" && (
            <button
              onClick={() => setModalNewTicketOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 ml-4"
            >
              + Novo
            </button>
          )}

          {user.role === "TECH" && (
            <button
              onClick={() => setModalClientOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full shadow transition-transform hover:scale-105 flex items-center gap-2"
            >
              + Cliente
            </button>
          )}
        </div>

        {/* --- ÁREA DE MÉTRICAS (SÓ PARA TÉCNICOS) --- */}
        {user.role === "TECH" && <MetricsDashboard />}
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
              {openTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
              {openTickets.length === 0 && (
                <p className="text-center text-gray-400 text-xs py-10">
                  Nada por aqui
                </p>
              )}
            </div>
          </div>

          {/* COLUNA 2: EM ANDAMENTO */}
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Em Andamento ({progressTickets.length})
            </h2>
            <div className="bg-gray-50/50 rounded-xl p-2 min-h-[200px]">
              {progressTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
              {progressTickets.length === 0 && (
                <p className="text-center text-gray-400 text-xs py-10">
                  Nenhum atendimento
                </p>
              )}
            </div>
          </div>

          {/* COLUNA 3: FINALIZADO */}
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              Finalizados ({closedTickets.length})
            </h2>
            <div className="bg-gray-50/50 rounded-xl p-2 min-h-[200px]">
              {closedTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
              {closedTickets.length === 0 && (
                <p className="text-center text-gray-400 text-xs py-10">
                  Histórico vazio
                </p>
              )}
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

      {/* MODAL DE USUÁRIOS */}
      {showUsersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-2xl p-6 rounded-lg shadow-lg relative">
            {/* Botão de Fechar */}
            <button
              onClick={() => setShowUsersModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <FiX size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Usuários Cadastrados
            </h2>

            <div className="overflow-y-auto max-h-[60vh]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-3 text-gray-700">Nome</th>
                    <th className="p-3 text-gray-700">Email</th>
                    <th className="p-3 text-gray-700">Tipo</th>
                    <th className="p-3 text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-800">{user.name}</td>
                      <td className="p-3 text-gray-600">{user.email}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            user.role === "TECH"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.role === "TECH" ? "Técnico" : "Cliente"}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Editar Usuário"
                        >
                          <FiEdit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}



      {/* MODAL DE EDIÇÃO DE USUÁRIO */}
      {showEditModal && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
    <div className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-lg relative">
      <button 
        onClick={() => setShowEditModal(false)} 
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
      >
        <FiX size={24} />
      </button>

      <h2 className="text-xl font-bold mb-4">Editar Usuário</h2>
      <p className="text-sm text-gray-500 mb-4">Editando: {editingUser?.email}</p>

      <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input 
            type="text" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nova Senha <span className="text-xs text-gray-400">(Deixe em branco para manter a atual)</span>
          </label>
          <input 
            type="password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button 
          type="submit" 
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  </div>
      )}
    </div>

    
  );
}

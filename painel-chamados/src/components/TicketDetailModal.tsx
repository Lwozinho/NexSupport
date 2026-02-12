import { Modal } from './Modal';
import { Button } from './Button';
import { api } from '../services/api';

interface TicketProps {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  attachment?: string | null;
  customer?: {
    name: string;
  }
}

interface TicketDetailModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  ticket?: TicketProps;
  onUpdate: () => void;
  user_id: string;
  user_role: string; // <--- 1. Recebemos o cargo aqui
}

// 2. Adicionamos user_role na função 👇
export function TicketDetailModal({ isOpen, onRequestClose, ticket, onUpdate, user_id, user_role }: TicketDetailModalProps) {
  
  async function handleUpdateStatus(status: string) {
    if (!ticket) return;

    try {
      await api.put('/tickets/update', {
        ticket_id: ticket.id,
        status: status,
        technician_id: user_id
      });

      alert("Status atualizado!");
      onUpdate();
      onRequestClose();

    } catch (err) {
      console.log(err);
      alert("Erro ao atualizar status.");
    }
  }

  if (!ticket) return null;

  // Lógica simples: É técnico?
  const isTech = user_role === 'TECH';

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="flex justify-between items-center mb-4 border-b pb-4">
        <h2 className="text-xl font-bold text-gray-700">Chamado #{ticket.id}</h2>
        <span className={`px-2 py-1 rounded text-xs font-bold ${ticket.status === 'ABERTO' ? 'bg-green-100 text-green-700' : ticket.status === 'EM ANDAMENTO' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
          {ticket.status}
        </span>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        <div>
          <p className="text-sm text-gray-500 font-bold uppercase">Cliente</p>
          <p className="text-gray-800">{ticket.customer?.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 font-bold uppercase">Assunto</p>
          <p className="text-gray-800 font-medium">{ticket.title}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 font-bold uppercase mb-1">Descrição</p>
          <div className="bg-gray-50 p-3 rounded border border-gray-200 text-gray-700 whitespace-pre-wrap">
            {ticket.description}
          </div>
        </div>

        {ticket.attachment && (
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase mb-2">Anexo</p>
            <a 
              href={`http://localhost:3333/files/${ticket.attachment}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block border rounded hover:opacity-90"
            >
              <img 
                src={`http://localhost:3333/files/${ticket.attachment}`} 
                alt="Anexo" 
                className="w-full max-h-60 object-contain"
              />
            </a>
          </div>
        )}
      </div>

      {/* --- ÁREA DE BOTÕES --- */}
      <div className="mt-6 flex justify-end gap-2 border-t pt-4">
        
        {/* Botão Fechar (Todo mundo vê) */}
        <Button 
          style={{ backgroundColor: '#9ca3af', width: 'auto', padding: '0 20px' }} 
          onClick={onRequestClose}
        >
          Fechar
        </Button>

        {/* Botões de Ação (SÓ O TÉCNICO VÊ) */}
        {isTech && ticket.status === 'ABERTO' && (
          <Button 
            style={{ backgroundColor: '#2563eb', width: 'auto' }} 
            onClick={() => handleUpdateStatus('EM ANDAMENTO')}
          >
            Atender Chamado
          </Button>
        )}

        {isTech && ticket.status === 'EM ANDAMENTO' && (
          <Button 
            style={{ backgroundColor: '#16a34a', width: 'auto' }} 
            onClick={() => handleUpdateStatus('ENCERRADO')}
          >
            Finalizar Chamado
          </Button>
        )}
      </div>

    </Modal>
  );
}
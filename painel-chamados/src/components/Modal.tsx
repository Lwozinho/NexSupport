import ReactModal from 'react-modal';
import { X } from 'lucide-react'; // Ícone de fechar

// Configuração para acessibilidade (diz qual é o elemento raiz)
ReactModal.setAppElement('#root');

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

// Estilos customizados para centralizar o modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#F0F0F5',
    color: '#000000',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '600px',
    border: 'none',
    padding: '30px'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  }
};

export function Modal({ isOpen, onRequestClose, children }: ModalProps) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      <button
        type="button"
        onClick={onRequestClose}
        className="react-modal-close"
        style={{ background: 'transparent', border: 0, position: 'absolute', right: '20px', top: '20px', cursor: 'pointer' }}
      >
        <X size={24} color="#f34343" />
      </button>

      {children}
    </ReactModal>
  );
}
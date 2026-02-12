import { useState } from 'react';
import type {FormEvent, ChangeEvent } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { api } from '../services/api';

interface NewTicketModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  userId: string;
  onSuccess: () => void;
}

export function NewTicketModal({ isOpen, onRequestClose, userId, onSuccess }: NewTicketModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null); // Estado para a imagem

  // Função para capturar o arquivo quando o usuário escolhe
  function handleFile(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files && e.target.files[0]){
      setImage(e.target.files[0]);
    }
  }

  async function handleRegisterTicket(event: FormEvent) {
    event.preventDefault();

    if (title === '' || description === '') {
      alert("Título e Descrição são obrigatórios!");
      return;
    }

    try {
      const data = new FormData(); // Cria um formulário multipart
      data.append('title', title);
      data.append('description', description);
      data.append('user_id', userId);
      
      if(image){
        data.append('file', image); // Anexa a imagem se existir
      }

      await api.post('/tickets', data);

      alert("Chamado aberto com sucesso!");
      
      // Limpa tudo
      setTitle('');
      setDescription('');
      setImage(null);
      
      onSuccess();
      onRequestClose();

    } catch (err) {
      console.log(err);
      alert("Erro ao cadastrar chamado.");
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2 className="text-xl font-bold mb-4 text-gray-700">Abrir Novo Chamado</h2>
      <form onSubmit={handleRegisterTicket}>
        
        <label className="text-sm font-bold text-gray-600 mb-1 block">Título</label>
        <Input 
          placeholder="Ex: Computador lento"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <label className="text-sm font-bold text-gray-600 mb-1 block mt-4">Descrição</label>
        <textarea 
          className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          placeholder="Descreva o problema em detalhes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* INPUT DE ARQUIVO */}
        <label className="block mt-4 mb-6 cursor-pointer bg-gray-50 border border-dashed border-gray-400 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            📎 {image ? image.name : "Clique para anexar um print (Opcional)"}
          </span>
          <input 
            type="file" 
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFile}
            className="hidden" // Esconde o input feio padrão
          />
        </label>

        <Button type="submit">Cadastrar Chamado</Button>
      </form>
    </Modal>
  );
}
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { api } from '../services/api';

interface NewClientModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export function NewClientModal({ isOpen, onRequestClose }: NewClientModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegisterClient(event: FormEvent) {
    event.preventDefault();

    if (name === '' || email === '' || password === '') {
      alert("Preencha todos os campos");
      return;
    }

    try {
      // Chama a rota específica que criamos
      await api.post('/users/client', {
        name,
        email,
        password
      });

      alert("Cliente cadastrado com sucesso!");

      setName('');
      setEmail('');
      setPassword('');
      onRequestClose();

    } catch (err) {
      console.log(err);
      alert("Erro ao cadastrar. Verifique se o email já existe.");
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2 className="text-xl font-bold mb-4 text-gray-700">Novo Cliente</h2>
      
      <form onSubmit={handleRegisterClient} className="flex flex-col gap-4">
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-600">Nome do Cliente</label>
          <Input 
            placeholder="Ex: Empresa X"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-600">Email de Acesso</label>
          <Input 
            type="email"
            placeholder="cliente@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-600">Senha</label>
          <Input 
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <Button type="submit">Cadastrar Cliente</Button>
        </div>

      </form>
    </Modal>
  );
}
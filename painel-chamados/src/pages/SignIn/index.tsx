import type {FormEvent} from 'react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AuthContext } from '../../contexts/AuthContext';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado para controlar o botão

  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext); // Pegamos a função do contexto

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      setLoading(true); // Trava o botão
      
      // Chama a função que criamos no Contexto
      await signIn({email, password});

      // Se passou, navega para o painel
      navigate('/dashboard');
      
    } catch (error:any) {
      if (error.response && error.response.data && error.response.data.error) {
       alert(error.response.data.error);
    } else {
       // Se for um erro de conexão ou outro problema genérico
       alert("Erro ao acessar");
    }
    } finally {
      setLoading(false); // Destrava o botão
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 px-4">
      <div className="w-screen max-w-md bg-white p-8 rounded-lg shadow-lg">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">NexSupport</h1>
          <p className="text-gray-500 mt-2">Acesse sua conta</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input 
            label="E-mail"
            placeholder="Digite seu e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input 
            label="Senha"
            placeholder="********"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" loading={loading}>
            Acessar
          </Button>
        </form>

      </div>
    </div>
  );
}
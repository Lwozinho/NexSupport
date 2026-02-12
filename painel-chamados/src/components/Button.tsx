import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
}

export function Button({ children, loading, ...props }: ButtonProps) {
  return (
    <button
      disabled={loading}
      className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
}
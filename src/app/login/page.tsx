'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRouter as useAppRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { LogoHorizontal } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { setCurrentUser, getChurchUsers } from '@/lib/store';

export default function LoginPage() {
  const router = useAppRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Procurar usuário cadastrado no sistema
      const users = getChurchUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (user) {
        setCurrentUser(user);
      } else {
        // Criar ou logar perfil padrão admin
        setCurrentUser({
          id: 'user-admin-1',
          church_id: 'church-1',
          full_name: email.split('@')[0] || 'Administrador',
          email: email || 'admin@igreja.org.br',
          phone: '(11) 99999-8888',
          role: 'admin',
          status: 'active',
          created_at: new Date().toISOString()
        });
      }

      setLoading(false);
      router.push('/');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-jornada-ivory flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <LogoHorizontal size="lg" showSubtitle={true} />
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-jornada-border/80 shadow-md">
          <div className="mb-6">
            <h2 className="font-heading font-bold text-xl text-jornada-navy tracking-tight">
              Acessar o Painel
            </h2>
            <p className="font-body text-xs text-jornada-muted mt-1">
              Informe suas credenciais para gerenciar as excursões da sua igreja.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-jornada-red/10 border border-jornada-red/20 text-jornada-red text-xs font-body font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="E-mail profissional ou da igreja"
              type="email"
              placeholder="seuemail@igreja.org.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-jornada-border text-jornada-navy focus:ring-jornada-navy"
                />
                <span className="font-body text-xs text-jornada-navy">Permanecer conectado</span>
              </label>

              <Link
                href="/recuperar-senha"
                className="font-heading text-xs font-semibold text-jornada-terracotta hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Entrar no Sistema
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-jornada-border/60 text-center">
            <p className="font-body text-xs text-jornada-muted">
              Sua igreja ainda não utiliza o JORNADA?{' '}
              <Link href="/cadastro" className="font-heading font-semibold text-jornada-terracotta hover:underline">
                Criar uma conta
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-jornada-muted text-[11px] font-body">
          <ShieldCheck className="w-3.5 h-3.5 text-jornada-green" />
          <span>Ambiente administrativo seguro • Multi-igreja isolado</span>
        </div>
      </div>
    </div>
  );
}

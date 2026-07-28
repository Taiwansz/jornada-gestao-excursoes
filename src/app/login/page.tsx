'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LogoHorizontal } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { setCurrentUser, getChurchUsers, saveChurchUser } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Procurar se já existe um usuário com este email
      const users = getChurchUsers();
      let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        // Se não existir, registrar automaticamente o perfil de admin
        user = saveChurchUser({
          church_id: 'church-1',
          full_name: email.split('@')[0] ? email.split('@')[0].replace('.', ' ') : 'Administrador',
          email: email || 'admin@igreja.org.br',
          phone: '(11) 99999-8888',
          role: 'admin',
          status: 'active'
        });
      }

      // Definir como usuário ativo na sessão
      setCurrentUser(user);

      setSuccessMsg('Login realizado com sucesso! Redirecionando...');
      
      setTimeout(() => {
        setLoading(false);
        router.push('/dashboard');
      }, 500);
    }, 400);
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

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-jornada-green/10 border border-jornada-green/20 text-jornada-green text-xs font-body font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
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

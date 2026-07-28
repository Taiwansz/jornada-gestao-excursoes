'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Church as ChurchIcon, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { LogoHorizontal } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateChurchConfig, saveChurchUser, setCurrentUser } from '@/lib/store';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [churchName, setChurchName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // 1. Atualizar ou cadastrar a igreja principal
      updateChurchConfig({
        name: churchName,
        phone: phone,
        main_responsible: fullName
      });

      // 2. Cadastrar o usuário administrador
      const user = saveChurchUser({
        church_id: 'church-1',
        full_name: fullName,
        email: email,
        phone: phone,
        role: 'admin',
        status: 'active'
      });

      setCurrentUser(user);
      setLoading(false);

      // Redirecionar para o dashboard principal
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
              Criar Conta da Igreja
            </h2>
            <p className="font-body text-xs text-jornada-muted mt-1">
              Cadastre sua organização e comece a gerenciar suas excursões de forma organizada.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Nome completo do responsável"
              placeholder="Ex: Pr. Carlos Eduardo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="E-mail principal"
              type="email"
              placeholder="contato@igreja.org.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Telefone / WhatsApp para contato"
              placeholder="(11) 98765-4321"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />

            <Input
              label="Nome da igreja ou congregação"
              placeholder="Ex: Igreja Evangélica Central - Sede"
              value={churchName}
              onChange={(e) => setChurchName(e.target.value)}
              leftIcon={<ChurchIcon className="w-4 h-4" />}
              required
            />

            <Input
              label="Senha de acesso"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full mt-3"
              isLoading={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Concluir Cadastro e Acessar
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-jornada-border/60 text-center">
            <p className="font-body text-xs text-jornada-muted">
              Já possui uma conta cadastrada?{' '}
              <Link href="/login" className="font-heading font-semibold text-jornada-navy hover:underline">
                Acessar conta
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-jornada-muted text-[11px] font-body">
          Ao cadastrar, você confirma que possui autorização para gerenciar a igreja informada.
        </div>
      </div>
    </div>
  );
}

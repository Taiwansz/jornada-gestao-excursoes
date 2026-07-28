'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { LogoHorizontal } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
              Recuperar Senha
            </h2>
            <p className="font-body text-xs text-jornada-muted mt-1">
              Informe seu e-mail cadastrado para receber as instruções de redefinição de acesso.
            </p>
          </div>

          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-jornada-green/10 text-jornada-green flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-jornada-navy">
                Instruções Enviadas!
              </h3>
              <p className="font-body text-xs text-jornada-muted leading-relaxed max-w-xs mx-auto">
                Se o e-mail <strong className="text-jornada-navy">{email}</strong> estiver cadastrado em nosso sistema, você receberá o link para redefinir sua senha em instantes.
              </p>
              <Link href="/login" className="inline-block mt-4">
                <Button variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
                  Voltar para o Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="E-mail cadastrado"
                type="email"
                placeholder="seuemail@igreja.org.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
                Enviar Instruções de Recuperação
              </Button>

              <div className="pt-4 text-center">
                <Link href="/login" className="font-heading text-xs font-semibold text-jornada-navy hover:underline inline-flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar para a tela de login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

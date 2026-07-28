'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  QrCode,
  ArrowRight
} from 'lucide-react';

import { LogoHorizontal, ChurchBrandHeader } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

import { getExcursionByPublicCode, getInitialChurch, savePassenger } from '@/lib/store';
import { Excursion, Church } from '@/types';

export default function PublicRegistrationPage() {
  const params = useParams();
  const code = params?.code as string;

  const [excursion, setExcursion] = useState<Excursion | null>(null);
  const [church, setChurch] = useState<Church | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [pickup, setPickup] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [isMinor, setIsMinor] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');

  const [submittedToken, setSubmittedToken] = useState<string | null>(null);

  useEffect(() => {
    const c = getInitialChurch();
    setChurch(c);
    if (code) {
      const exc = getExcursionByPublicCode(code);
      if (exc) {
        setExcursion(exc);
        setPickup(exc.main_pickup_location);
      }
    }
  }, [code]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excursion) return;

    const pass = savePassenger({
      excursion_id: excursion.id,
      full_name: fullName,
      phone,
      email,
      document_number: docNumber,
      pickup_location: pickup || excursion.main_pickup_location,
      emergency_contact_name: emergencyName || 'Mesmo do passageiro',
      emergency_contact_phone: emergencyPhone || phone,
      is_minor: isMinor,
      guardian_name: guardianName,
      guardian_phone: guardianPhone,
      guardian_authorized: isMinor ? true : false,
      status: excursion.requires_manual_approval ? 'aguardando_confirmacao' : 'confirmado',
      financial_status: 'nao_pago',
      presence_checked_in: false
    });

    setSubmittedToken(pass.lookup_token);
  };

  if (!excursion) {
    return (
      <div className="min-h-screen bg-jornada-ivory flex flex-col justify-center items-center p-4">
        <Card className="max-w-md w-full text-center p-8 space-y-4">
          <LogoHorizontal size="md" className="justify-center mb-2" />
          <h2 className="font-heading font-bold text-lg text-jornada-navy">Excursão não encontrada</h2>
          <p className="font-body text-xs text-jornada-muted">
            Verifique o código ou solicite o link atualizado ao organizador da sua igreja.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jornada-ivory py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Logo & Header */}
        <div className="flex justify-center">
          <LogoHorizontal size="lg" />
        </div>

        {submittedToken ? (
          /* TELA DE SUCESSO APÓS INSCRIÇÃO */
          <Card className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-jornada-green/10 text-jornada-green rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-extrabold text-2xl text-jornada-navy">Inscrição Realizada!</h2>
              <p className="font-body text-sm text-jornada-muted max-w-md mx-auto">
                Sua solicitação para a excursão <strong>{excursion.name}</strong> foi recebida com sucesso.
              </p>
            </div>

            {/* Token de Acompanhamento Individual */}
            <div className="p-4 bg-jornada-ivory rounded-xl border border-jornada-border space-y-2 max-w-sm mx-auto">
              <span className="font-heading text-xs text-jornada-muted block">Seu Código Individual de Acompanhamento</span>
              <span className="font-heading font-extrabold text-xl text-jornada-navy block select-all">{submittedToken}</span>
              <a 
                href={`/consulta/${submittedToken}`}
                className="inline-flex items-center gap-1.5 font-heading text-xs font-bold text-jornada-terracotta hover:underline pt-2"
              >
                <span>Acompanhar Pagamento e Status</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </Card>
        ) : (
          /* FORMULÁRIO PÚBLICO DE INSCRIÇÃO */
          <Card className="p-6 sm:p-8 space-y-6">
            <ChurchBrandHeader churchName={church?.name} churchLogo={church?.logo_url} />

            <div className="border-b border-jornada-border pb-4 space-y-1">
              <h1 className="font-heading font-extrabold text-2xl text-jornada-navy tracking-tight">
                {excursion.name}
              </h1>
              <p className="font-body text-xs text-jornada-muted flex flex-wrap items-center gap-3 pt-1">
                <span>Destino: <strong className="text-jornada-navy">{excursion.destination}</strong></span>
                <span>•</span>
                <span>Data: <strong className="text-jornada-navy">{new Date(excursion.travel_date).toLocaleDateString('pt-BR')}</strong></span>
                <span>•</span>
                <span>Valor: <strong className="text-jornada-green font-heading text-sm">R$ {excursion.price_per_passenger.toFixed(2)}</strong></span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome Completo do Passageiro"
                placeholder="Informe seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Telefone / WhatsApp"
                  placeholder="(11) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                <Input
                  label="E-mail (opcional)"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="CPF ou RG"
                  placeholder="000.000.000-00"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                />

                <Input
                  label="Ponto de Embarque Desejado"
                  placeholder="Ex: Frente da Igreja Sede"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Contato de Emergência (Nome)"
                  placeholder="Ex: Maria (Esposa/Mãe)"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  required
                />

                <Input
                  label="Telefone de Emergência"
                  placeholder="(11) 99999-8888"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  required
                />
              </div>

              {/* Opção para Menores */}
              <div className="p-3 bg-jornada-ivory/60 rounded-xl border border-jornada-border/60">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMinor}
                    onChange={(e) => setIsMinor(e.target.checked)}
                    className="rounded text-jornada-navy focus:ring-jornada-navy"
                  />
                  <span className="font-heading text-xs font-semibold text-jornada-navy">
                    O passageiro é menor de 18 anos?
                  </span>
                </label>

                {isMinor && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-jornada-border/60">
                    <Input
                      label="Nome do Responsável Legal"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      required={isMinor}
                    />
                    <Input
                      label="Telefone do Responsável Legal"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      required={isMinor}
                    />
                  </div>
                )}
              </div>

              <Button type="submit" variant="accent" size="lg" className="w-full mt-2">
                Enviar Solicitação de Inscrição
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}

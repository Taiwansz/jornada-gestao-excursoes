'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Building, QrCode, Shield, CheckCircle2, Upload } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getInitialChurch, updateChurchConfig } from '@/lib/store';
import { Church } from '@/types';

export default function ChurchSettingsPage() {
  const [church, setChurch] = useState<Church | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [mainResponsible, setMainResponsible] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [pixFavored, setPixFavored] = useState('');
  const [pixBank, setPixBank] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState('');

  useEffect(() => {
    const c = getInitialChurch();
    setChurch(c);
    setName(c.name || '');
    setAddress(c.address || '');
    setPhone(c.phone || '');
    setMainResponsible(c.main_responsible || '');
    setPixKey(c.pix_key || '');
    setPixFavored(c.pix_favored || '');
    setPixBank(c.pix_bank || '');
    setCancellationPolicy(c.cancellation_policy || '');
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateChurchConfig({
      name,
      address,
      phone,
      main_responsible: mainResponsible,
      pix_key: pixKey,
      pix_favored: pixFavored,
      pix_bank: pixBank,
      cancellation_policy: cancellationPolicy
    });

    setChurch(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-jornada-border/80 shadow-xs">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-jornada-navy tracking-tight">
            Configurações da Igreja
          </h1>
          <p className="font-body text-xs text-jornada-muted mt-0.5">
            Personalize a identidade da sua organização, chave Pix para arrecadações e dados para os recibos.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-jornada-green/10 text-jornada-green text-xs font-heading font-bold">
            <CheckCircle2 className="w-4 h-4" /> Alterações salvas com sucesso!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card title="Dados da Organização" subtitle="Estas informações aparecerão no topo dos recibos e relatórios.">
          <div className="space-y-4">
            <Input
              label="Nome Oficial da Igreja ou Congregação"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Endereço Principal / Sede"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <Input
                label="Telefone / WhatsApp Principal"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <Input
              label="Responsável Geral pelas Excursões"
              value={mainResponsible}
              onChange={(e) => setMainResponsible(e.target.value)}
            />
          </div>
        </Card>

        <Card title="Dados Bancários para Recebimento Pix" subtitle="Instruções padrão enviadas aos passageiros nas inscrições.">
          <div className="space-y-4">
            <Input
              label="Chave Pix Oficial"
              placeholder="CNPJ, E-mail, Celular ou Chave Aleatória"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Favorecido / Titular da Conta"
                placeholder="Ex: Igreja Evangélica Central"
                value={pixFavored}
                onChange={(e) => setPixFavored(e.target.value)}
              />

              <Input
                label="Instituição Bancária"
                placeholder="Ex: Banco Bradesco / Itaú"
                value={pixBank}
                onChange={(e) => setPixBank(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card title="Políticas Padrão da Igreja">
          <div className="space-y-4">
            <Input
              label="Política Padrão de Cancelamento e Reembolso"
              placeholder="Ex: Cancelamentos até 7 dias antes da viagem possuem 100% de devolução..."
              value={cancellationPolicy}
              onChange={(e) => setCancellationPolicy(e.target.value)}
            />
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="accent" size="lg">
            Salvar Configurações
          </Button>
        </div>
      </form>
    </div>
  );
}

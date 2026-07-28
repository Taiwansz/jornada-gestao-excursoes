'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Users, 
  DollarSign, 
  FileCheck, 
  PlusCircle, 
  UserPlus, 
  CreditCard, 
  QrCode, 
  CheckSquare, 
  Share2, 
  AlertTriangle, 
  Clock, 
  Bus, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  FileText,
  Building
} from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

import { 
  getExcursions, 
  getPassengers, 
  getPayments, 
  getReceipts, 
  getExpenses, 
  getVehicles, 
  getInitialChurch,
  saveExcursion
} from '@/lib/store';

import { Excursion, Passenger, Payment, PaymentReceipt, Church } from '@/types';

export default function DashboardPage() {
  const [church, setChurch] = useState<Church | null>(null);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);

  // Modals de Ação Rápida
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newExcursionName, setNewExcursionName] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newTravelDate, setNewTravelDate] = useState('');
  const [newTotalSeats, setNewTotalSeats] = useState(44);
  const [newPrice, setNewPrice] = useState(150);
  const [newLeaderName, setNewLeaderName] = useState('');
  const [newLeaderPhone, setNewLeaderPhone] = useState('');
  const [newPickup, setNewPickup] = useState('Frente da Igreja Sede');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setChurch(getInitialChurch());
    setExcursions(getExcursions());
    setPassengers(getPassengers());
    setPayments(getPayments());
    setReceipts(getReceipts());
  };

  const handleCreateExcursion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExcursionName || !newDestination || !newTravelDate) return;

    saveExcursion({
      name: newExcursionName,
      destination: newDestination,
      travel_date: newTravelDate,
      total_seats: Number(newTotalSeats),
      price_per_passenger: Number(newPrice),
      leader_name: newLeaderName || church?.main_responsible || 'Organizador',
      leader_phone: newLeaderPhone || church?.phone || '',
      main_pickup_location: newPickup,
      additional_pickups: [],
      transport_type: 'Ônibus Executivo',
      status: 'open',
      requires_manual_approval: true
    });

    setShowCreateModal(false);
    setNewExcursionName('');
    setNewDestination('');
    loadData();
  };

  // Cálculos das Métricas do Painel
  const activeExcursions = excursions.filter(e => e.status === 'open' || e.status === 'full');
  const totalConfirmedPassengers = passengers.filter(p => p.status === 'confirmado' || p.status === 'vaga_reservada');
  
  const totalCapacity = excursions.reduce((sum, e) => sum + e.total_seats, 0);
  const totalOccupied = passengers.filter(p => p.status !== 'cancelado').length;
  const availableSeats = Math.max(0, totalCapacity - totalOccupied);

  const pendingPaymentPassengers = passengers.filter(p => p.financial_status === 'nao_pago' || p.financial_status === 'atrasado' || p.financial_status === 'parcialmente_pago');

  const totalProjected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalReceived = payments.filter(p => p.status === 'pago').reduce((sum, p) => sum + p.amount, 0);
  const totalRemaining = Math.max(0, totalProjected - totalReceived);

  // Análise "O que precisa de atenção"
  const unpaidPassengers = passengers.filter(p => p.financial_status === 'nao_pago');
  const latePayments = payments.filter(p => p.status === 'atrasado');
  const pendingReceipts = receipts.filter(r => r.review_status === 'pending');
  const minorsWithoutAuth = passengers.filter(p => p.is_minor && !p.guardian_authorized);
  const excursionsLowSeats = excursions.filter(e => {
    const excPass = passengers.filter(p => p.excursion_id === e.id && p.status !== 'cancelado');
    return e.total_seats - excPass.length <= 5 && e.total_seats - excPass.length > 0;
  });

  return (
    <div className="space-y-8">
      {/* Top Header / Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-jornada-border/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-heading font-bold text-xs uppercase text-jornada-terracotta tracking-wider">
              Painel Geral de Controle
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-jornada-green" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-jornada-navy tracking-tight">
            {church?.name || 'Gestão de Excursões'}
          </h1>
          <p className="font-body text-xs text-jornada-muted mt-0.5">
            Acompanhamento de vagas, confirmações de passageiros, pagamentos e comprovantes em tempo real.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button 
            variant="accent" 
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            Criar Excursão
          </Button>
          <Link href="/excursoes">
            <Button variant="secondary" icon={<Compass className="w-4 h-4" />}>
              Ver Excursões
            </Button>
          </Link>
        </div>
      </div>

      {/* Se não houver excursões cadastradas: Estado Vazio Guiado */}
      {excursions.length === 0 ? (
        <EmptyState
          icon={<Compass className="w-8 h-8 text-jornada-terracotta" />}
          title="Nenhuma excursão cadastrada ainda"
          description="Sua igreja está pronta para organizar a primeira viagem! Cadastre sua primeira excursão de ônibus, micro-ônibus ou van para começar a receber inscrições e controlar o financeiro."
          actionLabel="Cadastrar Primeira Excursão"
          onAction={() => setShowCreateModal(true)}
          secondaryActionLabel="Configurar Dados da Igreja"
          onSecondaryAction={() => window.location.href = '/configuracoes'}
          className="my-8"
        />
      ) : (
        <>
          {/* Grid de Indicadores Principais (Métricas Sem Gráficos Fúteis) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Próximas Excursões & Vagas */}
            <Card padding="sm" className="border-l-4 border-l-jornada-navy">
              <div className="flex items-center justify-between text-jornada-muted mb-2">
                <span className="font-heading font-semibold text-xs text-jornada-navy">Excursões Ativas</span>
                <Compass className="w-4 h-4 text-jornada-navy" />
              </div>
              <div className="font-heading font-extrabold text-2xl text-jornada-navy">
                {activeExcursions.length}
              </div>
              <div className="mt-2 text-xs font-body text-jornada-muted flex items-center justify-between border-t border-jornada-border/40 pt-2">
                <span>Vagas disponíveis:</span>
                <span className="font-heading font-bold text-jornada-green">{availableSeats} vagas</span>
              </div>
            </Card>

            {/* Card 2: Passageiros Confirmados */}
            <Card padding="sm" className="border-l-4 border-l-jornada-green">
              <div className="flex items-center justify-between text-jornada-muted mb-2">
                <span className="font-heading font-semibold text-xs text-jornada-navy">Passageiros Confirmados</span>
                <Users className="w-4 h-4 text-jornada-green" />
              </div>
              <div className="font-heading font-extrabold text-2xl text-jornada-navy">
                {totalConfirmedPassengers.length}
              </div>
              <div className="mt-2 text-xs font-body text-jornada-muted flex items-center justify-between border-t border-jornada-border/40 pt-2">
                <span>Pendentes de pagamento:</span>
                <span className="font-heading font-bold text-jornada-terracotta">{pendingPaymentPassengers.length} pessoas</span>
              </div>
            </Card>

            {/* Card 3: Valor Arrecadado */}
            <Card padding="sm" className="border-l-4 border-l-jornada-green">
              <div className="flex items-center justify-between text-jornada-muted mb-2">
                <span className="font-heading font-semibold text-xs text-jornada-navy">Valor Recebido</span>
                <DollarSign className="w-4 h-4 text-jornada-green" />
              </div>
              <div className="font-heading font-extrabold text-2xl text-jornada-green">
                R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              {/* Barra de Progresso Simples */}
              <div className="mt-2 space-y-1">
                <div className="w-full bg-jornada-ivory rounded-full h-1.5 overflow-hidden border border-jornada-border/60">
                  <div 
                    className="bg-jornada-green h-full rounded-full transition-all"
                    style={{ width: `${totalProjected > 0 ? Math.min(100, (totalReceived / totalProjected) * 100) : 0}%` }}
                  />
                </div>
                <div className="text-[11px] font-body text-jornada-muted flex justify-between">
                  <span>Previsto: R$ {totalProjected.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <span className="font-semibold text-jornada-navy">
                    {totalProjected > 0 ? Math.round((totalReceived / totalProjected) * 100) : 0}%
                  </span>
                </div>
              </div>
            </Card>

            {/* Card 4: Valor Restante a Receber */}
            <Card padding="sm" className="border-l-4 border-l-jornada-terracotta">
              <div className="flex items-center justify-between text-jornada-muted mb-2">
                <span className="font-heading font-semibold text-xs text-jornada-navy">Valor Pendente</span>
                <Clock className="w-4 h-4 text-jornada-terracotta" />
              </div>
              <div className="font-heading font-extrabold text-2xl text-jornada-terracotta">
                R$ {totalRemaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="mt-2 text-xs font-body text-jornada-muted flex items-center justify-between border-t border-jornada-border/40 pt-2">
                <span>Comprovantes p/ analisar:</span>
                <span className="font-heading font-bold text-jornada-terracotta">{pendingReceipts.length}</span>
              </div>
            </Card>
          </div>

          {/* Seção "O QUE PRECISA DE ATENÇÃO" */}
          <Card 
            title="O que precisa de atenção" 
            subtitle="Alertas de pendências operacionais, financeiras e documentais organizados por prioridade."
            headerAction={
              <span className="font-heading text-xs font-bold text-jornada-terracotta bg-jornada-terracotta/10 px-2.5 py-1 rounded-md border border-jornada-terracotta/20">
                {unpaidPassengers.length + latePayments.length + pendingReceipts.length + minorsWithoutAuth.length + excursionsLowSeats.length} alertas
              </span>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Alerta 1: Comprovantes para analisar */}
              <div className={`p-4 rounded-xl border transition-all ${pendingReceipts.length > 0 ? 'bg-[#FDF4E7] border-jornada-terracotta/40' : 'bg-jornada-ivory/40 border-jornada-border/60 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-bold text-xs text-jornada-navy flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-jornada-terracotta" />
                    Comprovantes em Análise
                  </span>
                  <span className="font-heading font-bold text-sm text-jornada-terracotta">
                    {pendingReceipts.length}
                  </span>
                </div>
                <p className="font-body text-xs text-jornada-muted mb-3">
                  {pendingReceipts.length > 0 ? 'Existem comprovantes de Pix/Transferência aguardando validação.' : 'Nenhum comprovante pendente.'}
                </p>
                {pendingReceipts.length > 0 && (
                  <Link href="/comprovantes">
                    <Button variant="accent" size="sm" className="w-full text-xs">
                      Analisar Comprovantes
                    </Button>
                  </Link>
                )}
              </div>

              {/* Alerta 2: Pagamentos Atrasados */}
              <div className={`p-4 rounded-xl border transition-all ${latePayments.length > 0 ? 'bg-[#FCEBEB] border-jornada-red/40' : 'bg-jornada-ivory/40 border-jornada-border/60 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-bold text-xs text-jornada-navy flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-jornada-red" />
                    Pagamentos Atrasados
                  </span>
                  <span className="font-heading font-bold text-sm text-jornada-red">
                    {latePayments.length}
                  </span>
                </div>
                <p className="font-body text-xs text-jornada-muted mb-3">
                  {latePayments.length > 0 ? 'Passageiros com data limite de pagamento vencida.' : 'Nenhum pagamento vencido no momento.'}
                </p>
                {latePayments.length > 0 && (
                  <Link href="/financeiro">
                    <Button variant="danger" size="sm" className="w-full text-xs">
                      Cobrar Pendências
                    </Button>
                  </Link>
                )}
              </div>

              {/* Alerta 3: Menores Sem Autorização */}
              <div className={`p-4 rounded-xl border transition-all ${minorsWithoutAuth.length > 0 ? 'bg-[#FDF4E7] border-jornada-terracotta/40' : 'bg-jornada-ivory/40 border-jornada-border/60 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-bold text-xs text-jornada-navy flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-jornada-terracotta" />
                    Menores s/ Autorização
                  </span>
                  <span className="font-heading font-bold text-sm text-jornada-terracotta">
                    {minorsWithoutAuth.length}
                  </span>
                </div>
                <p className="font-body text-xs text-jornada-muted mb-3">
                  {minorsWithoutAuth.length > 0 ? 'Menores de idade que ainda não anexaram a autorização dos pais.' : 'Todos os menores devidamente autorizados.'}
                </p>
                {minorsWithoutAuth.length > 0 && (
                  <Link href="/passageiros?menores=true">
                    <Button variant="secondary" size="sm" className="w-full text-xs">
                      Ver Lista de Menores
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>

          {/* Lista de Próximas Excursões */}
          <Card 
            title="Próximas Excursões" 
            subtitle="Lista das viagens ativas com acompanhamento de lotação e financeiro."
            headerAction={
              <Link href="/excursoes">
                <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                  Ver Todas
                </Button>
              </Link>
            }
          >
            <div className="space-y-4">
              {excursions.map(excursion => {
                const excPass = passengers.filter(p => p.excursion_id === excursion.id && p.status !== 'cancelado');
                const occupiedPercent = Math.round((excPass.length / excursion.total_seats) * 100);
                const excPays = payments.filter(p => p.excursion_id === excursion.id && p.status === 'pago');
                const totalExcPaid = excPays.reduce((sum, p) => sum + p.amount, 0);

                return (
                  <div key={excursion.id} className="p-4 rounded-xl border border-jornada-border/70 hover:border-jornada-navy/40 bg-white transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-base text-jornada-navy">
                            {excursion.name}
                          </h4>
                          <Badge status={excursion.status} />
                        </div>
                        <p className="font-body text-xs text-jornada-muted flex items-center gap-2">
                          <span>Destino: <strong>{excursion.destination}</strong></span>
                          <span>•</span>
                          <span>Data: <strong>{new Date(excursion.travel_date).toLocaleDateString('pt-BR')}</strong></span>
                          <span>•</span>
                          <span>Embarque: <strong>{excursion.main_pickup_location}</strong></span>
                        </p>
                      </div>

                      {/* Progresso de Vagas e Ação */}
                      <div className="flex items-center gap-6">
                        <div className="w-36">
                          <div className="flex justify-between text-xs font-heading font-semibold mb-1">
                            <span className="text-jornada-navy">{excPass.length}/{excursion.total_seats} vagas</span>
                            <span className="text-jornada-muted">{occupiedPercent}%</span>
                          </div>
                          <div className="w-full bg-jornada-ivory rounded-full h-2 border border-jornada-border/60 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${occupiedPercent >= 90 ? 'bg-jornada-terracotta' : 'bg-jornada-navy'}`} 
                              style={{ width: `${Math.min(100, occupiedPercent)}%` }} 
                            />
                          </div>
                        </div>

                        <Link href={`/excursoes/${excursion.id}`}>
                          <Button variant="secondary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                            Gerenciar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}

      {/* Modal de Criação Rápida de Excursão */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Criar Nova Excursão"
        subtitle="Informe os dados principais da viagem para liberar as inscrições."
      >
        <form onSubmit={handleCreateExcursion} className="space-y-4">
          <Input
            label="Nome da Excursão"
            placeholder="Ex: Retiro de Jovens 2026 / Viagem Águas de Lindoia"
            value={newExcursionName}
            onChange={(e) => setNewExcursionName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Destino / Cidade"
              placeholder="Ex: Monte Sião - MG"
              value={newDestination}
              onChange={(e) => setNewDestination(e.target.value)}
              required
            />
            <Input
              label="Data da Viagem"
              type="date"
              value={newTravelDate}
              onChange={(e) => setNewTravelDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Total de Vagas"
              type="number"
              value={newTotalSeats}
              onChange={(e) => setNewTotalSeats(Number(e.target.value))}
              required
            />
            <Input
              label="Valor por Passageiro (R$)"
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Local Principal de Embarque"
            placeholder="Ex: Frente da Igreja Sede - Av. Principal"
            value={newPickup}
            onChange={(e) => setNewPickup(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nome do Responsável"
              placeholder="Ex: Ir. Marcos"
              value={newLeaderName}
              onChange={(e) => setNewLeaderName(e.target.value)}
            />
            <Input
              label="Telefone do Responsável"
              placeholder="(11) 98888-7777"
              value={newLeaderPhone}
              onChange={(e) => setNewLeaderPhone(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-jornada-border">
            <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="accent">
              Criar Excursão
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

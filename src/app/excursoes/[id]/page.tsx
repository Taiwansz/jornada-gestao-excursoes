'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  Compass, 
  Users, 
  DollarSign, 
  Bus, 
  UserCheck, 
  MessageSquare, 
  FileText, 
  History, 
  Settings, 
  Share2, 
  ExternalLink, 
  PlusCircle, 
  Search, 
  Check, 
  X, 
  Upload, 
  Download, 
  Phone, 
  Calendar, 
  MapPin, 
  Clock, 
  AlertTriangle,
  QrCode,
  FileCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Printer,
  Trash2
} from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';

import { 
  getExcursionById, 
  getPassengers, 
  getPayments, 
  getReceipts, 
  getVehicles, 
  getExpenses, 
  getDocuments, 
  getAuditLogs, 
  savePassenger, 
  updatePassenger, 
  deletePassenger, 
  savePayment, 
  saveVehicle, 
  saveExpense, 
  saveDocument, 
  getInitialChurch, 
  updateExcursion,
  queueOfflineCheckin
} from '@/lib/store';

import { 
  Excursion, 
  Passenger, 
  Payment, 
  PaymentReceipt, 
  Vehicle, 
  Expense, 
  ExcursionDocument, 
  AuditLog, 
  PassengerStatus, 
  FinancialStatus 
} from '@/types';

export default function ExcursionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params?.id as string;

  const [excursion, setExcursion] = useState<Excursion | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [documents, setDocuments] = useState<ExcursionDocument[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Abas
  const tabParam = searchParams.get('tab') || 'visao_geral';
  const [activeTab, setActiveTab] = useState(tabParam);

  // Estados de seleção em lote para passageiros
  const [selectedPassengerIds, setSelectedPassengerIds] = useState<string[]>([]);
  const [passengerSearch, setPassengerSearch] = useState('');
  const [passengerStatusFilter, setPassengerStatusFilter] = useState('all');

  // Modais de Cadastro
  const [showAddPassengerModal, setShowAddPassengerModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);

  // Formulário do Passageiro
  const [pFullName, setPFullName] = useState('');
  const [pPhone, setPPhone] = useState('');
  const [pEmail, setPEmail] = useState('');
  const [pBirthDate, setPBirthDate] = useState('');
  const [pDocNumber, setPDocNumber] = useState('');
  const [pPickup, setPPickup] = useState('');
  const [pEmergencyName, setPEmergencyName] = useState('');
  const [pEmergencyPhone, setPEmergencyPhone] = useState('');
  const [pIsMinor, setPIsMinor] = useState(false);
  const [pGuardianName, setPGuardianName] = useState('');
  const [pGuardianPhone, setPGuardianPhone] = useState('');

  // Formulário de Pagamento
  const [payPassengerId, setPayPassengerId] = useState('');
  const [payAmount, setPayAmount] = useState(120);
  const [payMethod, setPayMethod] = useState('Pix');
  const [payStatus, setPayStatus] = useState<FinancialStatus>('pago');

  // Formulário de Veículo
  const [vIdent, setVIdent] = useState('Ônibus Executivo 01');
  const [vPlate, setVPlate] = useState('');
  const [vCapacity, setVCapacity] = useState(46);
  const [vDriver, setVDriver] = useState('');
  const [vDriverPhone, setVDriverPhone] = useState('');
  const [vCompany, setVCompany] = useState('');

  // Formulário de Despesa
  const [expCategory, setExpCategory] = useState('Aluguel do Veículo');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState(1500);

  // Mensagem Copiada
  const [copiedMsg, setCopiedMsg] = useState(false);

  useEffect(() => {
    if (id) loadAllData();
  }, [id]);

  const loadAllData = () => {
    const exc = getExcursionById(id);
    if (!exc) {
      router.push('/excursoes');
      return;
    }
    setExcursion(exc);
    setPPickup(exc.main_pickup_location);
    setPassengers(getPassengers(id));
    setPayments(getPayments(id));
    setReceipts(getReceipts(id));
    setVehicles(getVehicles(id));
    setExpenses(getExpenses(id));
    setDocuments(getDocuments(id));
    setAuditLogs(getAuditLogs().filter(l => l.target_id === id || l.details?.excursion_id === id));
  };

  if (!excursion) return null;

  // Cálculos Gerais
  const totalOccupied = passengers.filter(p => p.status !== 'cancelado').length;
  const availableSeats = Math.max(0, excursion.total_seats - totalOccupied);
  const publicRegUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/i/${excursion.public_code}`;

  const totalForecast = excursion.price_per_passenger * totalOccupied;
  const totalPaid = payments.filter(p => p.status === 'pago').reduce((sum, p) => sum + p.amount, 0);
  const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalPaid - totalExpensesAmount;

  // Ações de Passageiro
  const handleSavePassenger = (e: React.FormEvent) => {
    e.preventDefault();
    savePassenger({
      excursion_id: id,
      full_name: pFullName,
      phone: pPhone,
      email: pEmail,
      birth_date: pBirthDate,
      document_number: pDocNumber,
      pickup_location: pPickup || excursion.main_pickup_location,
      emergency_contact_name: pEmergencyName || 'Mesmo do passageiro',
      emergency_contact_phone: pEmergencyPhone || pPhone,
      is_minor: pIsMinor,
      guardian_name: pGuardianName,
      guardian_phone: pGuardianPhone,
      guardian_authorized: pIsMinor ? true : false,
      status: 'confirmado',
      financial_status: 'nao_pago',
      presence_checked_in: false
    });

    setShowAddPassengerModal(false);
    resetPassengerForm();
    loadAllData();
  };

  const resetPassengerForm = () => {
    setPFullName('');
    setPPhone('');
    setPEmail('');
    setPDocNumber('');
    setPEmergencyName('');
    setPEmergencyPhone('');
    setPIsMinor(false);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payPassengerId) return;

    savePayment({
      passenger_id: payPassengerId,
      excursion_id: id,
      amount: Number(payAmount),
      payment_method: payMethod,
      status: payStatus,
      installment_number: 1,
      total_installments: 1,
      payment_date: payStatus === 'pago' ? new Date().toISOString() : undefined
    });

    setShowAddPaymentModal(false);
    loadAllData();
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    saveVehicle({
      excursion_id: id,
      identification: vIdent,
      plate: vPlate,
      capacity: Number(vCapacity),
      driver_name: vDriver,
      driver_phone: vDriverPhone,
      company: vCompany
    });
    setShowAddVehicleModal(false);
    loadAllData();
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    saveExpense({
      excursion_id: id,
      category: expCategory,
      description: expDesc || expCategory,
      amount: Number(expAmount),
      status: 'pago',
      expense_date: new Date().toISOString().split('T')[0]
    });
    setShowAddExpenseModal(false);
    loadAllData();
  };

  const handleToggleCheckin = (passengerId: string, currentStatus: boolean) => {
    updatePassenger(passengerId, {
      presence_checked_in: !currentStatus,
      checked_in_at: !currentStatus ? new Date().toISOString() : null
    });
    queueOfflineCheckin(passengerId, !currentStatus);
    loadAllData();
  };

  const handleBatchConfirm = () => {
    selectedPassengerIds.forEach(pid => {
      updatePassenger(pid, { status: 'confirmado' });
    });
    setSelectedPassengerIds([]);
    loadAllData();
  };

  const tabs = [
    { id: 'visao_geral', label: 'Visão Geral', icon: Compass },
    { id: 'passageiros', label: `Passageiros (${totalOccupied})`, icon: Users },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'veiculos', label: `Veículos (${vehicles.length})`, icon: Bus },
    { id: 'embarques', label: 'Check-in & Embarque', icon: UserCheck },
    { id: 'mensagens', label: 'Central WhatsApp', icon: MessageSquare },
    { id: 'documentos', label: `Documentos (${documents.length})`, icon: FileText },
    { id: 'historico', label: 'Auditoria', icon: History },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Header da Excursão */}
      <div className="bg-white p-6 rounded-2xl border border-jornada-border/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-jornada-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge status={excursion.status} />
              <span className="font-heading text-xs font-semibold text-jornada-muted">
                Código Público: <strong className="text-jornada-navy">{excursion.public_code}</strong>
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-jornada-navy tracking-tight">
              {excursion.name}
            </h1>
            <p className="font-body text-xs text-jornada-muted mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-jornada-terracotta" /> {excursion.destination}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-jornada-navy" /> {new Date(excursion.travel_date).toLocaleDateString('pt-BR')}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-jornada-navy" /> Concentração: {excursion.meeting_time || '06:00'}</span>
            </p>
          </div>

          {/* Botões de Ação Rápida */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(publicRegUrl);
                setCopiedMsg(true);
                setTimeout(() => setCopiedMsg(false), 3000);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading font-semibold bg-jornada-ivory text-jornada-navy border border-jornada-border hover:bg-jornada-ivory/80 transition-colors"
            >
              {copiedMsg ? <Check className="w-4 h-4 text-jornada-green" /> : <Share2 className="w-4 h-4 text-jornada-terracotta" />}
              <span>{copiedMsg ? 'Link Copiado!' : 'Copiar Link Público'}</span>
            </button>

            <a href={publicRegUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
                Ver Form Público
              </Button>
            </a>
          </div>
        </div>

        {/* NAVEGAÇÃO DE ABAS */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-jornada-border/60 pb-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-heading text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-jornada-navy text-white shadow-xs' 
                    : 'text-jornada-muted hover:text-jornada-navy hover:bg-jornada-ivory/80'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ABA 1: VISÃO GERAL */}
      {activeTab === 'visao_geral' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card padding="sm">
              <span className="font-heading text-xs text-jornada-muted block mb-1">Total de Vagas</span>
              <span className="font-heading font-extrabold text-2xl text-jornada-navy">{excursion.total_seats}</span>
              <span className="font-body text-xs text-jornada-green block mt-1">{availableSeats} vagas livres</span>
            </Card>

            <Card padding="sm">
              <span className="font-heading text-xs text-jornada-muted block mb-1">Valor por Passageiro</span>
              <span className="font-heading font-extrabold text-2xl text-jornada-green">R$ {excursion.price_per_passenger.toFixed(2)}</span>
              <span className="font-body text-xs text-jornada-muted block mt-1">Previsão Total: R$ {totalForecast.toFixed(2)}</span>
            </Card>

            <Card padding="sm">
              <span className="font-heading text-xs text-jornada-muted block mb-1">Total Arrecadado</span>
              <span className="font-heading font-extrabold text-2xl text-jornada-navy">R$ {totalPaid.toFixed(2)}</span>
              <span className="font-body text-xs text-jornada-terracotta block mt-1">Pendente: R$ {(totalForecast - totalPaid).toFixed(2)}</span>
            </Card>
          </div>

          <Card title="Informações e Pontos de Embarque">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2 font-body">
                <div><strong>Embarque Principal:</strong> {excursion.main_pickup_location}</div>
                <div><strong>Horário de Concentração:</strong> {excursion.meeting_time || '06:00'}</div>
                <div><strong>Horário de Saída:</strong> {excursion.departure_time || '06:30'}</div>
                <div><strong>Previsão de Retorno:</strong> {excursion.return_time || '20:00'}</div>
                <div><strong>Transporte:</strong> {excursion.transport_type}</div>
              </div>

              <div className="space-y-2 font-body">
                <div><strong>Responsável:</strong> {excursion.leader_name}</div>
                <div><strong>Telefone:</strong> {excursion.leader_phone}</div>
                {excursion.cancellation_policy && (
                  <div><strong>Política de Cancelamento:</strong> {excursion.cancellation_policy}</div>
                )}
                {excursion.notes && (
                  <div><strong>Observações:</strong> {excursion.notes}</div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ABA 2: PASSAGEIROS */}
      {activeTab === 'passageiros' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                placeholder="Buscar passageiro por nome, telefone ou CPF..."
                value={passengerSearch}
                onChange={(e) => setPassengerSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                className="w-full sm:w-80"
              />
              <Select
                value={passengerStatusFilter}
                onChange={(e) => setPassengerStatusFilter(e.target.value)}
                options={[
                  { label: 'Todos os Status', value: 'all' },
                  { label: 'Confirmados', value: 'confirmado' },
                  { label: 'Reserva Pendente', value: 'vaga_reservada' },
                  { label: 'Aguardando Aprovação', value: 'aguardando_confirmacao' },
                  { label: 'Cancelados', value: 'cancelado' },
                ]}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {selectedPassengerIds.length > 0 && (
                <Button variant="accent" size="sm" onClick={handleBatchConfirm}>
                  Confirmar ({selectedPassengerIds.length})
                </Button>
              )}
              <Button variant="primary" icon={<PlusCircle className="w-4 h-4" />} onClick={() => setShowAddPassengerModal(true)}>
                Adicionar Passageiro
              </Button>
            </div>
          </div>

          {/* Tabela de Passageiros */}
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-body border-collapse">
                <thead className="bg-jornada-ivory/60 font-heading text-jornada-navy uppercase border-b border-jornada-border">
                  <tr>
                    <th className="p-3 w-8">
                      <input 
                        type="checkbox" 
                        onChange={(e) => {
                          if (e.target.checked) setSelectedPassengerIds(passengers.map(p => p.id));
                          else setSelectedPassengerIds([]);
                        }}
                      />
                    </th>
                    <th className="p-3">Nome / Telefone</th>
                    <th className="p-3">Ponto de Embarque</th>
                    <th className="p-3">Status Inscrição</th>
                    <th className="p-3">Financeiro</th>
                    <th className="p-3">Contato Emergência</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-jornada-border/60">
                  {passengers.map(p => (
                    <tr key={p.id} className="hover:bg-jornada-ivory/30 transition-colors">
                      <td className="p-3">
                        <input 
                          type="checkbox"
                          checked={selectedPassengerIds.includes(p.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedPassengerIds([...selectedPassengerIds, p.id]);
                            else setSelectedPassengerIds(selectedPassengerIds.filter(i => i !== p.id));
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <span className="font-heading font-semibold text-jornada-navy block text-sm">{p.full_name}</span>
                        <span className="text-jornada-muted">{p.phone} {p.is_minor && <strong className="text-jornada-terracotta ml-1">(Menor)</strong>}</span>
                      </td>
                      <td className="p-3 text-jornada-navy">{p.pickup_location}</td>
                      <td className="p-3"><Badge status={p.status} /></td>
                      <td className="p-3"><Badge status={p.financial_status} /></td>
                      <td className="p-3 text-jornada-muted">
                        <div>{p.emergency_contact_name}</div>
                        <div className="text-[10px]">{p.emergency_contact_phone}</div>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => {
                            deletePassenger(p.id);
                            loadAllData();
                          }}
                          className="p-1.5 text-jornada-muted hover:text-jornada-red transition-colors"
                          title="Remover Passageiro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ABA 3: FINANCEIRO */}
      {activeTab === 'financeiro' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-lg text-jornada-navy">Controle Financeiro & Despesas</h3>
            <div className="flex gap-2">
              <Button variant="secondary" icon={<PlusCircle className="w-4 h-4" />} onClick={() => setShowAddExpenseModal(true)}>
                Lançar Despesa
              </Button>
              <Button variant="accent" icon={<DollarSign className="w-4 h-4" />} onClick={() => setShowAddPaymentModal(true)}>
                Registrar Pagamento
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card padding="sm">
              <span className="font-heading text-xs text-jornada-muted block">Arrecadado (Pagos)</span>
              <span className="font-heading font-extrabold text-xl text-jornada-green">R$ {totalPaid.toFixed(2)}</span>
            </Card>
            <Card padding="sm">
              <span className="font-heading text-xs text-jornada-muted block">Despesas da Viagem</span>
              <span className="font-heading font-extrabold text-xl text-jornada-red">R$ {totalExpensesAmount.toFixed(2)}</span>
            </Card>
            <Card padding="sm">
              <span className="font-heading text-xs text-jornada-muted block">Saldo Estimado</span>
              <span className={`font-heading font-extrabold text-xl ${netBalance >= 0 ? 'text-jornada-navy' : 'text-jornada-red'}`}>
                R$ {netBalance.toFixed(2)}
              </span>
            </Card>
            <Card padding="sm">
              <span className="font-heading text-xs text-jornada-muted block">Total de Lançamentos</span>
              <span className="font-heading font-extrabold text-xl text-jornada-navy">{payments.length}</span>
            </Card>
          </div>
        </div>
      )}

      {/* ABA 4: VEÍCULOS E ASSENTOS */}
      {activeTab === 'veiculos' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-lg text-jornada-navy">Veículos & Frota da Viagem</h3>
            <Button variant="accent" icon={<PlusCircle className="w-4 h-4" />} onClick={() => setShowAddVehicleModal(true)}>
              Cadastrar Veículo
            </Button>
          </div>

          {vehicles.length === 0 ? (
            <EmptyState
              icon={<Bus className="w-8 h-8 text-jornada-navy" />}
              title="Nenhum veículo definido"
              description="Cadastre os ônibus, micro-ônibus ou vans responsáveis pelo transporte."
              actionLabel="Adicionar Veículo"
              onAction={() => setShowAddVehicleModal(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map(v => (
                <Card key={v.id} title={v.identification} subtitle={`Capacidade: ${v.capacity} lugares • Placa: ${v.plate || 'N/A'}`}>
                  <div className="space-y-2 font-body text-xs text-jornada-navy">
                    <div>Empresa: <strong>{v.company || 'Não informada'}</strong></div>
                    <div>Motorista: <strong>{v.driver_name || 'Não informado'}</strong> ({v.driver_phone})</div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ABA 5: CHECK-IN & EMBARQUE */}
      {activeTab === 'embarques' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-jornada-border flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-jornada-navy">Modo Check-in no Dia da Viagem</h3>
              <p className="font-body text-xs text-jornada-muted">Busca rápida e marcação simples de presença via celular.</p>
            </div>
            <Badge variant="success">Pronto para Celular</Badge>
          </div>

          <div className="space-y-2">
            {passengers.map(p => (
              <div key={p.id} className="p-3 bg-white rounded-lg border border-jornada-border flex items-center justify-between">
                <div>
                  <span className="font-heading font-bold text-sm text-jornada-navy block">{p.full_name}</span>
                  <span className="font-body text-xs text-jornada-muted">Embarque: {p.pickup_location}</span>
                </div>
                <Button
                  variant={p.presence_checked_in ? 'success' : 'outline'}
                  size="sm"
                  onClick={() => handleToggleCheckin(p.id, p.presence_checked_in)}
                  icon={<Check className="w-4 h-4" />}
                >
                  {p.presence_checked_in ? 'Embarcado' : 'Marcar Presente'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 6: CENTRAL WHATSAPP */}
      {activeTab === 'mensagens' && (
        <Card title="Modelos de Mensagem WhatsApp" subtitle="Gere mensagens personalizadas com tags dinâmicas.">
          <div className="space-y-4">
            <div className="p-4 bg-jornada-ivory rounded-xl border border-jornada-border space-y-2">
              <h4 className="font-heading font-bold text-sm text-jornada-navy">Confirmação de Inscrição</h4>
              <p className="font-body text-xs text-jornada-muted">
                Olá, tudo bem? Confirmamos sua inscrição na excursão <strong>{excursion.name}</strong> para <strong>{excursion.destination}</strong> no dia <strong>{new Date(excursion.travel_date).toLocaleDateString('pt-BR')}</strong>. O valor é R$ {excursion.price_per_passenger.toFixed(2)}. Chave Pix para pagamento: {getInitialChurch().pix_key}.
              </p>
              <button
                onClick={() => {
                  const text = `Olá! Confirmamos sua inscrição na excursão ${excursion.name} para ${excursion.destination} no dia ${new Date(excursion.travel_date).toLocaleDateString('pt-BR')}. Valor: R$ ${excursion.price_per_passenger.toFixed(2)}. Pix: ${getInitialChurch().pix_key}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-jornada-green text-white text-xs font-heading font-semibold rounded-lg"
              >
                <Share2 className="w-3.5 h-3.5" /> Compartilhar no WhatsApp
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* ABA 7: DOCUMENTOS */}
      {activeTab === 'documentos' && (
        <Card title="Documentos da Excursão" subtitle="Contratos de ônibus, autorizações de menores e listas oficiais.">
          <div className="py-4 text-center text-xs text-jornada-muted font-body">
            Envie arquivos em PDF ou imagem para armazenamento seguro.
          </div>
        </Card>
      )}

      {/* ABA 8: HISTÓRICO */}
      {activeTab === 'historico' && (
        <Card title="Trilha de Auditoria" subtitle="Registro completo de alterações e cadastros.">
          <div className="space-y-2">
            {auditLogs.length === 0 ? (
              <div className="py-4 text-center text-xs text-jornada-muted font-body">Nenhum histórico registrado.</div>
            ) : (
              auditLogs.map(l => (
                <div key={l.id} className="p-2.5 bg-jornada-ivory/50 rounded-lg text-xs font-body flex justify-between">
                  <span><strong>{l.user_name}:</strong> {l.action}</span>
                  <span className="text-jornada-muted">{new Date(l.created_at).toLocaleString('pt-BR')}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* ABA 9: CONFIGURAÇÕES DA EXCURSÃO */}
      {activeTab === 'configuracoes' && (
        <Card title="Editar Parâmetros da Excursão">
          <form className="space-y-4">
            <Input label="Nome da Excursão" defaultValue={excursion.name} />
            <Input label="Destino" defaultValue={excursion.destination} />
            <Button variant="accent">Salvar Alterações</Button>
          </form>
        </Card>
      )}

      {/* MODAL ADICIONAR PASSAGEIRO */}
      <Modal
        isOpen={showAddPassengerModal}
        onClose={() => setShowAddPassengerModal(false)}
        title="Cadastrar Passageiro"
        subtitle="Informe os dados do passageiro para reservar a vaga."
      >
        <form onSubmit={handleSavePassenger} className="space-y-4">
          <Input label="Nome Completo" value={pFullName} onChange={(e) => setPFullName(e.target.value)} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Telefone / WhatsApp" value={pPhone} onChange={(e) => setPPhone(e.target.value)} required />
            <Input label="Documento (CPF / RG)" value={pDocNumber} onChange={(e) => setPDocNumber(e.target.value)} />
          </div>
          <Input label="Ponto de Embarque" value={pPickup} onChange={(e) => setPPickup(e.target.value)} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Contato de Emergência" value={pEmergencyName} onChange={(e) => setPEmergencyName(e.target.value)} />
            <Input label="Tel. Emergência" value={pEmergencyPhone} onChange={(e) => setPEmergencyPhone(e.target.value)} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-jornada-border">
            <Button type="button" variant="ghost" onClick={() => setShowAddPassengerModal(false)}>Cancelar</Button>
            <Button type="submit" variant="accent">Confirmar Cadastro</Button>
          </div>
        </form>
      </Modal>

      {/* MODAL REGISTRAR PAGAMENTO */}
      <Modal
        isOpen={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        title="Registrar Pagamento"
        subtitle="Lance recebimentos por Pix, dinheiro ou transferência."
      >
        <form onSubmit={handleSavePayment} className="space-y-4">
          <Select
            label="Passageiro"
            value={payPassengerId}
            onChange={(e) => setPayPassengerId(e.target.value)}
            options={[
              { label: 'Selecione o passageiro...', value: '' },
              ...passengers.map(p => ({ label: p.full_name, value: p.id }))
            ]}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Valor (R$)" type="number" value={payAmount} onChange={(e) => setPayAmount(Number(e.target.value))} required />
            <Select
              label="Forma de Pagamento"
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value)}
              options={[
                { label: 'Pix', value: 'Pix' },
                { label: 'Dinheiro', value: 'Dinheiro' },
                { label: 'Transferência Bancária', value: 'Transferência' },
                { label: 'Cartão de Crédito/Débito', value: 'Cartão' }
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-jornada-border">
            <Button type="button" variant="ghost" onClick={() => setShowAddPaymentModal(false)}>Cancelar</Button>
            <Button type="submit" variant="accent">Salvar Pagamento</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

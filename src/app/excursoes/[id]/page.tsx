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
  Trash2,
  Edit
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
  updateVehicle,
  deleteVehicle,
  saveExpense, 
  updateExpense,
  deleteExpense,
  saveDocument, 
  deleteDocument,
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
  FinancialStatus,
  ExcursionStatus 
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

  // Seleção e Busca
  const [selectedPassengerIds, setSelectedPassengerIds] = useState<string[]>([]);
  const [passengerSearch, setPassengerSearch] = useState('');
  const [passengerStatusFilter, setPassengerStatusFilter] = useState('all');

  // Modais de Cadastro / Edição
  const [showAddPassengerModal, setShowAddPassengerModal] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<Passenger | null>(null);

  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [showAddDocModal, setShowAddDocModal] = useState(false);

  // Form Passageiro
  const [pFullName, setPFullName] = useState('');
  const [pPhone, setPPhone] = useState('');
  const [pEmail, setPEmail] = useState('');
  const [pBirthDate, setPBirthDate] = useState('');
  const [pDocNumber, setPDocNumber] = useState('');
  const [pPickup, setPPickup] = useState('');
  const [pSeat, setPSeat] = useState('');
  const [pEmergencyName, setPEmergencyName] = useState('');
  const [pEmergencyPhone, setPEmergencyPhone] = useState('');
  const [pIsMinor, setPIsMinor] = useState(false);
  const [pGuardianName, setPGuardianName] = useState('');
  const [pGuardianPhone, setPGuardianPhone] = useState('');
  const [pStatus, setPStatus] = useState<PassengerStatus>('confirmado');
  const [pMedicalInfo, setPMedicalInfo] = useState('');

  // Form Pagamento
  const [payPassengerId, setPayPassengerId] = useState('');
  const [payAmount, setPayAmount] = useState(120);
  const [payMethod, setPayMethod] = useState('Pix');

  // Form Veículo
  const [vIdent, setVIdent] = useState('Ônibus Executivo 01');
  const [vPlate, setVPlate] = useState('');
  const [vCapacity, setVCapacity] = useState(46);
  const [vDriver, setVDriver] = useState('');
  const [vDriverPhone, setVDriverPhone] = useState('');
  const [vCompany, setVCompany] = useState('');

  // Form Despesa
  const [expCategory, setExpCategory] = useState('Aluguel do Veículo');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState(1500);

  // Form Documento
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('contract');

  // Form Configurações da Excursão
  const [cfgName, setCfgName] = useState('');
  const [cfgDestination, setCfgDestination] = useState('');
  const [cfgTravelDate, setCfgTravelDate] = useState('');
  const [cfgDepartureTime, setCfgDepartureTime] = useState('');
  const [cfgReturnDate, setCfgReturnDate] = useState('');
  const [cfgReturnTime, setCfgReturnTime] = useState('');
  const [cfgMeetingTime, setCfgMeetingTime] = useState('');
  const [cfgPickup, setCfgPickup] = useState('');
  const [cfgPrice, setCfgPrice] = useState(0);
  const [cfgSeats, setCfgSeats] = useState(0);
  const [cfgStatus, setCfgStatus] = useState<ExcursionStatus>('open');
  const [cfgLeaderName, setCfgLeaderName] = useState('');
  const [cfgLeaderPhone, setCfgLeaderPhone] = useState('');
  const [cfgTransportType, setCfgTransportType] = useState('');
  const [cfgDescription, setCfgDescription] = useState('');

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

    // Carregar configurações
    setCfgName(exc.name);
    setCfgDestination(exc.destination);
    setCfgTravelDate(exc.travel_date ? exc.travel_date.substring(0, 10) : '');
    setCfgDepartureTime(exc.departure_time || '06:00');
    setCfgReturnDate(exc.return_date ? exc.return_date.substring(0, 10) : '');
    setCfgReturnTime(exc.return_time || '18:00');
    setCfgMeetingTime(exc.meeting_time || '05:30');
    setCfgPickup(exc.main_pickup_location);
    setCfgPrice(exc.price_per_passenger);
    setCfgSeats(exc.total_seats);
    setCfgStatus(exc.status);
    setCfgLeaderName(exc.leader_name);
    setCfgLeaderPhone(exc.leader_phone);
    setCfgTransportType(exc.transport_type);
    setCfgDescription(exc.description || exc.notes || '');
  };

  if (!excursion) return null;

  // Cálculos Gerais
  const totalOccupied = passengers.filter(p => p.status !== 'cancelado').length;
  const availableSeats = Math.max(0, excursion.total_seats - totalOccupied);
  const publicRegUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/i/${excursion.public_code}`;

  const totalPaid = payments.filter(p => p.status === 'pago').reduce((sum, p) => sum + p.amount, 0);
  const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalPaid - totalExpensesAmount;

  // --- PASSAGEIRO CRUD ---
  const handleOpenAddPassengerModal = () => {
    setEditingPassenger(null);
    setPFullName('');
    setPPhone('');
    setPEmail('');
    setPBirthDate('');
    setPDocNumber('');
    setPPickup(excursion.main_pickup_location);
    setPSeat('');
    setPEmergencyName('');
    setPEmergencyPhone('');
    setPIsMinor(false);
    setPGuardianName('');
    setPGuardianPhone('');
    setPStatus('confirmado');
    setPMedicalInfo('');
    setShowAddPassengerModal(true);
  };

  const handleOpenEditPassengerModal = (p: Passenger) => {
    setEditingPassenger(p);
    setPFullName(p.full_name);
    setPPhone(p.phone || '');
    setPEmail(p.email || '');
    setPBirthDate(p.birth_date || '');
    setPDocNumber(p.document_number || '');
    setPPickup(p.pickup_location || excursion.main_pickup_location);
    setPSeat(p.seat_number || '');
    setPEmergencyName(p.emergency_contact_name || '');
    setPEmergencyPhone(p.emergency_contact_phone || '');
    setPIsMinor(p.is_minor || false);
    setPGuardianName(p.guardian_name || '');
    setPGuardianPhone(p.guardian_phone || '');
    setPStatus(p.status || 'confirmado');
    setPMedicalInfo(p.medical_info || '');
    setShowAddPassengerModal(true);
  };

  const handleSavePassenger = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPassenger) {
      updatePassenger(editingPassenger.id, {
        full_name: pFullName,
        phone: pPhone,
        email: pEmail,
        birth_date: pBirthDate,
        document_number: pDocNumber,
        pickup_location: pPickup,
        seat_number: pSeat,
        emergency_contact_name: pEmergencyName,
        emergency_contact_phone: pEmergencyPhone,
        is_minor: pIsMinor,
        guardian_name: pGuardianName,
        guardian_phone: pGuardianPhone,
        status: pStatus,
        medical_info: pMedicalInfo
      });
    } else {
      savePassenger({
        excursion_id: id,
        full_name: pFullName,
        phone: pPhone,
        email: pEmail,
        birth_date: pBirthDate,
        document_number: pDocNumber,
        pickup_location: pPickup || excursion.main_pickup_location,
        seat_number: pSeat,
        emergency_contact_name: pEmergencyName || 'Mesmo do passageiro',
        emergency_contact_phone: pEmergencyPhone || pPhone,
        is_minor: pIsMinor,
        guardian_name: pGuardianName,
        guardian_phone: pGuardianPhone,
        guardian_authorized: pIsMinor ? true : false,
        status: pStatus,
        financial_status: 'nao_pago',
        presence_checked_in: false,
        medical_info: pMedicalInfo
      });
    }

    setShowAddPassengerModal(false);
    loadAllData();
  };

  const handleDeletePassenger = (passengerId: string) => {
    if (confirm('Deseja realmente remover este passageiro?')) {
      deletePassenger(passengerId);
      loadAllData();
    }
  };

  // --- VEÍCULO CRUD ---
  const handleOpenAddVehicleModal = () => {
    setEditingVehicle(null);
    setVIdent(`Ônibus ${vehicles.length + 1}`);
    setVPlate('');
    setVCapacity(46);
    setVDriver('');
    setVDriverPhone('');
    setVCompany('');
    setShowAddVehicleModal(true);
  };

  const handleOpenEditVehicleModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setVIdent(v.identification);
    setVPlate(v.plate || '');
    setVCapacity(v.capacity);
    setVDriver(v.driver_name || '');
    setVDriverPhone(v.driver_phone || '');
    setVCompany(v.company || '');
    setShowAddVehicleModal(true);
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, {
        identification: vIdent,
        plate: vPlate,
        capacity: Number(vCapacity),
        driver_name: vDriver,
        driver_phone: vDriverPhone,
        company: vCompany
      });
    } else {
      saveVehicle({
        excursion_id: id,
        identification: vIdent,
        plate: vPlate,
        capacity: Number(vCapacity),
        driver_name: vDriver,
        driver_phone: vDriverPhone,
        company: vCompany,
        seat_map: {
          rows: Math.ceil(Number(vCapacity) / 4),
          columns: 4,
          type: 'bus',
          disabledSeats: []
        }
      });
    }
    setShowAddVehicleModal(false);
    loadAllData();
  };

  const handleDeleteVehicle = (vehId: string) => {
    if (confirm('Deseja remover este veículo da excursão?')) {
      deleteVehicle(vehId);
      loadAllData();
    }
  };

  // --- DESPESAS CRUD ---
  const handleOpenAddExpenseModal = () => {
    setEditingExpense(null);
    setExpCategory('Aluguel do Veículo');
    setExpDesc('');
    setExpAmount(1500);
    setShowAddExpenseModal(true);
  };

  const handleOpenEditExpenseModal = (exp: Expense) => {
    setEditingExpense(exp);
    setExpCategory(exp.category);
    setExpDesc(exp.description);
    setExpAmount(exp.amount);
    setShowAddExpenseModal(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      updateExpense(editingExpense.id, {
        category: expCategory,
        description: expDesc,
        amount: Number(expAmount)
      });
    } else {
      saveExpense({
        excursion_id: id,
        category: expCategory,
        description: expDesc,
        amount: Number(expAmount),
        status: 'pago',
        expense_date: new Date().toISOString()
      });
    }
    setShowAddExpenseModal(false);
    loadAllData();
  };

  const handleDeleteExpense = (expId: string) => {
    if (confirm('Deseja excluir este lançamento de despesa?')) {
      deleteExpense(expId);
      loadAllData();
    }
  };

  // --- PAGAMENTOS CRUD ---
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payPassengerId) return;

    savePayment({
      excursion_id: id,
      passenger_id: payPassengerId,
      amount: Number(payAmount),
      payment_method: payMethod,
      status: 'pago',
      installment_number: 1,
      total_installments: 1
    });

    setShowAddPaymentModal(false);
    loadAllData();
  };

  // --- CONFIGURAÇÕES DA EXCURSÃO CRUD ---
  const handleSaveExcursionConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateExcursion(id, {
      name: cfgName,
      destination: cfgDestination,
      travel_date: cfgTravelDate,
      departure_time: cfgDepartureTime,
      return_date: cfgReturnDate,
      return_time: cfgReturnTime,
      meeting_time: cfgMeetingTime,
      main_pickup_location: cfgPickup,
      price_per_passenger: Number(cfgPrice),
      total_seats: Number(cfgSeats),
      status: cfgStatus,
      leader_name: cfgLeaderName,
      leader_phone: cfgLeaderPhone,
      transport_type: cfgTransportType,
      description: cfgDescription,
      notes: cfgDescription
    });

    alert('Configurações salvas com sucesso!');
    loadAllData();
  };

  const filteredPassengers = passengers.filter(p => {
    const matchesSearch = p.full_name.toLowerCase().includes(passengerSearch.toLowerCase()) ||
                          p.phone?.includes(passengerSearch) ||
                          p.document_number?.includes(passengerSearch);
    const matchesStatus = passengerStatusFilter === 'all' || p.status === passengerStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header com Dados da Excursão */}
      <div className="bg-white p-6 rounded-2xl border border-jornada-border/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/excursoes" className="text-xs font-body text-jornada-muted hover:text-jornada-navy">
                Excursões /
              </Link>
              <Badge status={excursion.status} />
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-jornada-navy tracking-tight">
              {excursion.name}
            </h1>
            <p className="font-body text-xs text-jornada-muted flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-jornada-terracotta" /> {excursion.destination}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-jornada-navy" /> {new Date(excursion.travel_date).toLocaleDateString('pt-BR')}</span>
              {excursion.departure_time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-jornada-navy" /> Saída: {excursion.departure_time}</span>}
              {excursion.return_time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-jornada-navy" /> Retorno: {excursion.return_time}</span>}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              icon={<ExternalLink className="w-3.5 h-3.5" />}
              onClick={() => window.open(`/i/${excursion.public_code}`, '_blank')}
            >
              Link de Inscrição
            </Button>
            <Button 
              variant="accent" 
              size="sm"
              icon={<PlusCircle className="w-3.5 h-3.5" />}
              onClick={handleOpenAddPassengerModal}
            >
              Novo Passageiro
            </Button>
          </div>
        </div>

        {/* Módulos de Ocupação & Financeiro */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-jornada-border/60 text-xs font-body">
          <div className="p-3 bg-jornada-ivory/60 rounded-xl">
            <span className="text-jornada-muted font-heading font-semibold block text-[11px]">Ocupação Total</span>
            <span className="font-heading font-bold text-base text-jornada-navy">{totalOccupied} / {excursion.total_seats} vagas</span>
          </div>

          <div className="p-3 bg-jornada-ivory/60 rounded-xl">
            <span className="text-jornada-muted font-heading font-semibold block text-[11px]">Valor da Passagem</span>
            <span className="font-heading font-bold text-base text-jornada-green">R$ {excursion.price_per_passenger.toFixed(2)}</span>
          </div>

          <div className="p-3 bg-jornada-ivory/60 rounded-xl">
            <span className="text-jornada-muted font-heading font-semibold block text-[11px]">Total Arrecadado</span>
            <span className="font-heading font-bold text-base text-jornada-green">R$ {totalPaid.toFixed(2)}</span>
          </div>

          <div className="p-3 bg-jornada-ivory/60 rounded-xl">
            <span className="text-jornada-muted font-heading font-semibold block text-[11px]">Saldo Líquido</span>
            <span className={`font-heading font-bold text-base ${netBalance >= 0 ? 'text-jornada-green' : 'text-jornada-red'}`}>
              R$ {netBalance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="flex overflow-x-auto gap-2 border-b border-jornada-border pb-2 no-scrollbar">
        {[
          { id: 'visao_geral', label: 'Visão Geral', icon: Compass },
          { id: 'passageiros', label: `Passageiros (${totalOccupied})`, icon: Users },
          { id: 'veiculos', label: `Veículos (${vehicles.length})`, icon: Bus },
          { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
          { id: 'embarque', label: 'Check-in Mobile', icon: UserCheck },
          { id: 'mensagens', label: 'WhatsApp', icon: MessageSquare },
          { id: 'configuracoes', label: 'Editar Informações', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-heading font-semibold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-jornada-navy text-white shadow-xs' 
                  : 'bg-white text-jornada-navy hover:bg-jornada-ivory border border-jornada-border/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ABA 1: VISÃO GERAL */}
      {activeTab === 'visao_geral' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Resumo da Viagem" className="lg:col-span-2 space-y-4">
            <div className="space-y-2 text-xs font-body text-jornada-navy">
              <div className="flex justify-between py-1 border-b border-jornada-border">
                <span className="text-jornada-muted">Destino:</span>
                <span className="font-bold">{excursion.destination}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-jornada-border">
                <span className="text-jornada-muted">Data de Saída:</span>
                <span className="font-bold">{new Date(excursion.travel_date).toLocaleDateString('pt-BR')} às {excursion.departure_time || '06:00'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-jornada-border">
                <span className="text-jornada-muted">Data de Retorno:</span>
                <span className="font-bold">{excursion.return_date ? new Date(excursion.return_date).toLocaleDateString('pt-BR') : new Date(excursion.travel_date).toLocaleDateString('pt-BR')} às {excursion.return_time || '18:00'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-jornada-border">
                <span className="text-jornada-muted">Ponto de Encontro:</span>
                <span className="font-bold">{excursion.main_pickup_location} ({excursion.meeting_time || '05:30'})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-jornada-border">
                <span className="text-jornada-muted">Líder Responsável:</span>
                <span className="font-bold">{excursion.leader_name} ({excursion.leader_phone})</span>
              </div>
            </div>

            {excursion.description && (
              <div className="p-3 bg-jornada-ivory rounded-xl border border-jornada-border space-y-1">
                <span className="font-heading font-bold text-xs text-jornada-navy block">Observações & Instruções:</span>
                <p className="font-body text-xs text-jornada-muted leading-relaxed">{excursion.description}</p>
              </div>
            )}
          </Card>

          <Card title="Link Público de Inscrição">
            <div className="space-y-3 text-xs font-body">
              <p className="text-jornada-muted">Compartilhe este link com os irmãos para inscrições diretamente pelo celular:</p>
              <div className="p-2.5 bg-jornada-ivory rounded-xl border border-jornada-border font-mono text-[11px] break-all select-all text-jornada-navy">
                {publicRegUrl}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                icon={<Copy className="w-3.5 h-3.5" />}
                onClick={() => {
                  navigator.clipboard.writeText(publicRegUrl);
                  alert('Link copiado!');
                }}
              >
                Copiar Link
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ABA 2: PASSAGEIROS */}
      {activeTab === 'passageiros' && (
        <Card 
          title="Lista de Passageiros" 
          subtitle="Gerencie vagas, telefones, assentos e situação financeira."
          headerAction={
            <Button variant="accent" size="sm" icon={<PlusCircle className="w-3.5 h-3.5" />} onClick={handleOpenAddPassengerModal}>
              Adicionar Passageiro
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Buscar por nome, documento ou telefone..."
                value={passengerSearch}
                onChange={(e) => setPassengerSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
              <Select
                value={passengerStatusFilter}
                onChange={(e) => setPassengerStatusFilter(e.target.value)}
                options={[
                  { label: 'Todos os Status', value: 'all' },
                  { label: 'Confirmados', value: 'confirmado' },
                  { label: 'Vaga Reservada', value: 'vaga_reservada' },
                  { label: 'Cancelados', value: 'cancelado' }
                ]}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-body border-collapse min-w-[700px]">
                <thead className="bg-jornada-ivory border-b border-jornada-border font-heading text-jornada-navy uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Passageiro</th>
                    <th className="py-2.5 px-3">Telefone</th>
                    <th className="py-2.5 px-3">Embarque</th>
                    <th className="py-2.5 px-3">Assento</th>
                    <th className="py-2.5 px-3">Financeiro</th>
                    <th className="py-2.5 px-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-jornada-border">
                  {filteredPassengers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-jornada-muted">Nenhum passageiro encontrado.</td>
                    </tr>
                  ) : (
                    filteredPassengers.map((p) => (
                      <tr key={p.id} className="hover:bg-jornada-ivory/30">
                        <td className="py-2.5 px-3 font-semibold text-jornada-navy">
                          {p.full_name}
                          {p.is_minor && <span className="ml-1 text-[10px] bg-jornada-terracotta text-white px-1.5 py-0.5 rounded">Menor</span>}
                        </td>
                        <td className="py-2.5 px-3">{p.phone}</td>
                        <td className="py-2.5 px-3">{p.pickup_location}</td>
                        <td className="py-2.5 px-3 font-heading font-bold text-jornada-navy">{p.seat_number || 'Livre'}</td>
                        <td className="py-2.5 px-3"><Badge status={p.financial_status} /></td>
                        <td className="py-2.5 px-3 text-right space-x-1">
                          <button 
                            onClick={() => handleOpenEditPassengerModal(p)} 
                            className="p-1 text-jornada-navy hover:bg-jornada-ivory rounded"
                            title="Editar Passageiro"
                          >
                            <Edit className="w-3.5 h-3.5 text-jornada-terracotta" />
                          </button>
                          <button 
                            onClick={() => handleDeletePassenger(p.id)} 
                            className="p-1 text-jornada-red hover:bg-jornada-red/10 rounded"
                            title="Remover Passageiro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* ABA 3: VEÍCULOS */}
      {activeTab === 'veiculos' && (
        <Card 
          title="Veículos e Frotas" 
          subtitle="Cadastre ônibus, micro-ônibus e vans com informações de motorista e placa."
          headerAction={
            <Button variant="accent" size="sm" icon={<PlusCircle className="w-3.5 h-3.5" />} onClick={handleOpenAddVehicleModal}>
              Cadastrar Veículo
            </Button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((v) => (
              <div key={v.id} className="p-4 bg-jornada-ivory/50 rounded-xl border border-jornada-border space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-heading font-bold text-base text-jornada-navy">{v.identification}</h4>
                    <span className="text-xs text-jornada-muted">{v.capacity} Assentos • {v.company || 'Frota da Igreja'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleOpenEditVehicleModal(v)} 
                      className="p-1.5 text-jornada-navy hover:bg-white rounded"
                      title="Editar Veículo"
                    >
                      <Edit className="w-4 h-4 text-jornada-terracotta" />
                    </button>
                    <button 
                      onClick={() => handleDeleteVehicle(v.id)} 
                      className="p-1.5 text-jornada-red hover:bg-white rounded"
                      title="Remover Veículo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-body border-t border-jornada-border/60 pt-2">
                  <div><span className="text-jornada-muted">Placa:</span> <strong>{v.plate || 'Não informada'}</strong></div>
                  <div><span className="text-jornada-muted">Motorista:</span> <strong>{v.driver_name || 'Não informado'}</strong></div>
                  <div><span className="text-jornada-muted">Tel. Motorista:</span> <strong>{v.driver_phone || 'Não informado'}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ABA 4: FINANCEIRO & DESPESAS */}
      {activeTab === 'financeiro' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-jornada-border">
            <h3 className="font-heading font-bold text-base text-jornada-navy">Lançamento de Pagamentos e Despesas</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleOpenAddExpenseModal}>Lançar Despesa</Button>
              <Button variant="accent" size="sm" onClick={() => setShowAddPaymentModal(true)}>Registrar Pagamento</Button>
            </div>
          </div>

          <Card title="Despesas com a Excursão (Ônibus, Combustível, Pedágio)">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-body border-collapse min-w-[500px]">
                <thead className="bg-jornada-ivory border-b border-jornada-border font-heading text-jornada-navy">
                  <tr>
                    <th className="py-2.5 px-3">Categoria</th>
                    <th className="py-2.5 px-3">Descrição</th>
                    <th className="py-2.5 px-3">Valor (R$)</th>
                    <th className="py-2.5 px-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-jornada-border">
                  {expenses.length === 0 ? (
                    <tr><td colSpan={4} className="py-4 text-center text-jornada-muted">Nenhuma despesa lançada.</td></tr>
                  ) : (
                    expenses.map(e => (
                      <tr key={e.id}>
                        <td className="py-2.5 px-3 font-semibold">{e.category}</td>
                        <td className="py-2.5 px-3">{e.description}</td>
                        <td className="py-2.5 px-3 font-bold text-jornada-red">R$ {e.amount.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right space-x-1">
                          <button onClick={() => handleOpenEditExpenseModal(e)} className="p-1 hover:bg-jornada-ivory rounded"><Edit className="w-3.5 h-3.5 text-jornada-terracotta" /></button>
                          <button onClick={() => handleDeleteExpense(e.id)} className="p-1 hover:bg-jornada-red/10 text-jornada-red rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ABA 5: CHECK-IN MOBILE */}
      {activeTab === 'embarque' && (
        <Card title="Embarque e Presença (Check-in Mobile)" subtitle="Marque a presença dos passageiros no dia da viagem pelo celular.">
          <div className="space-y-3">
            {passengers.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-jornada-ivory/50 rounded-xl border border-jornada-border">
                <div>
                  <span className="font-heading font-bold text-sm text-jornada-navy block">{p.full_name}</span>
                  <span className="text-xs text-jornada-muted">Assento: {p.seat_number || 'Livre'} • {p.pickup_location}</span>
                </div>
                <button
                  onClick={() => {
                    updatePassenger(p.id, { presence_checked_in: !p.presence_checked_in });
                    loadAllData();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
                    p.presence_checked_in ? 'bg-jornada-green text-white' : 'bg-white border border-jornada-border text-jornada-navy'
                  }`}
                >
                  {p.presence_checked_in ? 'Presente ✓' : 'Marcar Presença'}
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ABA 6: CONFIGURAÇÕES DA EXCURSÃO (EDITAR INFORMAÇÕES) */}
      {activeTab === 'configuracoes' && (
        <Card title="Editar Parâmetros da Excursão" subtitle="Atualize datas, horários de saída/retorno, ponto de encontro e valores.">
          <form onSubmit={handleSaveExcursionConfig} className="space-y-4">
            <Input label="Nome da Excursão" value={cfgName} onChange={(e) => setCfgName(e.target.value)} required />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Cidade de Destino" value={cfgDestination} onChange={(e) => setCfgDestination(e.target.value)} required />
              <Input label="Ponto/Local de Embarque" value={cfgPickup} onChange={(e) => setCfgPickup(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Input label="Data de Saída" type="date" value={cfgTravelDate} onChange={(e) => setCfgTravelDate(e.target.value)} required />
              <Input label="Horário de Saída" type="time" value={cfgDepartureTime} onChange={(e) => setCfgDepartureTime(e.target.value)} />
              <Input label="Data de Retorno" type="date" value={cfgReturnDate} onChange={(e) => setCfgReturnDate(e.target.value)} />
              <Input label="Horário de Retorno" type="time" value={cfgReturnTime} onChange={(e) => setCfgReturnTime(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input label="Horário de Encontro" type="time" value={cfgMeetingTime} onChange={(e) => setCfgMeetingTime(e.target.value)} />
              <Input label="Valor por Pessoa (R$)" type="number" value={cfgPrice} onChange={(e) => setCfgPrice(Number(e.target.value))} required />
              <Input label="Total de Vagas" type="number" value={cfgSeats} onChange={(e) => setCfgSeats(Number(e.target.value))} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input label="Nome do Responsável" value={cfgLeaderName} onChange={(e) => setCfgLeaderName(e.target.value)} />
              <Input label="Telefone do Responsável" value={cfgLeaderPhone} onChange={(e) => setCfgLeaderPhone(e.target.value)} />
              <Select
                label="Situação / Status"
                value={cfgStatus}
                onChange={(e) => setCfgStatus(e.target.value as ExcursionStatus)}
                options={[
                  { label: 'Inscrições Abertas', value: 'open' },
                  { label: 'Esgotada', value: 'full' },
                  { label: 'Rascunho', value: 'draft' },
                  { label: 'Realizada', value: 'completed' },
                  { label: 'Cancelada', value: 'cancelled' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold text-jornada-navy mb-1">
                Observações e Descrição da Viagem
              </label>
              <textarea
                className="w-full p-2.5 rounded-xl border border-jornada-border text-xs font-body text-jornada-navy"
                rows={3}
                value={cfgDescription}
                onChange={(e) => setCfgDescription(e.target.value)}
              />
            </div>

            <Button type="submit" variant="accent">Salvar Alterações</Button>
          </form>
        </Card>
      )}

      {/* MODAL ADICIONAR / EDITAR PASSAGEIRO */}
      <Modal
        isOpen={showAddPassengerModal}
        onClose={() => setShowAddPassengerModal(false)}
        title={editingPassenger ? "Editar Passageiro" : "Cadastrar Passageiro"}
        subtitle="Informe os dados do passageiro para reservar a vaga."
      >
        <form onSubmit={handleSavePassenger} className="space-y-4">
          <Input label="Nome Completo" value={pFullName} onChange={(e) => setPFullName(e.target.value)} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Telefone / WhatsApp" value={pPhone} onChange={(e) => setPPhone(e.target.value)} required />
            <Input label="Documento (CPF / RG)" value={pDocNumber} onChange={(e) => setPDocNumber(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Ponto de Embarque" value={pPickup} onChange={(e) => setPPickup(e.target.value)} required />
            <Input label="Assento Atribuído" placeholder="Ex: 12A" value={pSeat} onChange={(e) => setPSeat(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Contato de Emergência" value={pEmergencyName} onChange={(e) => setPEmergencyName(e.target.value)} />
            <Input label="Tel. Emergência" value={pEmergencyPhone} onChange={(e) => setPEmergencyPhone(e.target.value)} />
          </div>
          <Select
            label="Situação da Inscrição"
            value={pStatus}
            onChange={(e) => setPStatus(e.target.value as PassengerStatus)}
            options={[
              { label: 'Confirmado', value: 'confirmado' },
              { label: 'Vaga Reservada', value: 'vaga_reservada' },
              { label: 'Aguardando Confirmação', value: 'aguardando_confirmacao' },
              { label: 'Cancelado', value: 'cancelado' }
            ]}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-jornada-border">
            <Button type="button" variant="ghost" onClick={() => setShowAddPassengerModal(false)}>Cancelar</Button>
            <Button type="submit" variant="accent">{editingPassenger ? "Salvar Alterações" : "Confirmar Cadastro"}</Button>
          </div>
        </form>
      </Modal>

      {/* MODAL ADICIONAR / EDITAR VEÍCULO */}
      <Modal
        isOpen={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
        title={editingVehicle ? "Editar Veículo" : "Cadastrar Veículo"}
        subtitle="Informe os dados do ônibus, micro-ônibus ou van."
      >
        <form onSubmit={handleSaveVehicle} className="space-y-4">
          <Input label="Identificação (Ex: Ônibus Executivo 01)" value={vIdent} onChange={(e) => setVIdent(e.target.value)} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Capacidade de Assentos" type="number" value={vCapacity} onChange={(e) => setVCapacity(Number(e.target.value))} required />
            <Input label="Placa do Veículo" placeholder="ABC-1D23" value={vPlate} onChange={(e) => setVPlate(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Nome do Motorista" value={vDriver} onChange={(e) => setVDriver(e.target.value)} />
            <Input label="Telefone do Motorista" value={vDriverPhone} onChange={(e) => setVDriverPhone(e.target.value)} />
          </div>
          <Input label="Empresa de Transporte" placeholder="Ex: Viacao Express" value={vCompany} onChange={(e) => setVCompany(e.target.value)} />
          <div className="flex justify-end gap-3 pt-4 border-t border-jornada-border">
            <Button type="button" variant="ghost" onClick={() => setShowAddVehicleModal(false)}>Cancelar</Button>
            <Button type="submit" variant="accent">{editingVehicle ? "Salvar Veículo" : "Cadastrar Veículo"}</Button>
          </div>
        </form>
      </Modal>

      {/* MODAL ADICIONAR / EDITAR DESPESA */}
      <Modal
        isOpen={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
        title={editingExpense ? "Editar Despesa" : "Lançar Despesa"}
        subtitle="Registre gastos com transporte, combustível ou alimentação."
      >
        <form onSubmit={handleSaveExpense} className="space-y-4">
          <Select
            label="Categoria"
            value={expCategory}
            onChange={(e) => setExpCategory(e.target.value)}
            options={[
              { label: 'Aluguel do Veículo', value: 'Aluguel do Veículo' },
              { label: 'Combustível', value: 'Combustível' },
              { label: 'Pedágio', value: 'Pedágio' },
              { label: 'Alimentação do Grupo/Motorista', value: 'Alimentação' },
              { label: 'Guia / Taxas de Entrada', value: 'Guia / Taxas' },
              { label: 'Outras Despesas', value: 'Outras' }
            ]}
          />
          <Input label="Descrição detalhada" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} required />
          <Input label="Valor (R$)" type="number" value={expAmount} onChange={(e) => setExpAmount(Number(e.target.value))} required />
          <div className="flex justify-end gap-3 pt-4 border-t border-jornada-border">
            <Button type="button" variant="ghost" onClick={() => setShowAddExpenseModal(false)}>Cancelar</Button>
            <Button type="submit" variant="accent">{editingExpense ? "Salvar Alterações" : "Salvar Despesa"}</Button>
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

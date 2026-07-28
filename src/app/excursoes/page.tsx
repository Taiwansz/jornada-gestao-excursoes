'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  PlusCircle, 
  Search, 
  Filter, 
  Copy, 
  Archive, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Bus,
  Users,
  DollarSign,
  Edit,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';

import { 
  getExcursions, 
  getPassengers, 
  saveExcursion, 
  updateExcursion, 
  duplicateExcursion,
  getInitialChurch 
} from '@/lib/store';

import { Excursion, ExcursionStatus } from '@/types';

export default function ExcursionsPage() {
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [passengersMap, setPassengersMap] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [showModal, setShowModal] = useState(false);
  const [editingExcursion, setEditingExcursion] = useState<Excursion | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [departureTime, setDepartureTime] = useState('06:00');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('18:00');
  const [meetingTime, setMeetingTime] = useState('05:30');
  const [totalSeats, setTotalSeats] = useState(44);
  const [price, setPrice] = useState(120);
  const [leaderName, setLeaderName] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [pickup, setPickup] = useState('Frente da Igreja Sede');
  const [transportType, setTransportType] = useState('Ônibus Executivo');
  const [status, setStatus] = useState<ExcursionStatus>('open');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadExcursions();
  }, []);

  const loadExcursions = () => {
    const list = getExcursions();
    setExcursions(list);

    const map: Record<string, number> = {};
    list.forEach(e => {
      const pass = getPassengers(e.id).filter(p => p.status !== 'cancelado');
      map[e.id] = pass.length;
    });
    setPassengersMap(map);
  };

  const handleOpenCreateModal = () => {
    setEditingExcursion(null);
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (exc: Excursion) => {
    setEditingExcursion(exc);
    setName(exc.name);
    setDestination(exc.destination);
    setTravelDate(exc.travel_date ? exc.travel_date.substring(0, 10) : '');
    setDepartureTime(exc.departure_time || '06:00');
    setReturnDate(exc.return_date ? exc.return_date.substring(0, 10) : '');
    setReturnTime(exc.return_time || '18:00');
    setMeetingTime(exc.meeting_time || '05:30');
    setTotalSeats(exc.total_seats);
    setPrice(exc.price_per_passenger);
    setLeaderName(exc.leader_name || '');
    setLeaderPhone(exc.leader_phone || '');
    setPickup(exc.main_pickup_location || 'Frente da Igreja Sede');
    setTransportType(exc.transport_type || 'Ônibus Executivo');
    setStatus(exc.status || 'open');
    setDescription(exc.description || exc.notes || '');
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const church = getInitialChurch();

    if (editingExcursion) {
      updateExcursion(editingExcursion.id, {
        name,
        destination,
        travel_date: travelDate,
        departure_time: departureTime,
        return_date: returnDate || travelDate,
        return_time: returnTime,
        meeting_time: meetingTime,
        total_seats: Number(totalSeats),
        price_per_passenger: Number(price),
        leader_name: leaderName || church.main_responsible || 'Organizador',
        leader_phone: leaderPhone || church.phone || '',
        main_pickup_location: pickup,
        transport_type: transportType,
        status,
        description,
        notes: description
      });
    } else {
      saveExcursion({
        name,
        destination,
        travel_date: travelDate,
        departure_time: departureTime,
        return_date: returnDate || travelDate,
        return_time: returnTime,
        meeting_time: meetingTime,
        total_seats: Number(totalSeats),
        price_per_passenger: Number(price),
        leader_name: leaderName || church.main_responsible || 'Organizador',
        leader_phone: leaderPhone || church.phone || '',
        main_pickup_location: pickup,
        additional_pickups: [],
        transport_type: transportType,
        status,
        description,
        notes: description,
        requires_manual_approval: true
      });
    }

    setShowModal(false);
    resetForm();
    loadExcursions();
  };

  const resetForm = () => {
    setName('');
    setDestination('');
    setTravelDate('');
    setDepartureTime('06:00');
    setReturnDate('');
    setReturnTime('18:00');
    setMeetingTime('05:30');
    setTotalSeats(44);
    setPrice(120);
    setLeaderName('');
    setLeaderPhone('');
    setPickup('Frente da Igreja Sede');
    setTransportType('Ônibus Executivo');
    setStatus('open');
    setDescription('');
  };

  const handleDuplicate = (id: string) => {
    duplicateExcursion(id);
    loadExcursions();
  };

  const filteredExcursions = excursions.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                          e.destination.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-jornada-border/80 shadow-xs">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-jornada-navy tracking-tight">
            Gestão de Excursões
          </h1>
          <p className="font-body text-xs text-jornada-muted mt-0.5">
            Organize viagens de van, micro-ônibus, ônibus executivo ou veículos próprios da sua igreja.
          </p>
        </div>

        <Button 
          variant="accent" 
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={handleOpenCreateModal}
        >
          Nova Excursão
        </Button>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nome da viagem ou cidade de destino..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'Todas as Situações', value: 'all' },
              { label: 'Inscrições Abertas', value: 'open' },
              { label: 'Esgotadas', value: 'full' },
              { label: 'Realizadas', value: 'completed' },
              { label: 'Rascunho', value: 'draft' },
              { label: 'Canceladas', value: 'cancelled' },
            ]}
          />
        </div>
      </div>

      {/* Lista de Cards de Excursão */}
      {filteredExcursions.length === 0 ? (
        <EmptyState
          title="Nenhuma excursão encontrada"
          description="Cadastre sua primeira viagem ou modifique os termos de busca acima."
          actionLabel="Cadastrar Excursão"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExcursions.map((exc) => {
            const occupied = passengersMap[exc.id] || 0;
            const pct = Math.min(100, Math.round((occupied / exc.total_seats) * 100));

            return (
              <Card key={exc.id} className="flex flex-col justify-between hover:border-jornada-navy/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-bold text-lg text-jornada-navy tracking-tight line-clamp-1">
                      {exc.name}
                    </h3>
                    <Badge status={exc.status} />
                  </div>

                  <div className="space-y-1.5 text-xs text-jornada-muted font-body">
                    <div className="flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-jornada-terracotta shrink-0" />
                      <span className="font-semibold text-jornada-navy truncate">{exc.destination}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-jornada-navy shrink-0" />
                      <span>
                        {new Date(exc.travel_date).toLocaleDateString('pt-BR')}
                        {exc.departure_time ? ` às ${exc.departure_time}` : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bus className="w-3.5 h-3.5 text-jornada-navy shrink-0" />
                      <span>{exc.transport_type || 'Ônibus Executivo'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-jornada-green shrink-0" />
                      <span className="font-bold text-jornada-green">R$ {exc.price_per_passenger.toFixed(2)} por pessoa</span>
                    </div>
                  </div>

                  {/* Barra de Ocupação dos Assentos */}
                  <div className="pt-2 space-y-1">
                    <div className="flex justify-between text-[11px] font-heading font-semibold text-jornada-navy">
                      <span>Ocupação ({occupied}/{exc.total_seats} vagas)</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-jornada-ivory rounded-full overflow-hidden border border-jornada-border">
                      <div 
                        className={`h-full transition-all duration-300 ${pct >= 100 ? 'bg-jornada-red' : pct >= 80 ? 'bg-jornada-terracotta' : 'bg-jornada-green'}`} 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-jornada-border/60 mt-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleOpenEditModal(exc)}
                      className="p-2 text-jornada-navy hover:bg-jornada-ivory rounded-lg transition-colors flex items-center gap-1 text-xs font-heading font-semibold"
                      title="Editar Informações"
                    >
                      <Edit className="w-3.5 h-3.5 text-jornada-terracotta" />
                      <span>Editar</span>
                    </button>
                    <button 
                      onClick={() => handleDuplicate(exc.id)}
                      className="p-2 text-jornada-muted hover:text-jornada-navy hover:bg-jornada-ivory rounded-lg transition-colors"
                      title="Duplicar Excursão"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <Link href={`/excursoes/${exc.id}`}>
                    <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Painel Completo
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Criação / Edição de Excursão */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingExcursion ? "Editar Excursão" : "Cadastrar Nova Excursão"}
        subtitle={editingExcursion ? "Modifique os dados da viagem abaixo." : "Preencha as informações gerais da nova viagem da sua igreja."}
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Nome da Excursão"
            placeholder="Ex: Retiro de Jovens 2026 / Viagem à Sede"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Cidade de Destino"
              placeholder="Ex: Serra Negra / Aparecida"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
            <Input
              label="Ponto/Local Principal de Embarque"
              placeholder="Ex: Frente da Igreja Sede"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              label="Data de Saída"
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              required
            />
            <Input
              label="Horário de Saída"
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />
            <Input
              label="Data de Retorno"
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
            <Input
              label="Horário de Retorno"
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Valor por Pessoa (R$)"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
            <Input
              label="Total de Vagas / Assentos"
              type="number"
              value={totalSeats}
              onChange={(e) => setTotalSeats(Number(e.target.value))}
              required
            />
            <Select
              label="Tipo de Transporte"
              value={transportType}
              onChange={(e) => setTransportType(e.target.value)}
              options={[
                { label: 'Ônibus Executivo (44-50 assentos)', value: 'Ônibus Executivo' },
                { label: 'Micro-ônibus (24-32 assentos)', value: 'Micro-ônibus' },
                { label: 'Van (15-20 assentos)', value: 'Van' },
                { label: 'Veículos Próprios / Comboio', value: 'Veículos Próprios' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Nome do Líder Responsável"
              placeholder="Ex: Irmão João Silva"
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
            />
            <Input
              label="Telefone do Responsável"
              placeholder="(11) 98765-4321"
              value={leaderPhone}
              onChange={(e) => setLeaderPhone(e.target.value)}
            />
            <Select
              label="Situação / Status da Excursão"
              value={status}
              onChange={(e) => setStatus(e.target.value as ExcursionStatus)}
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
              Observações & Instruções aos Passageiros
            </label>
            <textarea
              className="w-full p-2.5 rounded-xl border border-jornada-border text-xs font-body text-jornada-navy focus:outline-hidden focus:ring-2 focus:ring-jornada-navy"
              rows={3}
              placeholder="Instruções sobre bagagem, alimentação, documentos necessários..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-jornada-border">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="accent">
              {editingExcursion ? "Salvar Alterações" : "Criar Excursão"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

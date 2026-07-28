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
  DollarSign
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
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [totalSeats, setTotalSeats] = useState(44);
  const [price, setPrice] = useState(120);
  const [leaderName, setLeaderName] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [pickup, setPickup] = useState('Frente da Igreja Sede');
  const [transportType, setTransportType] = useState('Ônibus Executivo');

  useEffect(() => {
    loadExcursions();
  }, []);

  const loadExcursions = () => {
    const list = getExcursions();
    setExcursions(list);

    // Calcular ocupação por excursão
    const map: Record<string, number> = {};
    list.forEach(e => {
      const pass = getPassengers(e.id).filter(p => p.status !== 'cancelado');
      map[e.id] = pass.length;
    });
    setPassengersMap(map);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const church = getInitialChurch();

    saveExcursion({
      name,
      destination,
      travel_date: travelDate,
      total_seats: Number(totalSeats),
      price_per_passenger: Number(price),
      leader_name: leaderName || church.main_responsible || 'Organizador',
      leader_phone: leaderPhone || church.phone || '',
      main_pickup_location: pickup,
      additional_pickups: [],
      transport_type: transportType,
      status: 'open',
      requires_manual_approval: true
    });

    setShowModal(false);
    resetForm();
    loadExcursions();
  };

  const resetForm = () => {
    setName('');
    setDestination('');
    setTravelDate('');
    setTotalSeats(44);
    setPrice(120);
  };

  const handleDuplicate = (id: string) => {
    duplicateExcursion(id);
    loadExcursions();
  };

  const handleStatusChange = (id: string, status: ExcursionStatus) => {
    updateExcursion(id, { status });
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
          onClick={() => setShowModal(true)}
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
              { label: 'Concluídas', value: 'completed' },
              { label: 'Rascunho', value: 'draft' },
              { label: 'Canceladas / Arquivadas', value: 'cancelled' },
            ]}
          />
        </div>
      </div>

      {/* Lista de Excursões */}
      {filteredExcursions.length === 0 ? (
        <EmptyState
          icon={<Compass className="w-8 h-8 text-jornada-terracotta" />}
          title="Nenhuma excursão encontrada"
          description={search ? "Nenhum resultado corresponde à sua busca." : "Sua igreja ainda não possui excursões cadastradas."}
          actionLabel="Criar Nova Excursão"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredExcursions.map((excursion) => {
            const occupied = passengersMap[excursion.id] || 0;
            const percent = Math.round((occupied / excursion.total_seats) * 100);

            return (
              <div 
                key={excursion.id} 
                className="bg-white rounded-xl border border-jornada-border/80 p-5 hover:border-jornada-navy/50 transition-all shadow-xs"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading font-bold text-lg text-jornada-navy tracking-tight">
                        {excursion.name}
                      </h3>
                      <Badge status={excursion.status} />
                      <span className="text-[11px] font-heading font-semibold bg-jornada-ivory text-jornada-navy px-2.5 py-0.5 rounded border border-jornada-border">
                        {excursion.transport_type}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-body text-jornada-muted">
                      <div>Destino: <strong className="text-jornada-navy">{excursion.destination}</strong></div>
                      <div>Data: <strong className="text-jornada-navy">{new Date(excursion.travel_date).toLocaleDateString('pt-BR')}</strong></div>
                      <div>Valor: <strong className="text-jornada-green">R$ {excursion.price_per_passenger.toFixed(2)}</strong></div>
                    </div>

                    <div className="text-xs font-body text-jornada-muted">
                      Embarque Principal: <strong className="text-jornada-navy">{excursion.main_pickup_location}</strong>
                      {excursion.leader_name && (
                        <span> • Responsável: <strong className="text-jornada-navy">{excursion.leader_name}</strong> ({excursion.leader_phone})</span>
                      )}
                    </div>
                  </div>

                  {/* Right Progress & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-t lg:border-t-0 border-jornada-border/50 pt-4 lg:pt-0">
                    <div className="w-full sm:w-44">
                      <div className="flex justify-between text-xs font-heading font-bold mb-1">
                        <span className="text-jornada-navy">{occupied} / {excursion.total_seats} vagas</span>
                        <span className="text-jornada-muted">{percent}%</span>
                      </div>
                      <div className="w-full bg-jornada-ivory rounded-full h-2.5 overflow-hidden border border-jornada-border/60">
                        <div 
                          className={`h-full rounded-full transition-all ${percent >= 90 ? 'bg-jornada-terracotta' : 'bg-jornada-navy'}`}
                          style={{ width: `${Math.min(100, percent)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Link href={`/excursoes/${excursion.id}`} className="w-full sm:w-auto">
                        <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                          Abrir Painel
                        </Button>
                      </Link>

                      <button
                        onClick={() => handleDuplicate(excursion.id)}
                        className="p-2 text-jornada-muted hover:text-jornada-navy hover:bg-jornada-ivory rounded-lg border border-jornada-border/60 transition-colors"
                        title="Duplicar Excursão"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Criação Completa de Excursão */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Cadastrar Nova Excursão"
        subtitle="Preencha os campos para iniciar a gestão do transporte e inscrições."
        maxWidth="xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nome da Excursão"
            placeholder="Ex: Retiro Espiritual 2026 / Viagem da Mocidade"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Destino / Cidade"
              placeholder="Ex: Águas de Lindoia - SP"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />

            <Input
              label="Data da Viagem"
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Tipo de Transporte"
              value={transportType}
              onChange={(e) => setTransportType(e.target.value)}
              options={[
                { label: 'Ônibus Executivo (46-50 lugares)', value: 'Ônibus Executivo' },
                { label: 'Micro-ônibus (28-32 lugares)', value: 'Micro-ônibus' },
                { label: 'Van (15-20 lugares)', value: 'Van' },
                { label: 'Veículos Próprios / Comboio', value: 'Veículos Próprios' },
              ]}
            />

            <Input
              label="Número Total de Vagas"
              type="number"
              value={totalSeats}
              onChange={(e) => setTotalSeats(Number(e.target.value))}
              required
            />

            <Input
              label="Valor Padrão por Passageiro (R$)"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Local Principal de Embarque"
            placeholder="Ex: Frente da Igreja Sede - Av. Principal, 1000"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nome do Responsável / Líder"
              placeholder="Ex: Ir. Marcos ou Pr. Carlos"
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
            />

            <Input
              label="Telefone do Responsável"
              placeholder="(11) 98765-4321"
              value={leaderPhone}
              onChange={(e) => setLeaderPhone(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-jornada-border">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="accent">
              Salvar Excursão
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

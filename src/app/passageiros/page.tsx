'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  PlusCircle, 
  CheckCircle2, 
  Phone, 
  ShieldAlert,
  MapPin,
  Trash2
} from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';

import { 
  getPassengers, 
  getExcursions, 
  deletePassenger, 
  updatePassenger 
} from '@/lib/store';

import { Passenger, Excursion } from '@/types';

export default function PassengersDirectoryPage() {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [search, setSearch] = useState('');
  const [excursionFilter, setExcursionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [financialFilter, setFinancialFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPassengers(getPassengers());
    setExcursions(getExcursions());
  };

  const filteredPassengers = passengers.filter(p => {
    const matchesSearch = p.full_name.toLowerCase().includes(search.toLowerCase()) ||
                          p.phone.includes(search) ||
                          (p.document_number && p.document_number.includes(search));
    const matchesExcursion = excursionFilter === 'all' || p.excursion_id === excursionFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesFinancial = financialFilter === 'all' || p.financial_status === financialFilter;

    return matchesSearch && matchesExcursion && matchesStatus && matchesFinancial;
  });

  const exportCSV = () => {
    const headers = ['Nome Completo', 'Telefone', 'Excursão', 'Ponto Embarque', 'Status', 'Financeiro', 'Contato Emergência'];
    const rows = filteredPassengers.map(p => {
      const exc = excursions.find(e => e.id === p.excursion_id);
      return [
        `"${p.full_name}"`,
        `"${p.phone}"`,
        `"${exc?.name || 'N/A'}"`,
        `"${p.pickup_location}"`,
        `"${p.status}"`,
        `"${p.financial_status}"`,
        `"${p.emergency_contact_name} (${p.emergency_contact_phone})"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lista_passageiros_jornada.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-jornada-border/80 shadow-xs">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-jornada-navy tracking-tight">
            Diretório Global de Passageiros
          </h1>
          <p className="font-body text-xs text-jornada-muted mt-0.5">
            Visualize e filtre todos os passageiros cadastrados em viagens da sua igreja.
          </p>
        </div>

        <Button variant="secondary" icon={<Download className="w-4 h-4" />} onClick={exportCSV}>
          Exportar Planilha (CSV)
        </Button>
      </div>

      {/* Barra de Filtros Avançados */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Input
          placeholder="Buscar nome, telefone ou CPF..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />

        <Select
          value={excursionFilter}
          onChange={(e) => setExcursionFilter(e.target.value)}
          options={[
            { label: 'Todas as Excursões', value: 'all' },
            ...excursions.map(e => ({ label: e.name, value: e.id }))
          ]}
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { label: 'Todos os Status', value: 'all' },
            { label: 'Confirmados', value: 'confirmado' },
            { label: 'Reserva Pendente', value: 'vaga_reservada' },
            { label: 'Aguardando Análise', value: 'aguardando_confirmacao' },
            { label: 'Cancelados', value: 'cancelado' }
          ]}
        />

        <Select
          value={financialFilter}
          onChange={(e) => setFinancialFilter(e.target.value)}
          options={[
            { label: 'Todas as Situações Financ.', value: 'all' },
            { label: 'Pago', value: 'pago' },
            { label: 'Não Pago', value: 'nao_pago' },
            { label: 'Parcialmente Pago', value: 'parcialmente_pago' },
            { label: 'Atrasado', value: 'atrasado' }
          ]}
        />
      </div>

      {/* Lista / Tabela */}
      {filteredPassengers.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8 text-jornada-navy" />}
          title="Nenhum passageiro encontrado"
          description="Nenhum registro corresponde aos filtros selecionados."
        />
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body border-collapse">
              <thead className="bg-jornada-ivory/60 font-heading text-jornada-navy uppercase border-b border-jornada-border">
                <tr>
                  <th className="p-3.5">Passageiro</th>
                  <th className="p-3.5">Excursão</th>
                  <th className="p-3.5">Embarque</th>
                  <th className="p-3.5">Status Vaga</th>
                  <th className="p-3.5">Situação Financeira</th>
                  <th className="p-3.5">Contato Emergência</th>
                  <th className="p-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-jornada-border/60">
                {filteredPassengers.map(p => {
                  const exc = excursions.find(e => e.id === p.excursion_id);
                  return (
                    <tr key={p.id} className="hover:bg-jornada-ivory/30 transition-colors">
                      <td className="p-3.5">
                        <span className="font-heading font-semibold text-sm text-jornada-navy block">{p.full_name}</span>
                        <span className="text-jornada-muted">{p.phone} {p.is_minor && <strong className="text-jornada-terracotta ml-1">(Menor)</strong>}</span>
                      </td>
                      <td className="p-3.5 font-heading font-medium text-jornada-navy">
                        {exc?.name || 'N/A'}
                      </td>
                      <td className="p-3.5 text-jornada-navy">{p.pickup_location}</td>
                      <td className="p-3.5"><Badge status={p.status} /></td>
                      <td className="p-3.5"><Badge status={p.financial_status} /></td>
                      <td className="p-3.5 text-jornada-muted">
                        <div>{p.emergency_contact_name}</div>
                        <div className="text-[10px]">{p.emergency_contact_phone}</div>
                      </td>
                      <td className="p-3.5 text-right">
                        <Link href={`/excursoes/${p.excursion_id}?tab=passageiros`}>
                          <Button variant="ghost" size="sm">Ver na Excursão</Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

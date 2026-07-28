'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Printer, 
  Download, 
  FileText, 
  Users, 
  DollarSign, 
  Bus, 
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Input';
import { ChurchBrandHeader } from '@/components/brand/Logo';

import { 
  getExcursions, 
  getPassengers, 
  getPayments, 
  getExpenses, 
  getVehicles, 
  getInitialChurch 
} from '@/lib/store';

import { Excursion, Passenger, Payment, Expense, Church } from '@/types';

export default function ReportsPage() {
  const [church, setChurch] = useState<Church | null>(null);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [selectedExcursionId, setSelectedExcursionId] = useState('');
  const [reportType, setReportType] = useState('passengers_confirmed');

  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const c = getInitialChurch();
    setChurch(c);
    const list = getExcursions();
    setExcursions(list);
    if (list.length > 0) setSelectedExcursionId(list[0].id);
  }, []);

  useEffect(() => {
    if (selectedExcursionId) {
      setPassengers(getPassengers(selectedExcursionId));
      setPayments(getPayments(selectedExcursionId));
    }
  }, [selectedExcursionId]);

  const selectedExcursion = excursions.find(e => e.id === selectedExcursionId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header na Tela (No Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-jornada-border/80 shadow-xs">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-jornada-navy tracking-tight">
            Central de Relatórios Imprimíveis
          </h1>
          <p className="font-body text-xs text-jornada-muted mt-0.5">
            Gere listas de ônibus, relatórios de presença no embarque e fechamentos financeiros limpos para impressão.
          </p>
        </div>

        <Button variant="accent" icon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
          Imprimir Relatório
        </Button>
      </div>

      {/* Seleção de Parâmetros (No Print) */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label="Selecionar Excursão"
          value={selectedExcursionId}
          onChange={(e) => setSelectedExcursionId(e.target.value)}
          options={excursions.map(e => ({ label: `${e.name} (${e.destination})`, value: e.id }))}
        />

        <Select
          label="Tipo de Relatório"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          options={[
            { label: 'Lista de Passageiros Confirmados (Embarque)', value: 'passengers_confirmed' },
            { label: 'Contatos de Emergência & Saúde', value: 'emergency_contacts' },
            { label: 'Relatório de Menores de Idade', value: 'minors_list' },
            { label: 'Fechamento Financeiro da Viagem', value: 'financial_closure' },
          ]}
        />
      </div>

      {/* ÁREA DO RELATÓRIO IMPRIMÍVEL (Print Only + Normal Preview) */}
      <div className="bg-white p-8 rounded-2xl border border-jornada-border shadow-sm print-container">
        {/* Header da Igreja no Impresso */}
        <ChurchBrandHeader 
          churchName={church?.name} 
          churchLogo={church?.logo_url}
        />

        <div className="border-b border-jornada-border/80 pb-4 mb-6">
          <h2 className="font-heading font-bold text-xl text-jornada-navy uppercase tracking-tight">
            {reportType === 'passengers_confirmed' && 'Lista Oficial de Embarque de Passageiros'}
            {reportType === 'emergency_contacts' && 'Lista de Contatos de Emergência'}
            {reportType === 'minors_list' && 'Relatório de Menores de Idade e Autorizações'}
            {reportType === 'financial_closure' && 'Fechamento Financeiro da Excursão'}
          </h2>
          <div className="font-body text-xs text-jornada-muted mt-1 flex flex-wrap gap-4">
            <span>Excursão: <strong className="text-jornada-navy">{selectedExcursion?.name}</strong></span>
            <span>Destino: <strong className="text-jornada-navy">{selectedExcursion?.destination}</strong></span>
            <span>Data: <strong className="text-jornada-navy">{selectedExcursion?.travel_date ? new Date(selectedExcursion.travel_date).toLocaleDateString('pt-BR') : ''}</strong></span>
          </div>
        </div>

        {/* Conteúdo do Relatório: Passageiros Confirmados */}
        {reportType === 'passengers_confirmed' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body border-collapse min-w-[500px]">
              <thead className="border-b-2 border-jornada-navy font-heading text-jornada-navy uppercase">
                <tr>
                  <th className="py-2">#</th>
                  <th className="py-2">Nome do Passageiro</th>
                  <th className="py-2">Telefone</th>
                  <th className="py-2">Ponto de Embarque</th>
                  <th className="py-2">Situação Financeira</th>
                  <th className="py-2 text-center">Assinatura / Presença</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-jornada-border">
                {passengers.filter(p => p.status !== 'cancelado').map((p, index) => (
                  <tr key={p.id} className="py-2">
                    <td className="py-2 font-heading font-bold">{index + 1}</td>
                    <td className="py-2 font-semibold text-jornada-navy">{p.full_name}</td>
                    <td className="py-2">{p.phone}</td>
                    <td className="py-2">{p.pickup_location}</td>
                    <td className="py-2"><Badge status={p.financial_status} /></td>
                    <td className="py-2 text-center text-jornada-muted">___________________________</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Conteúdo: Contatos de Emergência */}
        {reportType === 'emergency_contacts' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body border-collapse min-w-[500px]">
              <thead className="border-b-2 border-jornada-navy font-heading text-jornada-navy uppercase">
                <tr>
                  <th className="py-2">Passageiro</th>
                  <th className="py-2">Telefone</th>
                  <th className="py-2">Contato de Emergência</th>
                  <th className="py-2">Telefone Emergência</th>
                  <th className="py-2">Restrições / Observações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-jornada-border">
                {passengers.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 font-semibold text-jornada-navy">{p.full_name}</td>
                    <td className="py-2">{p.phone}</td>
                    <td className="py-2 font-semibold">{p.emergency_contact_name}</td>
                    <td className="py-2">{p.emergency_contact_phone}</td>
                    <td className="py-2 text-jornada-muted">{p.medical_info || p.notes || 'Nenhuma'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Rodapé da Impressão */}
        <div className="mt-8 pt-4 border-t border-jornada-border text-center text-[10px] font-body text-jornada-muted">
          Relatório gerado pelo sistema JORNADA • Gestão de excursões da sua igreja
        </div>
      </div>
    </div>
  );
}

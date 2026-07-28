'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  PlusCircle, 
  Download, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Input';

import { 
  getPayments, 
  getExpenses, 
  getExcursions, 
  getPassengers 
} from '@/lib/store';

import { Payment, Expense, Excursion, Passenger } from '@/types';

export default function FinancialGlobalPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [excursionFilter, setExcursionFilter] = useState('all');

  useEffect(() => {
    setPayments(getPayments());
    setExpenses(getExpenses());
    setExcursions(getExcursions());
    setPassengers(getPassengers());
  }, []);

  const filteredPayments = payments.filter(p => excursionFilter === 'all' || p.excursion_id === excursionFilter);
  const filteredExpenses = expenses.filter(e => excursionFilter === 'all' || e.excursion_id === excursionFilter);

  const totalReceived = filteredPayments.filter(p => p.status === 'pago').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = filteredPayments.filter(p => p.status === 'nao_pago' || p.status === 'atrasado').reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalReceived - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-jornada-border/80 shadow-xs">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-jornada-navy tracking-tight">
            Painel Financeiro Geral
          </h1>
          <p className="font-body text-xs text-jornada-muted mt-0.5">
            Visão unificada das arrecadações, despesas com transporte e saldo final por excursão.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <Select
            value={excursionFilter}
            onChange={(e) => setExcursionFilter(e.target.value)}
            options={[
              { label: 'Todas as Excursões', value: 'all' },
              ...excursions.map(e => ({ label: e.name, value: e.id }))
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm" className="border-l-4 border-l-jornada-green">
          <span className="font-heading text-xs text-jornada-muted block mb-1">Total Recebido</span>
          <span className="font-heading font-extrabold text-2xl text-jornada-green">
            R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </Card>

        <Card padding="sm" className="border-l-4 border-l-jornada-terracotta">
          <span className="font-heading text-xs text-jornada-muted block mb-1">Pendente a Receber</span>
          <span className="font-heading font-extrabold text-2xl text-jornada-terracotta">
            R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </Card>

        <Card padding="sm" className="border-l-4 border-l-jornada-red">
          <span className="font-heading text-xs text-jornada-muted block mb-1">Despesas Operacionais</span>
          <span className="font-heading font-extrabold text-2xl text-jornada-red">
            R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </Card>

        <Card padding="sm" className="border-l-4 border-l-jornada-navy">
          <span className="font-heading text-xs text-jornada-muted block mb-1">Saldo Líquido</span>
          <span className={`font-heading font-extrabold text-2xl ${netBalance >= 0 ? 'text-jornada-navy' : 'text-jornada-red'}`}>
            R$ {netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </Card>
      </div>

      <Card title="Últimos Pagamentos Lançados">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-body">
            <thead className="bg-jornada-ivory/60 font-heading text-jornada-navy uppercase border-b border-jornada-border">
              <tr>
                <th className="p-3">Passageiro</th>
                <th className="p-3">Excursão</th>
                <th className="p-3">Valor</th>
                <th className="p-3">Forma</th>
                <th className="p-3">Situação</th>
                <th className="p-3 text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-jornada-border/60">
              {filteredPayments.map(p => {
                const pass = passengers.find(pas => pas.id === p.passenger_id);
                const exc = excursions.find(e => e.id === p.excursion_id);

                return (
                  <tr key={p.id} className="hover:bg-jornada-ivory/30 transition-colors">
                    <td className="p-3 font-heading font-semibold text-jornada-navy">{pass?.full_name || 'Passageiro'}</td>
                    <td className="p-3 text-jornada-muted">{exc?.name || 'Excursão'}</td>
                    <td className="p-3 font-heading font-bold text-jornada-green">R$ {p.amount.toFixed(2)}</td>
                    <td className="p-3">{p.payment_method}</td>
                    <td className="p-3"><Badge status={p.status} /></td>
                    <td className="p-3 text-right">
                      {p.status === 'pago' && (
                        <Link href={`/recibo/${p.id}`} target="_blank">
                          <Button variant="outline" size="sm">Emitir Recibo</Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

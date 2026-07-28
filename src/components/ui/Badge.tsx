import React from 'react';
import { clsx } from 'clsx';
import { 
  PassengerStatus, 
  FinancialStatus, 
  ExcursionStatus, 
  ReviewStatus 
} from '@/types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted';
  size?: 'sm' | 'md';
  status?: PassengerStatus | FinancialStatus | ExcursionStatus | ReviewStatus | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  size = 'md',
  status,
  className = ''
}) => {
  let resolvedVariant = variant || 'default';
  let label = children;

  if (status) {
    switch (status) {
      // Excursão
      case 'open':
        resolvedVariant = 'success';
        label = label || 'Inscrições Abertas';
        break;
      case 'full':
        resolvedVariant = 'warning';
        label = label || 'Esgotada';
        break;
      case 'completed':
        resolvedVariant = 'info';
        label = label || 'Concluída';
        break;
      case 'draft':
        resolvedVariant = 'muted';
        label = label || 'Rascunho';
        break;
      case 'cancelled':
      case 'archived':
        resolvedVariant = 'danger';
        label = label || 'Cancelada / Arquivada';
        break;

      // Passageiro
      case 'confirmado':
        resolvedVariant = 'success';
        label = label || 'Confirmado';
        break;
      case 'vaga_reservada':
        resolvedVariant = 'warning';
        label = label || 'Reserva Pendente';
        break;
      case 'aguardando_confirmacao':
        resolvedVariant = 'info';
        label = label || 'Aguardando Análise';
        break;
      case 'lista_espera':
        resolvedVariant = 'warning';
        label = label || 'Lista de Espera';
        break;
      case 'nao_compareceu':
        resolvedVariant = 'danger';
        label = label || 'Não Compareceu';
        break;

      // Financeiro
      case 'pago':
      case 'approved':
        resolvedVariant = 'success';
        label = label || 'Pago / Aprovado';
        break;
      case 'parcialmente_pago':
        resolvedVariant = 'info';
        label = label || 'Parcialmente Pago';
        break;
      case 'aguardando_analise':
      case 'pending':
        resolvedVariant = 'warning';
        label = label || 'Aguardando Análise';
        break;
      case 'nao_pago':
        resolvedVariant = 'muted';
        label = label || 'Não Pago';
        break;
      case 'atrasado':
      case 'rejected':
        resolvedVariant = 'danger';
        label = label || 'Atrasado / Rejeitado';
        break;
      case 'isento':
        resolvedVariant = 'info';
        label = label || 'Isento';
        break;

      default:
        break;
    }
  }

  const variantStyles = {
    default: "bg-jornada-ivory text-jornada-navy border border-jornada-border",
    success: "bg-[#E8F3EE] text-jornada-green border border-jornada-green/20",
    warning: "bg-[#FDF4E7] text-[#C45D3C] border border-[#C45D3C]/20",
    danger: "bg-[#FCEBEB] text-jornada-red border border-jornada-red/20",
    info: "bg-[#EBF2F7] text-jornada-navy border border-jornada-navy/20",
    muted: "bg-gray-100 text-gray-700 border border-gray-200"
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-heading font-medium rounded",
    md: "px-2.5 py-1 text-xs font-heading font-semibold rounded-md"
  };

  return (
    <span className={clsx(
      "inline-flex items-center gap-1 leading-none select-none shrink-0",
      variantStyles[resolvedVariant],
      sizeStyles[size],
      className
    )}>
      {label}
    </span>
  );
};

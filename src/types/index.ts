// Definições de Tipos para o Sistema JORNADA - Gestão de Excursões de Igreja

export type UserRole = 'admin' | 'organizer' | 'financial' | 'viewer';

export type ExcursionStatus = 'draft' | 'open' | 'full' | 'completed' | 'archived' | 'cancelled';

export type PassengerStatus = 
  | 'aguardando_confirmacao' 
  | 'vaga_reservada' 
  | 'confirmado' 
  | 'lista_espera' 
  | 'cancelado' 
  | 'nao_compareceu';

export type FinancialStatus = 
  | 'nao_pago' 
  | 'parcialmente_pago' 
  | 'aguardando_analise' 
  | 'pago' 
  | 'atrasado' 
  | 'isento' 
  | 'cancelado' 
  | 'reembolsado';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type DocumentCategory = 'contract' | 'minor_auth' | 'vehicle_doc' | 'list' | 'quote' | 'other';

export interface Church {
  id: string;
  name: string;
  logo_url?: string | null;
  address?: string | null;
  phone?: string | null;
  main_responsible?: string | null;
  pix_key?: string | null;
  pix_favored?: string | null;
  pix_bank?: string | null;
  pix_message?: string | null;
  cancellation_policy?: string | null;
  reservation_validity_days: number;
  receipt_prefix: string;
  mandatory_fields: string[];
  created_at: string;
  updated_at: string;
}

export interface ChurchUser {
  id: string;
  user_id?: string;
  church_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
}

export interface Excursion {
  id: string;
  church_id: string;
  name: string;
  description?: string;
  responsible_department?: string;
  destination: string;
  destination_address?: string;
  travel_date: string;
  return_date?: string;
  meeting_time?: string;
  departure_time?: string;
  return_time?: string;
  main_pickup_location: string;
  additional_pickups: string[];
  total_seats: number;
  price_per_passenger: number;
  payment_deadline?: string;
  cancellation_policy?: string;
  notes?: string;
  leader_name: string;
  leader_phone: string;
  transport_type: string;
  status: ExcursionStatus;
  requires_manual_approval: boolean;
  public_code: string;
  created_at: string;
  updated_at: string;
}

export interface SeatMapConfig {
  rows: number;
  columns: number;
  type: 'bus' | 'minibus' | 'van' | 'custom';
  disabledSeats: string[];
}

export interface Vehicle {
  id: string;
  excursion_id: string;
  church_id: string;
  identification: string;
  plate?: string;
  capacity: number;
  driver_name?: string;
  driver_phone?: string;
  company?: string;
  notes?: string;
  seat_map?: SeatMapConfig;
  created_at: string;
}

export interface Passenger {
  id: string;
  excursion_id: string;
  church_id: string;
  vehicle_id?: string | null;
  seat_number?: string | null;
  full_name: string;
  phone: string;
  email?: string;
  birth_date?: string;
  document_number?: string;
  church_congregation?: string;
  department?: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  pickup_location: string;
  notes?: string;
  accessibility_needs?: string;
  dietary_restrictions?: string;
  medical_info?: string;
  is_minor: boolean;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_document?: string;
  guardian_authorized?: boolean;
  status: PassengerStatus;
  financial_status: FinancialStatus;
  lookup_token: string;
  presence_checked_in: boolean;
  checked_in_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  passenger_id: string;
  excursion_id: string;
  church_id: string;
  amount: number;
  due_date?: string;
  payment_date?: string;
  payment_method: string;
  status: FinancialStatus;
  installment_number: number;
  total_installments: number;
  notes?: string;
  created_by?: string;
  receipt_number?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentReceipt {
  id: string;
  payment_id: string;
  passenger_id: string;
  excursion_id: string;
  church_id: string;
  storage_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  notes?: string;
  review_status: ReviewStatus;
  review_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface Expense {
  id: string;
  excursion_id: string;
  church_id: string;
  category: string;
  description: string;
  amount: number;
  status: 'pago' | 'pendente';
  expense_date: string;
  notes?: string;
  receipt_url?: string;
  created_at: string;
}

export interface ExcursionDocument {
  id: string;
  excursion_id: string;
  church_id: string;
  title: string;
  category: DocumentCategory;
  storage_path: string;
  file_name: string;
  file_size: number;
  access_level: string;
  uploaded_by?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  church_id: string;
  user_id?: string;
  user_name: string;
  action: string;
  target_type: string;
  target_id?: string;
  details?: Record<string, any>;
  created_at: string;
}

export interface MessageTemplate {
  id: string;
  church_id: string;
  title: string;
  template_type: string;
  content: string;
  updated_at: string;
}

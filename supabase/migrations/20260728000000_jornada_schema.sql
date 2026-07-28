-- Migration SQL para o sistema JORNADA - Gestão de Excursões de Igreja
-- Criação de tabelas, relacionamentos, enum, índices e políticas de segurança RLS (Row Level Security)

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'organizer', 'financial', 'viewer');
CREATE TYPE excursion_status AS ENUM ('draft', 'open', 'full', 'completed', 'archived', 'cancelled');
CREATE TYPE passenger_status AS ENUM ('aguardando_confirmacao', 'vaga_reservada', 'confirmado', 'lista_espera', 'cancelado', 'nao_compareceu');
CREATE TYPE financial_status AS ENUM ('nao_pago', 'parcialmente_pago', 'aguardando_analise', 'pago', 'atrasado', 'isento', 'cancelado', 'reembolsado');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE document_category AS ENUM ('contract', 'minor_auth', 'vehicle_doc', 'list', 'quote', 'other');

-- 3. TABELA DE IGREJAS / ORGANIZAÇÕES
CREATE TABLE IF NOT EXISTS churches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  address TEXT,
  phone TEXT,
  main_responsible TEXT,
  pix_key TEXT,
  pix_favored TEXT,
  pix_bank TEXT,
  pix_message TEXT,
  cancellation_policy TEXT,
  reservation_validity_days INTEGER DEFAULT 3,
  receipt_prefix TEXT DEFAULT 'REC-',
  mandatory_fields JSONB DEFAULT '["phone", "document_number"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE USUÁRIOS DA IGREJA (PERFIS)
CREATE TABLE IF NOT EXISTS church_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'admin' NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE EXCURSÕES
CREATE TABLE IF NOT EXISTS excursions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  responsible_department TEXT,
  destination TEXT NOT NULL,
  destination_address TEXT,
  travel_date TIMESTAMPTZ NOT NULL,
  meeting_time TEXT,
  departure_time TEXT,
  return_time TEXT,
  main_pickup_location TEXT NOT NULL,
  additional_pickups JSONB DEFAULT '[]'::jsonb,
  total_seats INTEGER NOT NULL DEFAULT 40,
  price_per_passenger NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  payment_deadline TIMESTAMPTZ,
  cancellation_policy TEXT,
  notes TEXT,
  leader_name TEXT NOT NULL,
  leader_phone TEXT NOT NULL,
  transport_type TEXT DEFAULT 'Ônibus Executivo',
  status excursion_status DEFAULT 'open' NOT NULL,
  requires_manual_approval BOOLEAN DEFAULT TRUE,
  public_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABELA DE VEÍCULOS
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  excursion_id UUID REFERENCES excursions(id) ON DELETE CASCADE NOT NULL,
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  identification TEXT NOT NULL,
  plate TEXT,
  capacity INTEGER NOT NULL DEFAULT 46,
  driver_name TEXT,
  driver_phone TEXT,
  company TEXT,
  notes TEXT,
  seat_map JSONB DEFAULT '{"rows": 11, "columns": 4, "type": "bus", "disabledSeats": []}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABELA DE PASSAGEIROS
CREATE TABLE IF NOT EXISTS passengers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  excursion_id UUID REFERENCES excursions(id) ON DELETE CASCADE NOT NULL,
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  seat_number TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  birth_date DATE,
  document_number TEXT,
  church_congregation TEXT,
  department TEXT,
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  notes TEXT,
  accessibility_needs TEXT,
  dietary_restrictions TEXT,
  medical_info TEXT,
  is_minor BOOLEAN DEFAULT FALSE,
  guardian_name TEXT,
  guardian_phone TEXT,
  guardian_document TEXT,
  guardian_authorized BOOLEAN DEFAULT FALSE,
  status passenger_status DEFAULT 'aguardando_confirmacao' NOT NULL,
  financial_status financial_status DEFAULT 'nao_pago' NOT NULL,
  lookup_token TEXT UNIQUE NOT NULL,
  presence_checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABELA DE PAGAMENTOS
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passenger_id UUID REFERENCES passengers(id) ON DELETE CASCADE NOT NULL,
  excursion_id UUID REFERENCES excursions(id) ON DELETE CASCADE NOT NULL,
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  due_date DATE,
  payment_date TIMESTAMPTZ,
  payment_method TEXT DEFAULT 'Pix',
  status financial_status DEFAULT 'nao_pago' NOT NULL,
  installment_number INTEGER DEFAULT 1,
  total_installments INTEGER DEFAULT 1,
  notes TEXT,
  created_by UUID,
  receipt_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABELA DE COMPROVANTES DE PAGAMENTO
CREATE TABLE IF NOT EXISTS payment_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE NOT NULL,
  passenger_id UUID REFERENCES passengers(id) ON DELETE CASCADE NOT NULL,
  excursion_id UUID REFERENCES excursions(id) ON DELETE CASCADE NOT NULL,
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by TEXT DEFAULT 'passageiro',
  notes TEXT,
  review_status review_status DEFAULT 'pending' NOT NULL,
  review_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABELA DE DESPESAS DA EXCURSÃO
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  excursion_id UUID REFERENCES excursions(id) ON DELETE CASCADE NOT NULL,
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL, -- ex: Aluguel de Veículo, Combustível, Pedágio, Alimentação Motorista, Estacionamento, Outros
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pago',
  expense_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABELA DE DOCUMENTOS DA EXCURSÃO
CREATE TABLE IF NOT EXISTS excursion_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  excursion_id UUID REFERENCES excursions(id) ON DELETE CASCADE NOT NULL,
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category document_category DEFAULT 'other' NOT NULL,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  access_level TEXT DEFAULT 'organizer',
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TABELA DE LOGS DE AUDITORIA
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  user_id UUID,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TABELA DE MODELOS DE MENSAGENS
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  template_type TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ÍNDICES DE DESEMPENHO
CREATE INDEX IF NOT EXISTS idx_church_users_user ON church_users(user_id);
CREATE INDEX IF NOT EXISTS idx_church_users_church ON church_users(church_id);
CREATE INDEX IF NOT EXISTS idx_excursions_church ON excursions(church_id);
CREATE INDEX IF NOT EXISTS idx_excursions_code ON excursions(public_code);
CREATE INDEX IF NOT EXISTS idx_passengers_excursion ON passengers(excursion_id);
CREATE INDEX IF NOT EXISTS idx_passengers_lookup ON passengers(lookup_token);
CREATE INDEX IF NOT EXISTS idx_payments_passenger ON payments(passenger_id);
CREATE INDEX IF NOT EXISTS idx_payment_receipts_payment ON payment_receipts(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_receipts_status ON payment_receipts(review_status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_church ON audit_logs(church_id);

-- 15. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE excursions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE excursion_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

-- 16. HELPER FUNCTION PARA PEGAR A IGREJA DO USUÁRIO LOGADO
CREATE OR REPLACE FUNCTION current_user_church_id()
RETURNS UUID AS $$
  SELECT church_id FROM church_users WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 17. POLÍTICAS RLS POR IGREJA
-- Excursões
CREATE POLICY "Acesso por igreja em excursions" ON excursions
  FOR ALL USING (church_id = current_user_church_id());

CREATE POLICY "Leitura publica de excursoes ativas" ON excursions
  FOR SELECT USING (status = 'open' OR status = 'full');

-- Veículos
CREATE POLICY "Acesso por igreja em vehicles" ON vehicles
  FOR ALL USING (church_id = current_user_church_id());

-- Passageiros
CREATE POLICY "Acesso por igreja em passengers" ON passengers
  FOR ALL USING (church_id = current_user_church_id());

CREATE POLICY "Acesso publico por token de consulta de passageiro" ON passengers
  FOR SELECT USING (lookup_token IS NOT NULL);

CREATE POLICY "Insercao publica de inscricoes" ON passengers
  FOR INSERT WITH CHECK (TRUE);

-- Pagamentos
CREATE POLICY "Acesso por igreja em payments" ON payments
  FOR ALL USING (church_id = current_user_church_id());

-- Comprovantes
CREATE POLICY "Acesso por igreja em payment_receipts" ON payment_receipts
  FOR ALL USING (church_id = current_user_church_id());

CREATE POLICY "Insercao de comprovante por passageiro" ON payment_receipts
  FOR INSERT WITH CHECK (TRUE);

-- Despesas
CREATE POLICY "Acesso por igreja em expenses" ON expenses
  FOR ALL USING (church_id = current_user_church_id());

-- Documentos
CREATE POLICY "Acesso por igreja em excursion_documents" ON excursion_documents
  FOR ALL USING (church_id = current_user_church_id());

-- Logs de Auditoria
CREATE POLICY "Acesso por igreja em audit_logs" ON audit_logs
  FOR ALL USING (church_id = current_user_church_id());

-- Modelos de Mensagens
CREATE POLICY "Acesso por igreja em message_templates" ON message_templates
  FOR ALL USING (church_id = current_user_church_id());

-- Igrejas e Perfis
CREATE POLICY "Acesso por usuario no seu perfil" ON church_users
  FOR ALL USING (user_id = auth.uid() OR church_id = current_user_church_id());

CREATE POLICY "Acesso por igreja em churches" ON churches
  FOR ALL USING (id = current_user_church_id());

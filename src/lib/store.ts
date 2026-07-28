// Storage & Data Service para o JORNADA
import { 
  Church, 
  ChurchUser, 
  Excursion, 
  Vehicle, 
  Passenger, 
  Payment, 
  PaymentReceipt, 
  Expense, 
  ExcursionDocument, 
  AuditLog, 
  MessageTemplate 
} from '@/types';

// Chaves do localStorage
const KEYS = {
  CURRENT_CHURCH: 'jornada_current_church',
  CURRENT_USER: 'jornada_current_user',
  USERS: 'jornada_users',
  EXCURSIONS: 'jornada_excursions',
  VEHICLES: 'jornada_vehicles',
  PASSENGERS: 'jornada_passengers',
  PAYMENTS: 'jornada_payments',
  RECEIPTS: 'jornada_receipts',
  EXPENSES: 'jornada_expenses',
  DOCUMENTS: 'jornada_documents',
  AUDIT_LOGS: 'jornada_audit_logs',
  TEMPLATES: 'jornada_templates',
  CHECKIN_QUEUE: 'jornada_offline_checkins'
};

// Funções Auxiliares de LocalStorage
function getStored<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Erro ao ler localStorage [${key}]:`, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Erro ao gravar localStorage [${key}]:`, e);
  }
}

// Inicialização da Igreja Padrão
export function getInitialChurch(): Church {
  const stored = getStored<Church | null>(KEYS.CURRENT_CHURCH, null);
  if (stored) return stored;

  const defaultChurch: Church = {
    id: 'church-1',
    name: 'Igreja Evangélica Central',
    logo_url: null,
    address: 'Av. Principal, 1000 - Centro',
    phone: '(11) 98765-4321',
    main_responsible: 'Pr. Carlos Eduardo',
    pix_key: '12.345.678/0001-90',
    pix_favored: 'Igreja Evangélica Central',
    pix_bank: 'Banco Bradesco',
    pix_message: 'Pagamento de excursão - informe seu nome na descrição',
    cancellation_policy: 'Cancelamentos com até 7 dias de antecedência têm 100% de reembolso. Após essa data, haverá retenção da taxa de reserva de 20%.',
    reservation_validity_days: 3,
    receipt_prefix: 'REC-',
    mandatory_fields: ['phone', 'emergency_contact_name', 'emergency_contact_phone'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  setStored(KEYS.CURRENT_CHURCH, defaultChurch);
  return defaultChurch;
}

export function updateChurchConfig(updated: Partial<Church>): Church {
  const current = getInitialChurch();
  const newChurch: Church = {
    ...current,
    ...updated,
    updated_at: new Date().toISOString()
  };
  setStored(KEYS.CURRENT_CHURCH, newChurch);
  addAuditLog('Edição de configurações da igreja', 'church', newChurch.id, updated);
  return newChurch;
}

// Usuário Atual & Autenticação Simada / Supabase
export function getCurrentUser(): ChurchUser | null {
  return getStored<ChurchUser | null>(KEYS.CURRENT_USER, {
    id: 'user-admin-1',
    user_id: 'auth-admin-1',
    church_id: 'church-1',
    full_name: 'Administrador Principal',
    email: 'admin@igreja.org.br',
    phone: '(11) 99999-8888',
    role: 'admin',
    status: 'active',
    created_at: new Date().toISOString()
  });
}

export function setCurrentUser(user: ChurchUser | null): void {
  setStored(KEYS.CURRENT_USER, user);
}

export function getChurchUsers(): ChurchUser[] {
  return getStored<ChurchUser[]>(KEYS.USERS, [
    {
      id: 'user-admin-1',
      church_id: 'church-1',
      full_name: 'Administrador Principal',
      email: 'admin@igreja.org.br',
      phone: '(11) 99999-8888',
      role: 'admin',
      status: 'active',
      created_at: new Date().toISOString()
    }
  ]);
}

export function saveChurchUser(user: Omit<ChurchUser, 'id' | 'created_at'>): ChurchUser {
  const users = getChurchUsers();
  const newUser: ChurchUser = {
    ...user,
    id: 'user-' + Date.now(),
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  setStored(KEYS.USERS, users);
  addAuditLog(`Convite de usuário (${newUser.email}) com papel ${newUser.role}`, 'user', newUser.id);
  return newUser;
}

export function updateChurchUserRole(userId: string, role: ChurchUser['role']): void {
  const users = getChurchUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index].role = role;
    setStored(KEYS.USERS, users);
    addAuditLog(`Alteração de permissão do usuário para ${role}`, 'user', userId);
  }
}

export function removeChurchUser(userId: string): void {
  let users = getChurchUsers();
  users = users.filter(u => u.id !== userId);
  setStored(KEYS.USERS, users);
  addAuditLog(`Remoção de usuário`, 'user', userId);
}

// EXCURSÕES
export function getExcursions(): Excursion[] {
  return getStored<Excursion[]>(KEYS.EXCURSIONS, []);
}

export function getExcursionById(id: string): Excursion | null {
  const items = getExcursions();
  return items.find(item => item.id === id) || null;
}

export function getExcursionByPublicCode(code: string): Excursion | null {
  const items = getExcursions();
  return items.find(item => item.public_code === code) || null;
}

export function saveExcursion(data: Omit<Excursion, 'id' | 'church_id' | 'public_code' | 'created_at' | 'updated_at'>): Excursion {
  const excursions = getExcursions();
  const church = getInitialChurch();
  
  const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const newExcursion: Excursion = {
    ...data,
    id: 'exc-' + Date.now(),
    church_id: church.id,
    public_code: randomCode,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  excursions.unshift(newExcursion);
  setStored(KEYS.EXCURSIONS, excursions);

  // Criar veículo padrão se total_seats > 0
  if (data.total_seats > 0) {
    saveVehicle({
      excursion_id: newExcursion.id,
      identification: 'Veículo Principal (Ônibus 01)',
      capacity: data.total_seats,
      company: 'Empresa de Transporte Responsável',
      seat_map: {
        rows: Math.ceil(data.total_seats / 4),
        columns: 4,
        type: 'bus',
        disabledSeats: []
      }
    });
  }

  addAuditLog(`Criação da excursão: ${newExcursion.name}`, 'excursion', newExcursion.id);
  return newExcursion;
}

export function updateExcursion(id: string, data: Partial<Excursion>): Excursion | null {
  const excursions = getExcursions();
  const index = excursions.findIndex(e => e.id === id);
  if (index === -1) return null;

  const updated: Excursion = {
    ...excursions[index],
    ...data,
    updated_at: new Date().toISOString()
  };

  excursions[index] = updated;
  setStored(KEYS.EXCURSIONS, excursions);
  addAuditLog(`Atualização da excursão: ${updated.name}`, 'excursion', id);
  return updated;
}

export function duplicateExcursion(id: string): Excursion | null {
  const original = getExcursionById(id);
  if (!original) return null;

  const copy = saveExcursion({
    ...original,
    name: `${original.name} (Cópia)`,
    status: 'draft',
  });

  return copy;
}

// VEÍCULOS
export function getVehicles(excursionId?: string): Vehicle[] {
  const vehicles = getStored<Vehicle[]>(KEYS.VEHICLES, []);
  if (excursionId) {
    return vehicles.filter(v => v.excursion_id === excursionId);
  }
  return vehicles;
}

export function saveVehicle(data: Omit<Vehicle, 'id' | 'church_id' | 'created_at'>): Vehicle {
  const vehicles = getStored<Vehicle[]>(KEYS.VEHICLES, []);
  const church = getInitialChurch();

  const newVehicle: Vehicle = {
    ...data,
    id: 'veh-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    church_id: church.id,
    created_at: new Date().toISOString()
  };

  vehicles.push(newVehicle);
  setStored(KEYS.VEHICLES, vehicles);
  addAuditLog(`Adição do veículo: ${newVehicle.identification}`, 'vehicle', newVehicle.id);
  return newVehicle;
}

export function updateVehicle(id: string, data: Partial<Vehicle>): Vehicle | null {
  const vehicles = getStored<Vehicle[]>(KEYS.VEHICLES, []);
  const index = vehicles.findIndex(v => v.id === id);
  if (index === -1) return null;

  vehicles[index] = { ...vehicles[index], ...data };
  setStored(KEYS.VEHICLES, vehicles);
  return vehicles[index];
}

export function deleteVehicle(id: string): void {
  let vehicles = getStored<Vehicle[]>(KEYS.VEHICLES, []);
  vehicles = vehicles.filter(v => v.id !== id);
  setStored(KEYS.VEHICLES, vehicles);
}

// PASSAGEIROS
export function getPassengers(excursionId?: string): Passenger[] {
  const passengers = getStored<Passenger[]>(KEYS.PASSENGERS, []);
  if (excursionId) {
    return passengers.filter(p => p.excursion_id === excursionId);
  }
  return passengers;
}

export function getPassengerByToken(token: string): Passenger | null {
  const passengers = getStored<Passenger[]>(KEYS.PASSENGERS, []);
  return passengers.find(p => p.lookup_token === token) || null;
}

export function savePassenger(data: Omit<Passenger, 'id' | 'church_id' | 'lookup_token' | 'created_at' | 'updated_at'>): Passenger {
  const passengers = getStored<Passenger[]>(KEYS.PASSENGERS, []);
  const church = getInitialChurch();
  const token = 'PAS-' + Math.random().toString(36).substring(2, 10).toUpperCase();

  const newPassenger: Passenger = {
    ...data,
    id: 'pas-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    church_id: church.id,
    lookup_token: token,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  passengers.unshift(newPassenger);
  setStored(KEYS.PASSENGERS, passengers);

  // Criar cobrança/pagamento padrão associado
  const excursion = getExcursionById(data.excursion_id);
  if (excursion && excursion.price_per_passenger > 0) {
    savePayment({
      passenger_id: newPassenger.id,
      excursion_id: data.excursion_id,
      amount: excursion.price_per_passenger,
      due_date: excursion.payment_deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      payment_method: 'Pix',
      status: 'nao_pago',
      installment_number: 1,
      total_installments: 1
    });
  }

  addAuditLog(`Cadastro de passageiro: ${newPassenger.full_name}`, 'passenger', newPassenger.id);
  return newPassenger;
}

export function updatePassenger(id: string, data: Partial<Passenger>): Passenger | null {
  const passengers = getStored<Passenger[]>(KEYS.PASSENGERS, []);
  const index = passengers.findIndex(p => p.id === id);
  if (index === -1) return null;

  const updated: Passenger = {
    ...passengers[index],
    ...data,
    updated_at: new Date().toISOString()
  };

  passengers[index] = updated;
  setStored(KEYS.PASSENGERS, passengers);
  return updated;
}

export function batchUpdatePassengers(ids: string[], updates: Partial<Passenger>): void {
  const passengers = getStored<Passenger[]>(KEYS.PASSENGERS, []);
  let updatedCount = 0;

  const newPassengers = passengers.map(p => {
    if (ids.includes(p.id)) {
      updatedCount++;
      return { ...p, ...updates, updated_at: new Date().toISOString() };
    }
    return p;
  });

  setStored(KEYS.PASSENGERS, newPassengers);
  addAuditLog(`Atualização em lote de ${updatedCount} passageiros`, 'passenger');
}

export function deletePassenger(id: string): void {
  let passengers = getStored<Passenger[]>(KEYS.PASSENGERS, []);
  passengers = passengers.filter(p => p.id !== id);
  setStored(KEYS.PASSENGERS, passengers);
  addAuditLog(`Exclusão de passageiro ID ${id}`, 'passenger', id);
}

// PAGAMENTOS
export function getPayments(excursionId?: string): Payment[] {
  const payments = getStored<Payment[]>(KEYS.PAYMENTS, []);
  if (excursionId) {
    return payments.filter(p => p.excursion_id === excursionId);
  }
  return payments;
}

export function getPaymentsByPassenger(passengerId: string): Payment[] {
  const payments = getStored<Payment[]>(KEYS.PAYMENTS, []);
  return payments.filter(p => p.passenger_id === passengerId);
}

export function savePayment(data: Omit<Payment, 'id' | 'church_id' | 'created_at' | 'updated_at'>): Payment {
  const payments = getStored<Payment[]>(KEYS.PAYMENTS, []);
  const church = getInitialChurch();
  const receiptNum = church.receipt_prefix + (payments.length + 1001);

  const newPayment: Payment = {
    ...data,
    id: 'pay-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    church_id: church.id,
    receipt_number: receiptNum,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  payments.unshift(newPayment);
  setStored(KEYS.PAYMENTS, payments);

  // Atualizar o status financeiro do passageiro
  updatePassengerFinancialStatus(data.passenger_id);

  addAuditLog(`Registro de pagamento de R$ ${data.amount.toFixed(2)}`, 'payment', newPayment.id);
  return newPayment;
}

export function updatePayment(id: string, data: Partial<Payment>): Payment | null {
  const payments = getStored<Payment[]>(KEYS.PAYMENTS, []);
  const index = payments.findIndex(p => p.id === id);
  if (index === -1) return null;

  const updated: Payment = {
    ...payments[index],
    ...data,
    updated_at: new Date().toISOString()
  };

  payments[index] = updated;
  setStored(KEYS.PAYMENTS, payments);

  updatePassengerFinancialStatus(updated.passenger_id);
  return updated;
}

export function updatePassengerFinancialStatus(passengerId: string): void {
  const passengerPayments = getPaymentsByPassenger(passengerId);
  if (passengerPayments.length === 0) return;

  const totalPaid = passengerPayments
    .filter(p => p.status === 'pago')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = passengerPayments
    .filter(p => p.status === 'nao_pago' || p.status === 'atrasado')
    .reduce((sum, p) => sum + p.amount, 0);

  const hasReview = passengerPayments.some(p => p.status === 'aguardando_analise');

  let newStatus: Passenger['financial_status'] = 'nao_pago';

  if (totalPending === 0 && totalPaid > 0) {
    newStatus = 'pago';
  } else if (totalPaid > 0 && totalPending > 0) {
    newStatus = 'parcialmente_pago';
  } else if (hasReview) {
    newStatus = 'aguardando_analise';
  } else if (passengerPayments.some(p => p.status === 'isento')) {
    newStatus = 'isento';
  }

  updatePassenger(passengerId, { financial_status: newStatus });
}

// COMPROVANTES
export function getReceipts(excursionId?: string): PaymentReceipt[] {
  const receipts = getStored<PaymentReceipt[]>(KEYS.RECEIPTS, []);
  if (excursionId) {
    return receipts.filter(r => r.excursion_id === excursionId);
  }
  return receipts;
}

export function saveReceipt(data: Omit<PaymentReceipt, 'id' | 'church_id' | 'created_at'>): PaymentReceipt {
  const receipts = getStored<PaymentReceipt[]>(KEYS.RECEIPTS, []);
  const church = getInitialChurch();

  const newReceipt: PaymentReceipt = {
    ...data,
    id: 'rec-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    church_id: church.id,
    created_at: new Date().toISOString()
  };

  receipts.unshift(newReceipt);
  setStored(KEYS.RECEIPTS, receipts);

  // Atualiza o status do pagamento para 'aguardando_analise'
  updatePayment(data.payment_id, { status: 'aguardando_analise' });

  addAuditLog(`Comprovante enviado para o pagamento ${data.payment_id}`, 'receipt', newReceipt.id);
  return newReceipt;
}

export function reviewReceipt(receiptId: string, status: 'approved' | 'rejected', notes?: string, reviewerName: string = 'Administrador'): void {
  const receipts = getReceipts();
  const index = receipts.findIndex(r => r.id === receiptId);
  if (index === -1) return;

  const target = receipts[index];
  target.review_status = status;
  target.review_notes = notes;
  target.reviewed_by = reviewerName;
  target.reviewed_at = new Date().toISOString();

  receipts[index] = target;
  setStored(KEYS.RECEIPTS, receipts);

  if (status === 'approved') {
    updatePayment(target.payment_id, { 
      status: 'pago', 
      payment_date: new Date().toISOString() 
    });
    addAuditLog(`Comprovante APROVADO por ${reviewerName}`, 'receipt', receiptId);
  } else {
    updatePayment(target.payment_id, { status: 'nao_pago' });
    addAuditLog(`Comprovante REJEITADO por ${reviewerName}. Motivo: ${notes || 'Sem observação'}`, 'receipt', receiptId);
  }
}

export function deleteReceipt(receiptId: string): void {
  let receipts = getReceipts();
  receipts = receipts.filter(r => r.id !== receiptId);
  setStored(KEYS.RECEIPTS, receipts);
  addAuditLog(`Comprovante excluído ID ${receiptId}`, 'receipt', receiptId);
}

// DESPESAS
export function getExpenses(excursionId?: string): Expense[] {
  const expenses = getStored<Expense[]>(KEYS.EXPENSES, []);
  if (excursionId) {
    return expenses.filter(e => e.excursion_id === excursionId);
  }
  return expenses;
}

export function saveExpense(data: Omit<Expense, 'id' | 'church_id' | 'created_at'>): Expense {
  const expenses = getStored<Expense[]>(KEYS.EXPENSES, []);
  const church = getInitialChurch();

  const newExpense: Expense = {
    ...data,
    id: 'exp-' + Date.now(),
    church_id: church.id,
    created_at: new Date().toISOString()
  };

  expenses.unshift(newExpense);
  setStored(KEYS.EXPENSES, expenses);
  addAuditLog(`Despesa lançada: ${data.description} (R$ ${data.amount})`, 'expense', newExpense.id);
  return newExpense;
}

export function deleteExpense(id: string): void {
  let expenses = getStored<Expense[]>(KEYS.EXPENSES, []);
  expenses = expenses.filter(e => e.id !== id);
  setStored(KEYS.EXPENSES, expenses);
}

// DOCUMENTOS
export function getDocuments(excursionId?: string): ExcursionDocument[] {
  const docs = getStored<ExcursionDocument[]>(KEYS.DOCUMENTS, []);
  if (excursionId) {
    return docs.filter(d => d.excursion_id === excursionId);
  }
  return docs;
}

export function saveDocument(data: Omit<ExcursionDocument, 'id' | 'church_id' | 'created_at'>): ExcursionDocument {
  const docs = getStored<ExcursionDocument[]>(KEYS.DOCUMENTS, []);
  const church = getInitialChurch();

  const newDoc: ExcursionDocument = {
    ...data,
    id: 'doc-' + Date.now(),
    church_id: church.id,
    created_at: new Date().toISOString()
  };

  docs.unshift(newDoc);
  setStored(KEYS.DOCUMENTS, docs);
  addAuditLog(`Documento anexado: ${newDoc.title}`, 'document', newDoc.id);
  return newDoc;
}

export function deleteDocument(id: string): void {
  let docs = getStored<ExcursionDocument[]>(KEYS.DOCUMENTS, []);
  docs = docs.filter(d => d.id !== id);
  setStored(KEYS.DOCUMENTS, docs);
}

// LOGS DE AUDITORIA
export function getAuditLogs(): AuditLog[] {
  return getStored<AuditLog[]>(KEYS.AUDIT_LOGS, []);
}

export function addAuditLog(action: string, targetType: string, targetId?: string, details?: Record<string, any>): void {
  const logs = getAuditLogs();
  const user = getCurrentUser();
  const church = getInitialChurch();

  const newLog: AuditLog = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    church_id: church.id,
    user_id: user?.id,
    user_name: user?.full_name || 'Sistema / Usuário',
    action,
    target_type: targetType,
    target_id: targetId,
    details,
    created_at: new Date().toISOString()
  };

  logs.unshift(newLog);
  // Manter no máximo 200 logs locais
  setStored(KEYS.AUDIT_LOGS, logs.slice(0, 200));
}

// CHECK-IN OFFLINE SYNC QUEUE
export function queueOfflineCheckin(passengerId: string, status: boolean): void {
  const queue = getStored<{ id: string; checked_in: boolean; timestamp: string }[]>(KEYS.CHECKIN_QUEUE, []);
  queue.push({
    id: passengerId,
    checked_in: status,
    timestamp: new Date().toISOString()
  });
  setStored(KEYS.CHECKIN_QUEUE, queue);
}

export function syncOfflineCheckins(): number {
  const queue = getStored<{ id: string; checked_in: boolean; timestamp: string }[]>(KEYS.CHECKIN_QUEUE, []);
  if (queue.length === 0) return 0;

  queue.forEach(item => {
    updatePassenger(item.id, {
      presence_checked_in: item.checked_in,
      checked_in_at: item.timestamp
    });
  });

  setStored(KEYS.CHECKIN_QUEUE, []);
  return queue.length;
}

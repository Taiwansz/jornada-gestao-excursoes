'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, UserPlus, Shield, Trash2, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { getChurchUsers, saveChurchUser, updateChurchUserRole, removeChurchUser } from '@/lib/store';
import { ChurchUser, UserRole } from '@/types';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<ChurchUser[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('organizer');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(getChurchUsers());
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    saveChurchUser({
      church_id: 'church-1',
      full_name: fullName,
      email,
      phone,
      role,
      status: 'active'
    });

    setShowInviteModal(false);
    setFullName('');
    setEmail('');
    loadUsers();
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateChurchUserRole(userId, newRole);
    loadUsers();
  };

  const handleRemove = (userId: string) => {
    if (confirm('Tem certeza de que deseja remover o acesso deste usuário?')) {
      removeChurchUser(userId);
      loadUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-jornada-border/80 shadow-xs">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-jornada-navy tracking-tight">
            Gestão de Usuários & Níveis de Acesso
          </h1>
          <p className="font-body text-xs text-jornada-muted mt-0.5">
            Gerencie quem pode visualizar, organizar viagens ou registrar pagamentos na sua igreja.
          </p>
        </div>

        <Button variant="accent" icon={<UserPlus className="w-4 h-4" />} onClick={() => setShowInviteModal(true)}>
          Convidar Novo Usuário
        </Button>
      </div>

      {/* Tabela de Níveis e Usuários */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-body border-collapse">
            <thead className="bg-jornada-ivory/60 font-heading text-jornada-navy uppercase border-b border-jornada-border">
              <tr>
                <th className="p-3.5">Nome / E-mail</th>
                <th className="p-3.5">Telefone</th>
                <th className="p-3.5">Nível de Acesso</th>
                <th className="p-3.5">Situação</th>
                <th className="p-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-jornada-border/60">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-jornada-ivory/30 transition-colors">
                  <td className="p-3.5">
                    <span className="font-heading font-semibold text-sm text-jornada-navy block">{u.full_name}</span>
                    <span className="text-jornada-muted">{u.email}</span>
                  </td>
                  <td className="p-3.5 text-jornada-navy">{u.phone || 'N/A'}</td>
                  <td className="p-3.5">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="bg-white border border-jornada-border text-jornada-navy font-heading text-xs font-semibold rounded-md p-1.5 focus:outline-none"
                    >
                      <option value="admin">Administrador (Total)</option>
                      <option value="organizer">Organizador (Viagens/Passageiros)</option>
                      <option value="financial">Financeiro (Pagamentos/Comprovantes)</option>
                      <option value="viewer">Consulta (Leitura)</option>
                    </select>
                  </td>
                  <td className="p-3.5">
                    <Badge variant="success">Ativo</Badge>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleRemove(u.id)}
                      className="p-1.5 text-jornada-muted hover:text-jornada-red transition-colors"
                      title="Remover Acesso"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Convidar Usuário */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Convidar Novo Usuário"
        subtitle="O usuário receberá permissão para acessar o painel da sua igreja."
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <Input
            label="Nome Completo"
            placeholder="Ex: Ir. Marcos Paulo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="E-mail de Acesso"
            type="email"
            placeholder="marcos@igreja.org.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Telefone / WhatsApp"
            placeholder="(11) 98888-7777"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Select
            label="Nível de Permissão"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            options={[
              { label: 'Organizador (Gerencia excursões, passageiros e check-in)', value: 'organizer' },
              { label: 'Financeiro (Registra pagamentos e analisa comprovantes)', value: 'financial' },
              { label: 'Administrador (Acesso total)', value: 'admin' },
              { label: 'Consulta (Apenas visualiza informações)', value: 'viewer' },
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-jornada-border">
            <Button type="button" variant="ghost" onClick={() => setShowInviteModal(false)}>Cancelar</Button>
            <Button type="submit" variant="accent">Salvar Acesso</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

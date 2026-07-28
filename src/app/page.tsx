'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Users, 
  DollarSign, 
  Bus, 
  UserCheck, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  Clock, 
  Smartphone, 
  Lock, 
  Sparkles,
  FileCheck,
  Check
} from 'lucide-react';

import { LogoHorizontal } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activePreviewTab, setActivePreviewTab] = useState<'overview' | 'passengers' | 'receipts' | 'checkin'>('overview');

  const faqs = [
    {
      question: 'O JORNADA é adequado para igrejas de qual porte?',
      answer: 'O sistema foi desenvolvido especificamente para atender desde pequenas congregações locais organizando viagens pontuais de van ou micro-ônibus, até grandes ministérios e departamentos que realizam múltiplos comboios de ônibus executivos e retiros anuais.'
    },
    {
      question: 'Como funciona o envio de comprovantes pelos passageiros?',
      answer: 'Cada excursão possui um link público de inscrição. Ao se inscrever, o passageiro recebe um código único e seguro para acompanhar o status do pagamento, consultar os dados da chave Pix da igreja e anexar a foto ou PDF do comprovante sem ter acesso aos dados de outros irmãos.'
    },
    {
      question: 'É possível utilizar o sistema no celular durante cultos ou no dia da viagem?',
      answer: 'Sim, totalmente. O JORNADA foi planejado com prioridade para dispositivos móveis. No dia da viagem, o modo de check-in no celular possui botões amplos, busca rápida e funciona mesmo com conexão instável de internet, sincronizando os dados quando o sinal retornar.'
    },
    {
      question: 'Cada igreja visualiza apenas os seus próprios dados?',
      answer: 'Exatamente. Utilizamos arquitetura de isolamento multi-organização e políticas rigorosas de segurança em nível de banco de dados (Row Level Security). Nenhuma igreja tem acesso às informações, passageiros ou comprovantes de outra organização.'
    },
    {
      question: 'Como é feita a prestação de contas com a tesouraria da igreja?',
      answer: 'O sistema gera relatórios completos e limpos para impressão ou exportação em planilha. É possível registrar o aluguel dos veículos, combustível, pedágios e alimentação, fornecendo um fechamento financeiro exato com o saldo líquido da viagem.'
    }
  ];

  return (
    <div className="min-h-screen bg-jornada-ivory text-jornada-navy font-body antialiased selection:bg-jornada-terracotta selection:text-white">
      
      {/* 1. NAVEGAÇÃO PÚBLICA (HEADER) */}
      <header className="sticky top-0 z-50 bg-[#F6F2E9]/90 backdrop-blur-md border-b border-jornada-border/70 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="inline-block">
            <LogoHorizontal size="md" showSubtitle={true} />
          </Link>

          {/* Links Principais (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 font-heading text-xs font-semibold text-jornada-navy/80 tracking-wide">
            <a href="#como-funciona" className="hover:text-jornada-terracotta transition-colors">Como Funciona</a>
            <a href="#recursos" className="hover:text-jornada-terracotta transition-colors">Recursos</a>
            <a href="#beneficios" className="hover:text-jornada-terracotta transition-colors">Benefícios</a>
            <a href="#faq" className="hover:text-jornada-terracotta transition-colors">Dúvidas</a>
          </nav>

          {/* Botões de Acesso */}
          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-jornada-navy/20 hover:border-jornada-navy">
                Acessar o Sistema
              </Button>
            </Link>
            <Link href="/cadastro" className="hidden sm:inline-block">
              <Button variant="accent" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                Criar Conta da Igreja
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-8 overflow-hidden">
        {/* Arcos Decorativos Específicos da Arquitetura Tradicional */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-jornada-border/20 via-jornada-ivory/50 to-transparent rounded-b-[120px] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Badge Sábia e Sóbria */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-jornada-border/80 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-jornada-green animate-pulse" />
            <span className="font-heading font-semibold text-xs text-jornada-navy tracking-tight">
              Gestão de Excursões da sua Igreja
            </span>
          </div>

          {/* Headline Principal */}
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-jornada-navy tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Toda viagem começa com uma <span className="text-jornada-terracotta underline decoration-jornada-terracotta/30 underline-offset-8">boa organização.</span>
          </h1>

          {/* Descrição Concisa */}
          <p className="font-body text-base sm:text-lg text-jornada-muted max-w-2xl mx-auto leading-relaxed">
            Centralize listas de passageiros, pagamentos por Pix, comprovantes, frotas de ônibus e embarques em um sistema administrativo simples, seguro e sereno.
          </p>

          {/* Botões Principais de Conversão */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/cadastro" className="w-full sm:w-auto">
              <Button variant="accent" size="lg" className="w-full sm:w-auto shadow-md" icon={<ArrowRight className="w-4 h-4" />}>
                Criar Conta da Igreja
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Acessar o Painel
              </Button>
            </Link>
          </div>

          {/* Garantias Sóbrias */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-body text-jornada-muted">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-jornada-green" /> Isolamento por Igreja</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-jornada-green" /> Conformidade com LGPD</span>
            <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-jornada-navy" /> Otimizado para Celular</span>
          </div>
        </div>

        {/* 3. HERO MEDIA & DASHBOARD PREVIEW */}
        <div className="mt-12 max-w-6xl mx-auto">
          <div className="relative bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-jornada-border shadow-xl overflow-hidden">
            {/* Foto Autêntica de Comunidade de Igreja Brasileira */}
            <div className="relative h-64 sm:h-96 w-full rounded-xl sm:rounded-2xl overflow-hidden border border-jornada-border/60">
              <img 
                src="/images/jornada_hero_community.jpg" 
                alt="Comunidade de igreja reunida para viagem de comunhão" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jornada-navy/80 via-jornada-navy/20 to-transparent flex items-end p-6 sm:p-8">
                <div className="text-white space-y-1">
                  <span className="font-heading font-bold text-xs uppercase tracking-wider text-jornada-terracotta bg-white/90 px-2.5 py-0.5 rounded">
                    Organização & Comunhão
                  </span>
                  <h3 className="font-heading font-bold text-lg sm:text-2xl text-white tracking-tight">
                    Tranquilidade para liderança, ministérios e passageiros.
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEÇÃO DE BENEFÍCIOS PRINCIPAIS */}
      <section id="beneficios" className="py-16 sm:py-24 bg-white border-y border-jornada-border/70 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-jornada-terracotta">
              Por que escolher o JORNADA?
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-jornada-navy tracking-tight">
              Desenvolvido com foco na realidade das igrejas.
            </h2>
            <p className="font-body text-sm sm:text-base text-jornada-muted">
              Esqueça planilhas desformatadas, cadernos perdidos e mensagens dispersas. O JORNADA traz ordem e clareza.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Benefício 1 */}
            <div className="p-6 rounded-2xl bg-jornada-ivory/50 border border-jornada-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-jornada-navy text-white flex items-center justify-center font-heading font-bold text-sm">
                01
              </div>
              <h3 className="font-heading font-bold text-lg text-jornada-navy">Agilidade no Celular</h3>
              <p className="font-body text-xs sm:text-sm text-jornada-muted leading-relaxed">
                Adicione passageiros, confirme recebimentos e marque presença na lista de embarque diretamente pelo smartphone durante cultos ou reuniões.
              </p>
            </div>

            {/* Benefício 2 */}
            <div className="p-6 rounded-2xl bg-jornada-ivory/50 border border-jornada-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-jornada-terracotta text-white flex items-center justify-center font-heading font-bold text-sm">
                02
              </div>
              <h3 className="font-heading font-bold text-lg text-jornada-navy">Prestação de Contas Clara</h3>
              <p className="font-body text-xs sm:text-sm text-jornada-muted leading-relaxed">
                Relatórios financeiros organizados contendo recebimentos por Pix, parcelas, gratuidades e lançamento de despesas com os veículos.
              </p>
            </div>

            {/* Benefício 3 */}
            <div className="p-6 rounded-2xl bg-jornada-ivory/50 border border-jornada-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-jornada-green text-white flex items-center justify-center font-heading font-bold text-sm">
                03
              </div>
              <h3 className="font-heading font-bold text-lg text-jornada-navy">Privacidade e Respeito</h3>
              <p className="font-body text-xs sm:text-sm text-jornada-muted leading-relaxed">
                Controle estrito de privacidade. O passageiro consulta apenas os dados da própria inscrição, mantendo contatos e dados sensíveis protegidos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEÇÃO DE RECURSOS (CARDS DE RECURSOS) */}
      <section id="recursos" className="py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-jornada-navy">
              Recursos Completos
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-jornada-navy tracking-tight">
              Tudo o que a sua comissão de viagens precisa.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="p-6 bg-white rounded-2xl border border-jornada-border shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-jornada-ivory text-jornada-navy flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-jornada-navy">Inscrições & Passageiros</h3>
              <p className="font-body text-xs text-jornada-muted leading-relaxed">
                Formulário público com aprovação manual, dados de emergência, controle para menores e informações médicas.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-white rounded-2xl border border-jornada-border shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-jornada-ivory text-jornada-terracotta flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-jornada-navy">Análise de Comprovantes Pix</h3>
              <p className="font-body text-xs text-jornada-muted leading-relaxed">
                Visualização e aprovação de comprovantes enviados pelos passageiros com atualização automática do pagamento.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-white rounded-2xl border border-jornada-border shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-jornada-ivory text-jornada-navy flex items-center justify-center">
                <Bus className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-jornada-navy">Frota & Mapa de Assentos</h3>
              <p className="font-body text-xs text-jornada-muted leading-relaxed">
                Organização por ônibus, micro-ônibus ou vans, com atribuição de assentos numerados ou distribuição simples.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 bg-white rounded-2xl border border-jornada-border shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-jornada-ivory text-jornada-green flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-jornada-navy">Modo Check-in no Celular</h3>
              <p className="font-body text-xs text-jornada-muted leading-relaxed">
                Interface otimizada para uso durante o embarque, permitindo marcar presença de forma rápida e segura.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 bg-white rounded-2xl border border-jornada-border shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-jornada-ivory text-jornada-navy flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-jornada-navy">Modelos para WhatsApp</h3>
              <p className="font-body text-xs text-jornada-muted leading-relaxed">
                Gere mensagens personalizadas com confirmação de vaga, lembrete de pagamento e chave Pix em um clique.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 bg-white rounded-2xl border border-jornada-border shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-jornada-ivory text-jornada-navy flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-jornada-navy">Relatórios Imprimíveis</h3>
              <p className="font-body text-xs text-jornada-muted leading-relaxed">
                Listas oficiais de embarque, contatos de emergência e fechamento financeiro formatados para impressão limpa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PASSO A PASSO ("COMO FUNCIONA") */}
      <section id="como-funciona" className="py-16 sm:py-24 bg-white border-y border-jornada-border/70 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-jornada-terracotta">
              Simplicidade em 3 Passos
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-jornada-navy tracking-tight">
              Como funciona na prática.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Passo 1 */}
            <div className="space-y-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-jornada-navy text-white font-heading font-extrabold text-lg flex items-center justify-center mx-auto md:mx-0 shadow-sm">
                1
              </div>
              <h3 className="font-heading font-bold text-lg text-jornada-navy">Cadastre a Excursão</h3>
              <p className="font-body text-xs sm:text-sm text-jornada-muted leading-relaxed">
                Informe o destino, a data da viagem, o valor por passageiro, os veículos responsáveis e os pontos de embarque.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="space-y-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-jornada-terracotta text-white font-heading font-extrabold text-lg flex items-center justify-center mx-auto md:mx-0 shadow-sm">
                2
              </div>
              <h3 className="font-heading font-bold text-lg text-jornada-navy">Compartilhe o Link Público</h3>
              <p className="font-body text-xs sm:text-sm text-jornada-muted leading-relaxed">
                Envie o link nos grupos da igreja. Os passageiros preenchem os dados e enviam os comprovantes do Pix diretamente pelo celular.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="space-y-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-jornada-green text-white font-heading font-extrabold text-lg flex items-center justify-center mx-auto md:mx-0 shadow-sm">
                3
              </div>
              <h3 className="font-heading font-bold text-lg text-jornada-navy">Acompanhe & Faça o Check-in</h3>
              <p className="font-body text-xs sm:text-sm text-jornada-muted leading-relaxed">
                Valide os comprovantes com um clique e utilize o modo de embarque no dia da viagem com total agilidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PERGUNTAS FREQUENTES (FAQ) */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="font-heading font-bold text-xs uppercase tracking-widest text-jornada-navy">
              Esclarecimentos
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-jornada-navy tracking-tight">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl border border-jornada-border overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left font-heading font-bold text-sm sm:text-base text-jornada-navy flex items-center justify-between gap-4"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-jornada-terracotta shrink-0" /> : <ChevronDown className="w-4 h-4 text-jornada-muted shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 font-body text-xs sm:text-sm text-jornada-muted border-t border-jornada-border/40 pt-3 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CTA FINAL DE CONVERSÃO */}
      <section className="py-16 sm:py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto bg-jornada-navy text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden border border-white/10">
          <div className="space-y-2 max-w-2xl mx-auto relative z-10">
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
              Sua igreja pronta para a próxima viagem.
            </h2>
            <p className="font-body text-sm sm:text-base text-white/80 leading-relaxed">
              Crie a conta da sua igreja gratuitamente e comece a organizar suas excursões com seriedade e clareza.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10 pt-2">
            <Link href="/cadastro" className="w-full sm:w-auto">
              <Button variant="accent" size="lg" className="w-full sm:w-auto shadow-md" icon={<ArrowRight className="w-4 h-4" />}>
                Cadastrar Minha Igreja
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Acessar o Sistema
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. RODAPÉ INSTITUCIONAL (FOOTER) */}
      <footer className="bg-white border-t border-jornada-border/80 py-12 px-4 sm:px-8 text-xs font-body text-jornada-muted">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <LogoHorizontal size="sm" showSubtitle={true} />
            <p className="text-[11px] text-jornada-muted max-w-sm pt-1">
              Sistema de gestão administrativa independente para excursões e eventos de igrejas.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 font-heading font-semibold text-jornada-navy text-xs">
            <a href="#como-funciona" className="hover:text-jornada-terracotta transition-colors">Como Funciona</a>
            <a href="#recursos" className="hover:text-jornada-terracotta transition-colors">Recursos</a>
            <a href="#beneficios" className="hover:text-jornada-terracotta transition-colors">Benefícios</a>
            <Link href="/login" className="hover:text-jornada-terracotta transition-colors">Entrar</Link>
            <Link href="/cadastro" className="hover:text-jornada-terracotta transition-colors">Criar Conta</Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-jornada-border/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-jornada-muted/80">
          <span>© {new Date().getFullYear()} JORNADA. Todos os direitos reservados.</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-jornada-green" /> Ambiente Seguro e Isolado por Igreja
          </span>
        </div>
      </footer>
    </div>
  );
}

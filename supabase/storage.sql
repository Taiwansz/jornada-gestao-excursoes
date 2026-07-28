-- Instruções e SQL para criação de Buckets no Supabase Storage

-- 1. Criar bucket de Comprovantes (receipts) privado
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar bucket de Documentos da Excursão (documents) privado
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- 3. Criar bucket de Logos da Igreja (logos) público
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Acesso para Storage:
-- Permitir upload de comprovantes pelos passageiros ou organizadores
CREATE POLICY "Permitir upload de comprovantes" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Leitura de comprovantes autenticados" ON storage.objects
  FOR SELECT USING (bucket_id = 'receipts' AND auth.role() = 'authenticated');

CREATE POLICY "Permitir gerenciar documentos" ON storage.objects
  FOR ALL USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Permitir logos publicos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Permitir upload de logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');

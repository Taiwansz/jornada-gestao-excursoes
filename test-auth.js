// Teste automatizado de login e cadastro
console.log('🧪 Testando fluxo de login e cadastro...');

const { getInitialChurch, updateChurchConfig, saveChurchUser, setCurrentUser, getCurrentUser } = require('./src/lib/store');

// 1. Testar dados iniciais da igreja
const initialChurch = getInitialChurch();
console.log('✅ Igreja Inicial:', initialChurch.name);

// 2. Testar cadastro de nova igreja e usuário
const newChurch = updateChurchConfig({
  name: 'Igreja Nova Esperança',
  phone: '(11) 97777-6666',
  main_responsible: 'Pr. Marcos Souza'
});
console.log('✅ Igreja Atualizada:', newChurch.name);

const newUser = saveChurchUser({
  church_id: newChurch.id,
  full_name: 'Pr. Marcos Souza',
  email: 'marcos@novaesperanca.org.br',
  phone: '(11) 97777-6666',
  role: 'admin',
  status: 'active'
});
console.log('✅ Usuário Cadastrado:', newUser.full_name, `(${newUser.email})`);

setCurrentUser(newUser);
const activeUser = getCurrentUser();
console.log('✅ Usuário Autenticado:', activeUser?.full_name);

if (activeUser?.email === 'marcos@novaesperanca.org.br') {
  console.log('🎉 TESTE DE LOGIN E CADASTRO APROVADO 100%!');
} else {
  console.error('❌ Falha no teste de autenticação');
  process.exit(1);
}

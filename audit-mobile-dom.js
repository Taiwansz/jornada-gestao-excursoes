const fs = require('fs');
const path = require('path');

console.log('🔍 Auditoria Completa de Componentes para Telas Mobile (Celular)...');

const srcDir = path.join(__dirname, 'src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allComponentFiles = getAllFiles(srcDir);
const auditIssues = [];

allComponentFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const relativePath = path.relative(__dirname, file);

  // 1. Verificar larguras fixas de pixel acima de 300px que causam estouro horizontal no celular
  const fixedWidthMatches = content.match(/\bw-\[\d{3,}px\]/g);
  if (fixedWidthMatches) {
    auditIssues.push({
      file: relativePath,
      issue: 'Largura fixa em pixels pode causar estouro horizontal no celular',
      details: fixedWidthMatches.join(', ')
    });
  }

  // 2. Verificar tabelas <table> sem contêiner 'overflow-x-auto'
  if (content.includes('<table') && !content.includes('overflow-x-auto')) {
    auditIssues.push({
      file: relativePath,
      issue: 'Tabela sem contêiner de rolagem horizontal (overflow-x-auto)',
      details: 'Tabelas em celular devem ter overflow-x-auto para não comprimir colunas'
    });
  }

  // 3. Verificar botões/elementos clicáveis com padding excessivamente pequeno (< py-1.5)
  if (content.includes('py-0.5') && content.includes('onClick')) {
    auditIssues.push({
      file: relativePath,
      issue: 'Área de toque pequena em botão clicável (< 32px)',
      details: 'Pode ser difícil de clicar no celular'
    });
  }

  // 4. Verificar grids com números de colunas fixas sem flex/responsive (ex: grid-cols-3 sem sm: / md:)
  const unresponsiveGrids = content.match(/grid-cols-[2-9](?!\s|\b)/g);
  if (unresponsiveGrids && !content.includes('grid-cols-1')) {
    // Filtrar apenas se não houver breakout para mobile
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('grid-cols-') && !line.includes('grid-cols-1') && !line.includes('sm:grid-cols') && !line.includes('md:grid-cols')) {
        auditIssues.push({
          file: `${relativePath}:${idx + 1}`,
          issue: 'Grid com colunas fixas no mobile sem fallback (grid-cols-1)',
          details: line.trim()
        });
      }
    });
  }
});

console.log(`\n📌 TOTAL DE ARQUIVOS ANALISADOS: ${allComponentFiles.length}`);
console.log(`⚠️ TOTAL DE PONTOS DE ATENÇÃO ENCONTRADOS: ${auditIssues.length}\n`);

if (auditIssues.length > 0) {
  console.log(JSON.stringify(auditIssues, null, 2));
} else {
  console.log('✅ Nenhum bug de layout mobile encontrado!');
}

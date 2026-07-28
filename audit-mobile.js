const { chromium } = require('playwright');
const http = require('http');

async function checkMobileLayout() {
  console.log('📱 Iniciando auditoria do Playwright em Viewport Mobile (390x844)...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  // Testar rotas principais
  const routes = [
    { name: 'Dashboard Principal', path: 'http://localhost:3000/' },
    { name: 'Login', path: 'http://localhost:3000/login' },
    { name: 'Cadastro de Conta', path: 'http://localhost:3000/cadastro' },
    { name: 'Lista de Excursões', path: 'http://localhost:3000/excursoes' },
    { name: 'Diretório de Passageiros', path: 'http://localhost:3000/passageiros' },
    { name: 'Painel Financeiro', path: 'http://localhost:3000/financeiro' },
    { name: 'Análise de Comprovantes', path: 'http://localhost:3000/comprovantes' },
    { name: 'Relatórios', path: 'http://localhost:3000/relatorios' },
    { name: 'Gestão de Usuários', path: 'http://localhost:3000/usuarios' },
    { name: 'Configurações da Igreja', path: 'http://localhost:3000/configuracoes' },
  ];

  const auditResults = [];

  for (const route of routes) {
    try {
      await page.goto(route.path, { waitUntil: 'domcontentloaded', timeout: 5000 });
      await page.waitForTimeout(1000);

      // Verificar estouro de largura horizontal no body (Horizontal Overflow Bug)
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      // Verificar botões com altura menor que 40px (Touch Target Size check)
      const smallTouchTargets = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, a'));
        return buttons
          .filter(b => {
            const rect = b.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && (rect.width < 32 || rect.height < 32);
          })
          .map(b => b.textContent?.trim() || b.getAttribute('aria-label') || 'Elemento sem texto')
          .slice(0, 5);
      });

      // Verificar elementos com texto cortado ou sobreposto
      const textOverflowElements = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('h1, h2, h3, p, span, td'));
        return els
          .filter(el => el.scrollWidth > el.clientWidth && getComputedStyle(el).overflow === 'hidden')
          .map(el => el.textContent?.trim().substring(0, 30))
          .slice(0, 5);
      });

      auditResults.push({
        route: route.name,
        path: route.path,
        hasHorizontalScroll,
        smallTouchTargetsCount: smallTouchTargets.length,
        smallTouchTargetsSample: smallTouchTargets,
        textOverflowCount: textOverflowElements.length,
        status: hasHorizontalScroll || smallTouchTargets.length > 3 ? 'Atenção' : 'OK'
      });
    } catch (e) {
      auditResults.push({
        route: route.name,
        path: route.path,
        error: e.message,
        status: 'Erro'
      });
    }
  }

  await browser.close();

  console.log('\n======================================================');
  console.log('📊 RESULTADO DA AUDITORIA PLAYWRIGHT (MOBILE VIEW)');
  console.log('======================================================');
  console.log(JSON.stringify(auditResults, null, 2));
}

checkMobileLayout();

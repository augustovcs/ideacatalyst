# 📊 Análise Detalhada - Estrutura de Componentes

## Visão Geral
Refatoração completa do sistema de análise de ideias com design modular, múltiplas seções temáticas e visualizações avançadas.

## Estrutura de Arquivos

### Hooks
- **`useDetailedAnalysis.ts`** - Hook principal que gerencia o fluxo de análise
  - Tipos de dados estruturados para cada seção
  - Geração de dados simulados para testes
  - Integração com backend via API

### Componentes (AnalysisUI/)

#### Telas Principais
- **`IdeaInputScreen.tsx`** - Tela de input para descrição da ideia
- **`AnalysisLoadingScreen.tsx`** - Animação de carregamento
- **`DetailedAnalysisView.tsx`** - Orquestrador principal da análise

#### Seções de Análise
1. **`ExecutiveSummarySection.tsx`** 📋
   - Descrição da ideia
   - Proposta de valor
   - Dados demográficos do cliente-alvo
   - Encaixe estratégico

2. **`MarketAnalysisSection.tsx`** 📊
   - Tamanho de mercado (atual vs projetado)
   - Gráficos de sub-mercados
   - Análise de tendências
   - Posicionamento competitivo
   - Notícias recentes
   - Barreiras de entrada

3. **`SWOTSection.tsx`** 🔄
   - Matriz 2x2 colorida
   - Forças, Fraquezas, Oportunidades, Ameaças

4. **`TechnicalDetailsSection.tsx`** ⚙️
   - Stack tecnológico
   - Nível de complexidade
   - Processos críticos
   - Recursos humanos
   - KPIs operacionais

5. **`MarketingAndSalesSection.tsx`** 📢
   - Estratégias de marketing
   - Canais de aquisição
   - CAC, LTV, Razão LTV:CAC
   - Projeção de vendas (gráfico linear)
   - Métricas de conversão

6. **`FinancialsSection.tsx`** 💵
   - Custos iniciais detalhados
   - Modelo de receita
   - Margem de lucro
   - Projeção de fluxo de caixa (gráfico área)
   - ROI
   - Break-even point

7. **`RisksAndMitigationSection.tsx`** ⚠️
   - Matriz de riscos (probabilidade x impacto)
   - Ações de mitigação com checklist
   - Timeline de próximos passos

8. **`AdditionalInsightsSection.tsx`** 💡
   - Oportunidades de parceria
   - Tecnologias emergentes (acordeon)
   - Considerações regulatórias

#### Componentes Utilitários
- **`SharedComponents.tsx`**
  - `KPICard` - Card para KPIs com status
  - `Badge` - Badge com variantes de cor
  - `ExternalLinkBtn` - Link externo com ícone
  - `SectionTitle` - Título de seção com emoji
  - `ProgressBar` - Barra de progresso animada
  - `Card` - Container genérico
  - `ImpactIndicator` - Indicador visual de impacto

## Tipo de Dados

### Estrutura Principal
```typescript
interface DetailedAnalysisResult {
  ideaTitle: string;
  executiveSummary: ExecutiveSummary;
  marketAnalysis: MarketAnalysis;
  swotAnalysis: SWOTAnalysis;
  technicalDetails: TechnicalDetails;
  marketingAndSales: MarketingAndSales;
  financials: Financials;
  risksAndMitigation: RisksAndMitigation;
  additionalInsights: AdditionalInsights;
}
```

## Recursos & Tecnologias

### Visuais
- **Gráficos Recharts**
  - Pie chart (sub-mercados)
  - Line chart (projeção de vendas)
  - Area chart (fluxo de caixa)
  - Bar chart (métricas de conversão)

- **Componentes UI**
  - Badges coloridas por status/impacto
  - Cards modularizados
  - Progress bars animadas
  - Acordeão para expansão

### UX/UI
- Cores temáticas por nível:
  - 🟢 Verde: Baixo/Bom/Sucesso
  - 🟡 Amarelo: Médio/Alerta
  - 🔴 Vermelho: Alto/Crítico
  - 🔵 Azul: Informacional

- Animações:
  - Fade-in ao carregar
  - Bounce nos ícones de loading
  - Transições suaves

## Fluxo da Aplicação

```
IntroScreen
    ↓ (onStart)
IdeaInputScreen
    ↓ (onSubmit)
AnalysisLoadingScreen (1.5 segundos)
    ↓ (generateDetailedAnalysis)
DetailedAnalysisView
    ├─ ExecutiveSummarySection
    ├─ MarketAnalysisSection
    ├─ SWOTAnalysisSection
    ├─ TechnicalDetailsSection
    ├─ MarketingAndSalesSection
    ├─ FinancialsSection
    ├─ RisksAndMitigationSection
    └─ AdditionalInsightsSection
    ↓ (onReset)
IntroScreen (reinicia)
```

## Integração com Backend

Atualmente, o hook `useDetailedAnalysis` gera dados simulados mas mantém a chamada para:
```
POST /api/input/idea
```

Para integração completa com IA (Claude, GPT, etc), modificar a função `generateDetailedAnalysis()` para chamar endpoint que retorna dados reais.

## Desenvolvimento Futuro

1. **Integração com IA**
   - Conectar com API de IA para gerar análises reais
   - Usar dados do usuário como prompt

2. **PDF Export**
   - Gerar relatório em PDF com todos os dados

3. **Compartilhamento**
   - Salvar análises no banco de dados
   - Gerar link compartilhável

4. **Histórico**
   - Dashboard de análises anteriores
   - Comparação entre ideias

5. **Otimizações de Performance**
   - Code-splitting dos gráficos
   - Lazy loading de seções

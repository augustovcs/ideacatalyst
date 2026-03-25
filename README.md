# 🚀 Idea Catalyst

> **PT-BR:** Criado para quem quer entender profundamente qualquer ideia.  
> **EN:** Created for those who want to deeply understand any idea.

---

## 📌 Sobre o Projeto | About the Project

**PT-BR:**  
O Idea Catalyst é uma plataforma que analisa ideias de negócio utilizando Inteligência Artificial, gerando insights estruturados sobre viabilidade, mercado e métricas financeiras.  
O objetivo é transformar uma simples ideia em uma visão estratégica clara e orientada a dados.

**EN:**  
Idea Catalyst is a platform that analyzes business ideas using Artificial Intelligence, generating structured insights about viability, market, and financial metrics.  
Its goal is to transform a simple idea into a clear, data-driven strategic vision.

---

## ⚙️ Funcionalidades | Features

**PT-BR:**
- Análise de ideias com IA  
- Geração de insights estruturados  
- Cálculo de métricas (ROI, CAC, LTV, CAGR, etc.)  
- Armazenamento de sessões de análise  
- Processamento assíncrono  
- Persistência de dados via Supabase  

**EN:**
- AI-powered idea analysis  
- Structured insight generation  
- Financial metrics calculation (ROI, CAC, LTV, CAGR, etc.)  
- Analysis session storage  
- Asynchronous processing  
- Data persistence using Supabase  

---

## 🏗️ Arquitetura | Architecture

**PT-BR:**  
O sistema segue uma arquitetura baseada em serviços, com separação clara entre entrada de dados, processamento de IA e persistência.

**EN:**  
The system follows a service-based architecture, with clear separation between input handling, AI processing, and data persistence.

---
## Endpoints

### POST Idea Sent 
<img width="1582" height="580" alt="image" src="https://github.com/user-attachments/assets/87246a2e-ef8e-4a35-8e6e-158c545a2b68" />

### GET Idea by Session ID
<img width="1272" height="811" alt="image" src="https://github.com/user-attachments/assets/b4e6c70e-d4bc-4637-9246-c7b12e854804" />

---

## Prints | Screenshots
<img width="1887" height="857" alt="image" src="https://github.com/user-attachments/assets/c8321187-c6e6-4291-ad9a-6676e63bef40" />
<img width="1872" height="805" alt="image" src="https://github.com/user-attachments/assets/c53473bb-f61d-4b0d-bf98-21ca219ff013" />
<img width="1897" height="850" alt="image" src="https://github.com/user-attachments/assets/fbeb60ce-b6e9-444c-a367-ef940b79514a" />
<img width="1849" height="858" alt="image" src="https://github.com/user-attachments/assets/d09423b2-6f41-40f5-92d4-657708c76ebe" />
<img width="1569" height="723" alt="image" src="https://github.com/user-attachments/assets/075e45ea-b434-4466-aa8a-dcd8b81df715" />
<img width="1775" height="837" alt="image" src="https://github.com/user-attachments/assets/e293df21-64f8-419f-8e45-de7e2d0a8c2e" />

### And so much more details... | E ainda mais detalhes...

---
##JSONB Example Database data

```json
{
  "ideaTitle": "AI Automation SaaS for B2B",
  "executiveSummary": {
    "description": "A Software-as-a-Service (SaaS) platform that uses artificial intelligence to automate business processes for B2B companies, increasing efficiency and reducing operational costs.",
    "valueProposition": "The platform offers seamless integration with existing systems, customizable workflows, and advanced analytics to optimize business operations.",
    "targetCustomer": {
      "ageRange": "30-55",
      "gender": "all",
      "incomeLevel": "mid to high",
      "location": "global",
      "psychographics": [
        "efficiency-driven",
        "tech-savvy",
        "cost-conscious",
        "innovation-oriented"
      ]
    },
    "strategicFit": "https://www.mckinsey.com/business-functions/mckinsey-digital/how-we-help-clients/software-as-a-service"
  },
  "marketAnalysis": {
    "marketSize": {
      "current": "$115B",
      "projected5Years": "$230B",
      "cagr": 14.89,
      "subMarkets": [
        {
          "name": "Enterprise AI",
          "percentage": 35
        },
        {
          "name": "SMEs AI Solutions",
          "percentage": 65
        }
      ]
    },
    "trends": [
      {
        "trend": "Increased adoption of AI in business processes",
        "impact": "high",
        "dataPoint": "Adoption of AI in businesses is projected to continue growing by 45% in 5 years.",
        "reference": "https://www.gartner.com/en/newsroom/press-releases/2023-08-01-gartner-forecast-worldwide-ai-software-revenue"
      }
    ],
    "competition": [
      {
        "name": "UiPath",
        "marketShare": 10,
        "strengths": [
          "Established brand",
          "Comprehensive AI solutions"
        ],
        "weaknesses": [
          "High cost",
          "Complex integration"
        ],
        "notes": "Leader in AI automation but faces integration challenges.",
        "reference": "https://www.forrester.com/report/the-forrester-wave-robotic-process-automation/"
      }
    ],
    "recentNews": [
      {
        "title": "AI Startups See Record Funding",
        "date": "2023-03-15",
        "source": "TechCrunch",
        "relevance": "medium",
        "url": "https://techcrunch.com/2023/03/15/ai-startups-see-record-funding-in-2023/"
      }
    ],
    "barriersToEntry": [
      {
        "barrier": "High R&D costs",
        "impactLevel": "high"
      }
    ]
  },
  "swotAnalysis": {
    "strengths": [
      "Scalable platform",
      "Cutting-edge AI technology",
      "Global reach"
    ],
    "weaknesses": [
      "High initial setup costs",
      "Dependency on technology partners"
    ],
    "opportunities": [
      "Growing demand for automation",
      "Expansion into emerging markets"
    ],
    "threats": [
      "Rapidly evolving technology landscape",
      "Potential data privacy regulations"
    ]
  },
  "technicalDetails": {
    "technologiesRequired": [
      {
        "name": "Machine Learning",
        "icon": "🤖"
      },
      {
        "name": "Cloud Computing",
        "icon": "☁️"
      }
    ],
    "complexity": "high",
    "criticalProcesses": [
      {
        "process": "Data processing and analysis",
        "impact": "high",
        "dependencies": "Advanced algorithms and robust data sets",
        "reference": "https://www.ibm.com/analytics/data-processing"
      }
    ],
    "humanResources": [
      {
        "role": "Data Scientist",
        "count": 10,
        "skillLevel": "senior",
        "reference": "https://www.glassdoor.com/Salaries/data-scientist-salary"
      }
    ],
    "operationalMetrics": [
      {
        "kpi": "System uptime",
        "target": "99.9%",
        "benchmark": "99%",
        "reference": "https://www.uptimeinstitute.com/uptime"
      }
    ]
  },
  "marketingAndSales": {
    "strategies": [
      {
        "text": "Leverage online marketing campaigns targeting tech-savvy businesses",
        "reference": "https://www.cmo.com/features/articles/2019/2/4/why-b2b-marketing-must-embrace-digital.html"
      }
    ],
    "channels": [
      {
        "name": "LinkedIn",
        "icon": "🔗",
        "url": "https://www.linkedin.com"
      },
      {
        "name": "Email Campaigns",
        "icon": "📧",
        "url": "https://mailchimp.com"
      }
    ],
    "customerAcquisitionCost": 500,
    "lifetimeValue": 20000,
    "salesForecast": [
      {
        "year": 1,
        "revenue": 500000
      },
      {
        "year": 2,
        "revenue": 1500000
      }
    ],
    "conversionMetrics": [
      {
        "metric": "Lead-to-customer conversion rate",
        "target": 20,
        "benchmark": 15
      }
    ]
  },
  "financials": {
    "initialCosts": [
      {
        "category": "R&D",
        "amount": 200000
      },
      {
        "category": "Marketing",
        "amount": 100000
      }
    ],
    "revenueModel": {
      "pricing": "Subscription-based",
      "recurring": "Monthly or annually",
      "upsell": "Premium features"
    },
    "profitMarginEstimate": 45,
    "cashFlowProjection": [
      {
        "month": 1,
        "inflow": 50000,
        "outflow": 80000
      }
    ],
    "roi": 150,
    "breakEvenPoint": {
      "months": 24,
      "revenue": "$600,000"
    }
  },
  "risksAndMitigation": {
    "keyRisks": [
      {
        "risk": "Data breaches",
        "probability": "medium",
        "impact": "high",
        "reference": "https://www.csoonline.com/article/3533369/the-top-data-breaches-of-2023.html"
      }
    ],
    "mitigationActions": [
      {
        "action": "Implement robust encryption and security protocols",
        "reference": "https://www.ibm.com/security/data-protection"
      }
    ],
    "nextSteps": [
      "Conduct market research",
      "Develop MVP",
      "Seek initial funding"
    ]
  },
  "additionalInsights": {
    "partnershipOpportunities": [
      {
        "partner": "AWS",
        "reference": "https://aws.amazon.com/partners/"
      }
    ],
    "emergingTechnologies": [
      {
        "technology": "Quantum Computing",
        "relevance": "Potential to significantly enhance AI capabilities"
      }
    ],
    "regulatoryConsiderations": [
      {
        "regulation": "GDPR compliance",
        "impact": "High impact on data processing activities",
        "reference": "https://gdpr.eu/"
      }
    ]
  }
}

```
---

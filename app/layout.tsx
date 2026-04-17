import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Calculadora de ROI — RevTrack Pulse",
  description: "Descubra quanto sua empresa perde gerindo comissões em planilhas e quanto a RevTrack pode recuperar.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Como calcular o ROI de um software de comissão de vendas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para calcular o ROI de um software de comissão, você deve subtrair o custo da ferramenta da economia total gerada por ela, e dividir esse resultado pelo custo da ferramenta. A economia total inclui a eliminação da taxa de erro manual (média de 3% sobre o valor das comissões), as horas de trabalho do gestor financeiro poupadas e a redução de passivos trabalhistas. Você pode usar a nossa Calculadora de ROI gratuita para obter esse valor exato em tempo real.",
      },
    },
    {
      "@type": "Question",
      name: "Quais são os maiores riscos de calcular comissão no Excel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Os três maiores riscos de calcular comissões em planilhas são: 1) Erros humanos de digitação e fórmulas quebradas, que geram pagamentos indevidos; 2) Passivos trabalhistas, pois o cálculo incorreto reflete em férias, 13º e rescisões; e 3) 'Shadow Accounting', onde os vendedores perdem tempo calculando suas próprias comissões por falta de confiança na planilha da empresa.",
      },
    },
    {
      "@type": "Question",
      name: "Quanto tempo uma empresa perde gerindo comissões manualmente?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Em média, uma empresa com 10 a 20 vendedores perde entre 20 e 40 horas mensais apenas coletando dados, aplicando regras de comissionamento, revisando planilhas e respondendo a dúvidas dos vendedores. A automação com a RevTrack reduz esse tempo em até 90%, liberando os gestores para análises estratégicas.",
      },
    },
    {
      "@type": "Question",
      name: "Qual é a taxa de erro aceitável no pagamento de comissões?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A taxa de erro aceitável é zero. No entanto, estudos de mercado mostram que empresas que utilizam planilhas manuais apresentam uma taxa de erro média de 3% a 8% no pagamento de comissões. Isso significa que a cada R$ 100.000 pagos em comissão, a empresa pode estar perdendo até R$ 8.000 por mês devido a falhas operacionais.",
      },
    },
    {
      "@type": "Question",
      name: "A RevTrack funciona para times de vendas com regras complexas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Diferente das planilhas que travam com muitas variáveis, a RevTrack foi construída para suportar regras complexas, como comissionamento escalonado, aceleradores de metas, deduções de churn e divisões de comissão (split) entre SDRs e Closers, garantindo precisão total independente do regime de contratação (CLT ou PJ).",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

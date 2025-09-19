import { notFound } from "next/navigation";

const slugToPdfPath: Record<string, string> = {
  "solicitacao-de-reembolso": "/politicas solid/Política - Solicitação de Reembolso.pdf",
  "solicitacao-de-pagamentos": "/politicas solid/Política - Solicitação de pagamentos.pdf",
  "recrutamento-e-selecao-de-prestadores-de-servicos": "/politicas solid/Política - Recrutamento e Seleção de Prestadores de Serviços.pdf",
  "rdv": "/politicas solid/Política - RDV.pdf",
  "prestacao-de-contas-cartao-de-credito": "/politicas solid/Política - Prestação de Contas, Cartão de Crédito.pdf",
  "gestao-de-contratos": "/politicas solid/Política - Gestão de Contratos.pdf",
  "fluxo-de-pagamento": "/politicas solid/Política - Fluxo de Pagamento.pdf",
  "compras-de-passagens": "/politicas solid/Política - Compras de Passagens.pdf",
  "compras-de-insumos": "/politicas solid/Política - Compras de  Insumos.pdf",
  "boas-praticas": "/politicas solid/Política - Boas praticas.pdf",
};

export default function PoliticaPage({ params }: { params: { slug: string } }) {
  const pdfPath = slugToPdfPath[params.slug];

  if (!pdfPath) {
    notFound();
  }

  return (
    <div className="h-[calc(100vh-4rem)] -m-6">
      <iframe
        src={`${pdfPath}#toolbar=1&navpanes=0&scrollbar=1`}
        className="w-full h-full"
      />
      <div className="p-4">
        <a
          href={pdfPath}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-primary"
        >
          Abrir em nova aba / Baixar PDF
        </a>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(slugToPdfPath).map((slug) => ({ slug }));
}


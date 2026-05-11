import { useState } from "react";
import { contracts } from "../services/api";

function formatDate(isoStr) {
  if (!isoStr) return "—";
  return new Date(isoStr).toLocaleDateString("pt-BR");
}

function formatMoney(val) {
  return Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ContractView({ contract, onBack, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const text = contract.generated_text || "";

  async function handleDelete() {
    if (!confirm("Excluir este contrato? Esta ação não pode ser desfeita.")) return;
    setDeleting(true);
    try {
      await contracts.remove(contract.id);
      onDeleted(contract.id);
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contrato-${contract.id}-${contract.client_name.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="contract-view">
      <div className="cv-topbar">
        <button className="btn-ghost" onClick={onBack}>← Voltar</button>
        <div className="cv-actions">
          <button className="btn-ghost" onClick={handleCopy}>
            {copied ? "✓ Copiado" : "Copiar texto"}
          </button>
          <button className="btn-ghost" onClick={handleDownload}>↓ Baixar .txt</button>
          <button className="btn-danger-ghost" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>

      <div className="cv-meta">
        <div className="meta-grid">
          <div className="meta-item">
            <span className="meta-label">Prestador</span>
            <span className="meta-value">{contract.freelancer_name}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Contratante</span>
            <span className="meta-value">{contract.client_name}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Valor</span>
            <span className="meta-value highlight">{formatMoney(contract.total_value)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Pagamento</span>
            <span className="meta-value">{contract.payment_method}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Início</span>
            <span className="meta-value">{contract.start_date}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Prazo</span>
            <span className="meta-value">{contract.deadline}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Gerado em</span>
            <span className="meta-value">{formatDate(contract.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="cv-text-wrapper">
        <pre className="cv-text">{text}</pre>
      </div>
    </div>
  );
}

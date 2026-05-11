import { useState } from "react";
import { contracts } from "../services/api";

const INITIAL = {
  freelancer_name: "",
  freelancer_doc: "",
  client_name: "",
  client_doc: "",
  service_description: "",
  deadline: "",
  total_value: "",
  payment_method: "",
  start_date: "",
};

const PAYMENT_OPTIONS = ["PIX", "Boleto", "Transferência", "Débito", "Cartão de Crédito"];

export default function NewContract({ onCreated }) {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form, total_value: parseFloat(form.total_value) };
      const result = await contracts.create(payload);
      onCreated(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-page">
      <div className="form-header">
        <h2>Novo Contrato</h2>
        <p>Preencha os dados — a IA gera o contrato completo automaticamente.</p>
      </div>

      <form onSubmit={handleSubmit} className="contract-form">
        <fieldset>
          <legend>Prestador de Serviços</legend>
          <div className="field-row">
            <div className="field">
              <label>Nome completo</label>
              <input value={form.freelancer_name} onChange={set("freelancer_name")} placeholder="Ex: João Silva" required />
            </div>
            <div className="field">
              <label>CPF / CNPJ</label>
              <input value={form.freelancer_doc} onChange={set("freelancer_doc")} placeholder="Ex: 123.456.789-00" required />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Contratante</legend>
          <div className="field-row">
            <div className="field">
              <label>Nome / Razão Social</label>
              <input value={form.client_name} onChange={set("client_name")} placeholder="Ex: Empresa XYZ" required />
            </div>
            <div className="field">
              <label>CPF / CNPJ</label>
              <input value={form.client_doc} onChange={set("client_doc")} placeholder="Ex: 12.345.678/0001-00" required />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Serviço & Pagamento</legend>
          <div className="field">
            <label>Descrição do Serviço</label>
            <textarea
              value={form.service_description}
              onChange={set("service_description")}
              placeholder="Descreva o que será desenvolvido, escopo, entregas..."
              rows={4}
              required
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Data de início</label>
              <input type="text" value={form.start_date} onChange={set("start_date")} placeholder="Ex: 01/06/2025" required />
            </div>
            <div className="field">
              <label>Prazo de entrega</label>
              <input type="text" value={form.deadline} onChange={set("deadline")} placeholder="Ex: 30 dias úteis" required />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Valor total (R$)</label>
              <input
                type="number"
                value={form.total_value}
                onChange={set("total_value")}
                placeholder="Ex: 5000"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="field">
              <label>Forma de pagamento</label>
              <select value={form.payment_method} onChange={set("payment_method")} required>
                <option value="">Selecione</option>
                {PAYMENT_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary btn-large" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Gerando contrato com IA...
              </>
            ) : (
              "✦ Gerar Contrato"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

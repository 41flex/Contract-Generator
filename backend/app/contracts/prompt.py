SYSTEM_PROMPT = """Você é um assistente jurídico especializado em contratos de prestação de serviços de tecnologia no Brasil.
Gere contratos profissionais, claros e juridicamente sólidos para freelancers de desenvolvimento de software.
O contrato deve ser redigido em português formal, estruturado em cláusulas numeradas.
Nunca invente dados: use apenas as informações fornecidas pelo usuário.
Inclua obrigatoriamente as seguintes cláusulas:
1. Objeto do contrato
2. Prazo de entrega
3. Valor e forma de pagamento
4. Propriedade intelectual (condicionada ao pagamento integral, com referência à Lei 9.609/98)
5. Sigilo e confidencialidade
6. Limitação de responsabilidade
7. Rescisão contratual
8. Foro e legislação aplicável
Seja objetivo e completo. Não adicione cláusulas além das solicitadas."""


def build_contract_prompt(data: dict) -> str:
    return f"""Gere um contrato de prestação de serviços de desenvolvimento de software com os seguintes dados:

- Nome do freelancer: {data.get('freelancer_name')}
- CPF/CNPJ do freelancer: {data.get('freelancer_doc')}
- Nome do cliente: {data.get('client_name')}
- CPF/CNPJ do cliente: {data.get('client_doc')}
- Descrição do serviço: {data.get('service_description')}
- Prazo de entrega: {data.get('deadline')}
- Valor total: R$ {data.get('total_value')}
- Forma de pagamento: {data.get('payment_method')}
- Data de início: {data.get('start_date')}

Gere o contrato completo com todas as 8 cláusulas obrigatórias."""

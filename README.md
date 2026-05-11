# Freelancers Contracts 🚀

Uma plataforma moderna para gerenciamento de contratos de freelancers, integrada com IA (Google Gemini) para análise e automação, construída com **FastAPI** no backend e **React (Vite)** no frontend.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [TailwindCSS](https://tailwindcss.com/)
- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) + [SQLAlchemy](https://www.sqlalchemy.org/)
- **Banco de Dados:** MySQL
- **IA:** [Google Gemini API](https://ai.google.dev/)
- **Autenticação:** JWT (JSON Web Tokens)

## 📂 Estrutura do Projeto

```text
freelas/
├── backend/          # API FastAPI em Python
├── frontend/         # Interface React em Vite
├── vercel.json       # Configuração de deploy para Vercel
└── .gitignore        # Arquivos ignorados pelo Git
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v18+)
- Python (v3.9+)
- MySQL

### 1. Configurando o Backend
Navegue até a pasta `backend`:
```bash
cd backend
```
Crie um ambiente virtual e instale as dependências:
```bash
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Configure o arquivo `.env` (use o `env.example` como base) e inicie o servidor:
```bash
uvicorn app.main:app --reload
```

### 2. Configurando o Frontend
Navegue até a pasta `frontend`:
```bash
cd frontend
```
Instale as dependências e inicie o servidor de desenvolvimento:
```bash
npm install
npm run dev
```

## 🔒 Variáveis de Ambiente

Certifique-se de configurar os seguintes arquivos:

- **backend/.env**:
  - `DATABASE_URL`: URL de conexão com o MySQL.
  - `SECRET_KEY`: Chave para geração de tokens JWT.
  - `GEMINI_API_KEY`: Sua chave da API do Google Gemini.
- **frontend/.env.local**:
  - `VITE_API_URL`: URL base do backend (ex: `http://localhost:8000`).

## 📄 Licença

Este projeto é para fins de estudo e desenvolvimento de freelancers, feito por 41flex.

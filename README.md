# 🗺️ Descubra Piauí - Mapa de Pontos Turísticos

Aplicação web interativa em Next.js que exibe um mapa com os principais pontos turísticos do Piauí, de Teresina ao litoral e ao sertão. Desenvolvida com React, Leaflet, MarkerCluster e integração com Google Drive para imagens.

![Versão](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9+-green)

## ✨ Funcionalidades

### Página Pública (`/`)
- 🗺️ **Mapa interativo** com Leaflet centrado em Teresina
- 📍 **Marcadores clusterizados** para melhor visualização
- 🔍 **Busca em tempo real** por nome, bairro ou categoria
- 📱 **Layout responsivo** (desktop: mapa + sidebar; mobile: stack)
- 🖼️ **Popups ricos** com imagens do Google Drive
- 🧭 **Botão "Como chegar"** integrado com Google Maps
- 🎯 **Centralização no mapa** ao clicar em um ponto na lista

### Painel Administrativo (`/admin`)
- 🔐 Autenticação via Firebase Auth
- ✏️ CRUD completo de pontos turísticos
- 📸 Campo para IDs de imagens do Google Drive
- 📊 Campos: título, subtítulo, descrição, categoria, endereço, coordenadas, telefone, horário
- 🌍 Geocodificação automática de endereços (Nominatim API)
- ✅ Controle de publicação (publicado/rascunho)

## 🚀 Tecnologias Utilizadas

- **[Next.js 14+](https://nextjs.org/)** - Framework React com App Router
- **[React 18+](https://react.dev/)** - Biblioteca para interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização utilitária
- **[Leaflet](https://leafletjs.com/)** - Biblioteca de mapas interativos
- **[React-Leaflet](https://react-leaflet.js.org/)** - Componentes React para Leaflet
- **[Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)** - Agrupamento de marcadores
- **[Firebase](https://firebase.google.com/)** - Autenticação e Firestore (opcional)
- **[Nominatim API](https://nominatim.org/)** - Geocodificação gratuita

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ instalado
- NPM ou Yarn
- Conta no Firebase (para autenticação admin)

### Passo 1: Clone o repositório
```bash
git clone https://github.com/seu-usuario/descubra-piaui.git
cd descubra-piaui
```

### Passo 2: Instale as dependências
```bash
npm install
```

### Passo 3: Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais do Firebase (obtenha em https://console.firebase.google.com/):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=seu-app-id
```

### Passo 4: Execute em desenvolvimento
```bash
npm run dev
```

Acesse: **http://localhost:3000**

### Passo 5: Build para produção
```bash
npm run build
npm start
```

## 🖼️ Como usar imagens do Google Drive

### Obter o File ID de uma imagem no Drive

1. Faça upload da imagem para o Google Drive
2. Clique com o botão direito na imagem → **Compartilhar**
3. Em "Acesso geral", selecione **"Qualquer pessoa com o link"**
4. Copie o link compartilhado, que terá este formato:
   ```
   https://drive.google.com/file/d/1ABC123xyz456DEF/view?usp=sharing
   ```
5. O **File ID** é a parte entre `/d/` e `/view`:
   ```
   1ABC123xyz456DEF
   ```

### Usar o File ID na aplicação

No painel admin, ao criar/editar um ponto turístico:
- Cole apenas o **File ID** no campo de imagens
- Exemplo: `1ABC123xyz456DEF`
- Para múltiplas imagens, adicione vários IDs separados

### Formato das URLs geradas

A aplicação converte automaticamente os IDs em URLs de thumbnail:
```
https://drive.google.com/thumbnail?id=1ABC123xyz456DEF&sz=w600
```

Tamanhos disponíveis:
- `w400` - Miniatura pequena
- `w600` - Miniatura média (padrão nos popups)
- `w1000` - Imagem grande (para modal/detalhes)

## 📁 Estrutura do Projeto

```
descubra-piaui/
├── app/
│   ├── api/
│   │   └── points/
│   │       └── route.ts          # API CRUD de pontos turísticos
│   ├── globals.css               # Estilos globais + Leaflet
│   ├── layout.tsx                # Layout raiz
│   └── page.tsx                  # Página principal (mapa)
├── components/
│   ├── Map.tsx                   # Componente do mapa Leaflet
│   └── Sidebar.tsx               # Barra lateral com lista/busca
├── lib/
│   ├── firebase.ts               # Configuração Firebase
│   ├── geocode.ts                # Funções de geocodificação
│   └── driveUtils.ts             # Utilitários Google Drive
├── types/
│   └── index.ts                  # Tipos TypeScript
├── data/
│   └── points.json               # Dados dos pontos (persistência JSON)
├── public/                       # Arquivos estáticos
├── .env.example                  # Exemplo de variáveis de ambiente
├── package.json
├── tsconfig.json
└── README.md
```

## 🗺️ Geocodificação Automática

A aplicação implementa geocodificação automática com **múltiplas estratégias de fallback** usando a API Nominatim (OpenStreetMap):

### Estratégias (em ordem de tentativa):

1. **Por endereço completo**
   - Extrai o nome da rua do endereço
   - Busca: "Rua X, Teresina, Piauí, Brasil"
   
2. **Por CEP**
   - Remove formatação do CEP
   - Busca: `postalcode=64000000&city=Teresina&country=Brazil`
   - Adiciona pequena variação aleatória para evitar sobreposição de marcadores

3. **Por bairro**
   - Busca: "Bairro X, Teresina, PI"
   - Adiciona maior variação aleatória

### Limitações e Recomendações

⚠️ **IMPORTANTE**: A API Nominatim tem limite de **1 requisição por segundo**.

A aplicação respeita esse limite com delay automático de 1100ms entre requisições. Para produção com grande volume de dados, considere:

- **Google Maps Geocoding API** (pago, mais preciso)
- **Mapbox Geocoding API** (pago, bom custo-benefício)
- Fornecer coordenadas manualmente no painel admin

## 📊 Estrutura de Dados

### Interface `TouristPoint`
```typescript
{
  id: string;
  title: string;                  // Nome do ponto turístico
  subtitle?: string;              // Subtítulo/descrição curta
  description: string;            // Descrição exibida no popup
  descriptionLong?: string;       // Descrição completa (página de detalhes)
  category: string;               // 'museu' | 'parque' | 'monumento' | etc.
  address: string;                // Endereço completo
  neighborhood?: string;          // Bairro
  latitude?: number;              // Coordenada (auto ou manual)
  longitude?: number;             // Coordenada (auto ou manual)
  imageIds: string[];             // File IDs do Google Drive
  phone?: string;                 // Telefone de contato
  schedule?: string;              // Horário de funcionamento
  published: boolean;             // true = visível publicamente
  createdAt?: Date;               // Data de criação
  updatedAt?: Date;               // Última atualização
}
```

### Categorias Disponíveis

- 🏛️ **Museu**
- 🌳 **Parque**
- 🗿 **Monumento**
- ⛪ **Igreja**
- 🏞️ **Praça**
- 🎭 **Centro Cultural**
- 📍 **Outro**

*Edite `types/index.ts` para adicionar novas categorias.*

## 📝 API Endpoints

### `GET /api/points`
Lista pontos turísticos publicados.

**Query params:**
- `q` - Busca textual (nome, descrição, bairro, endereço)
- `category` - Filtrar por categoria (`museu`, `parque`, etc.)
- `all=true` - Incluir pontos não publicados (admin)

**Exemplo:**
```bash
GET /api/points?q=parque&category=parque
```

**Resposta:**
```json
[
  {
    "id": "1",
    "title": "Parque da Cidadania",
    "category": "parque",
    "latitude": -5.0794,
    "longitude": -42.8039,
    "published": true,
    ...
  }
]
```

### `POST /api/points`
Cria novo ponto turístico.

**Body:**
```json
{
  "title": "Theatro 4 de Setembro",
  "subtitle": "Teatro Histórico",
  "description": "Teatro histórico de 1894",
  "category": "centro-cultural",
  "address": "Praça Marechal Deodoro, Centro",
  "neighborhood": "Centro",
  "imageIds": ["1ABC123xyz"],
  "published": true
}
```

### `PUT /api/points`
Atualiza ponto existente.

**Body:**
```json
{
  "id": "1",
  "title": "Novo título",
  "description": "Nova descrição",
  ...
}
```

### `DELETE /api/points?id=1`
Remove ponto turístico.

**Exemplo:**
```bash
DELETE /api/points?id=1
```

## 🎨 Personalização

### Alterar cor primária

Substitua `red-600` por outra cor do Tailwind em todos os componentes. Exemplo:

```tsx
// De:
className="bg-red-600 text-white"

// Para:
className="bg-blue-600 text-white"
```

### Adicionar novas categorias

Edite `types/index.ts`:
```typescript
export const CATEGORIES = [
  { value: 'museu', label: 'Museu', icon: '🏛️' },
  { value: 'restaurante', label: 'Restaurante', icon: '🍽️' },  // ← NOVA
  // ...
];
```

### Alterar centro e zoom do mapa

Edite `types/index.ts`:
```typescript
export const TERESINA_CENTER: MapCenter = {
  lat: -5.0892,  // Sua latitude
  lng: -42.8019, // Sua longitude
};

export const DEFAULT_ZOOM = 12;  // Zoom inicial (10-15 recomendado)
```

## 🐛 Resolução de Problemas

### ❌ Imagens do Drive não carregam

**Possíveis causas:**
- ✅ Compartilhamento não está público
- ✅ File ID incorreto
- ✅ Pasta do Drive com restrições

**Solução:**
1. Abra a imagem no Drive
2. Clique em **Compartilhar** → **Alterar**
3. Selecione **"Qualquer pessoa com o link"**
4. Teste a URL no navegador:
   ```
   https://drive.google.com/thumbnail?id=SEU_FILE_ID&sz=w600
   ```

### ❌ Geocodificação falha

**Possíveis causas:**
- ✅ Endereço muito genérico ou inexistente
- ✅ Limite de requisições da API Nominatim excedido
- ✅ Sem conexão com internet

**Solução:**
1. Forneça endereços mais específicos (nome da rua, número)
2. Respeite o delay de 1.1s entre requisições
3. Ou forneça latitude/longitude manualmente no admin

### ❌ Mapa não carrega

**Possíveis causas:**
- ✅ Componente não importado com `dynamic` (SSR ativo)
- ✅ Dependências Leaflet não instaladas
- ✅ CSS do Leaflet não importado

**Solução:**
1. Verifique se o Map está importado assim:
   ```tsx
   const Map = dynamic(() => import('@/components/Map'), { ssr: false });
   ```
2. Reinstale dependências:
   ```bash
   npm install leaflet react-leaflet leaflet.markercluster
   ```

### ❌ Erros de TypeScript

**Solução:**
```bash
npm install --save-dev @types/leaflet @types/leaflet.markercluster
```

## 📜 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**João Lucas** — joaolucas.m.s.carvalho@gmail.com

Desenvolvido com ❤️ para promover o turismo no Piauí

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

1. Fork o projeto
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b feature/nova-feature
   ```
3. Commit suas mudanças:
   ```bash
   git commit -m 'Adiciona nova feature'
   ```
4. Push para a branch:
   ```bash
   git push origin feature/nova-feature
   ```
5. Abra um Pull Request

---

**Descubra Piauí** 🌴 | por João Lucas | Desenvolvido com Next.js + Leaflet

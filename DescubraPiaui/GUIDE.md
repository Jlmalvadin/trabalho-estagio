# 📋 Guia de Uso - Descubra Piauí

Este guia complementa o README.md com instruções práticas de uso.

## 🚀 Início Rápido

### 1. Teste Local

Após a instalação, acesse:
- **Mapa público**: http://localhost:3000
- **Painel admin**: http://localhost:3000/admin (em construção)

### 2. Adicionar Pontos Turísticos

#### Opção A: Manualmente via Código

Edite o arquivo `data/points.json` e adicione novos pontos:

```json
{
  "id": "4",
  "title": "Museu do Piauí",
  "subtitle": "História e Cultura Piauiense",
  "description": "Principal museu histórico do estado do Piauí.",
  "descriptionLong": "O Museu do Piauí preserva a história e cultura piauiense através de exposições permanentes e temporárias com acervos arqueológicos, históricos e artísticos.",
  "category": "museu",
  "address": "Praça Marechal Deodoro, 341, Centro",
  "neighborhood": "Centro",
  "imageIds": [""],
  "phone": "(86) 3221-7869",
  "schedule": "Terça a Sábado, 8h às 17h",
  "published": true
}
```

#### Opção B: Via API (futuro painel admin)

```bash
curl -X POST http://localhost:3000/api/points \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Palácio de Karnak",
    "category": "monumento",
    "address": "Praça Pedro II, Centro",
    "neighborhood": "Centro",
    "description": "Sede do governo estadual",
    "published": true
  }'
```

## 🖼️ Adicionar Imagens do Google Drive

### Passo a passo completo:

1. **Upload da Imagem**
   - Faça login no Google Drive (https://drive.google.com)
   - Clique em **"Novo"** → **"Upload de arquivo"**
   - Selecione a imagem do ponto turístico

2. **Compartilhar Publicamente**
   - Clique com o botão direito na imagem
   - Selecione **"Compartilhar"**
   - Clique em **"Alterar"** ao lado de "Acesso restrito"
   - Escolha **"Qualquer pessoa com o link"**
   - Clique em **"Concluído"**

3. **Copiar o Link**
   - Clique em **"Copiar link"**
   - Você receberá algo como:
     ```
     https://drive.google.com/file/d/1ABC123xyz456DEF789/view?usp=sharing
     ```

4. **Extrair o File ID**
   - O File ID está entre `/d/` e `/view`:
     ```
     1ABC123xyz456DEF789
     ```

5. **Adicionar ao Ponto Turístico**
   
   Edite `data/points.json`:
   ```json
   {
     "id": "1",
     "title": "Theatro 4 de Setembro",
     "imageIds": ["1ABC123xyz456DEF789"],
     ...
   }
   ```

   Para **múltiplas imagens**:
   ```json
   {
     "imageIds": [
       "1ABC123xyz456DEF789",
       "1DEF456abc789GHI012",
       "1GHI789def012JKL345"
     ]
   }
   ```

### Testar se a imagem carrega

Abra no navegador:
```
https://drive.google.com/thumbnail?id=1ABC123xyz456DEF789&sz=w600
```

Se a imagem aparecer, está funcionando! ✅

## 📍 Adicionar Coordenadas (Latitude/Longitude)

### Opção 1: Google Maps

1. Abra https://www.google.com/maps
2. Pesquise o endereço do ponto turístico
3. Clique com o botão direito no local exato
4. Selecione as coordenadas (primeiro número é latitude, segundo é longitude)

Exemplo: `-5.0895, -42.8019`

### Opção 2: Geocodificação Automática

Deixe `latitude` e `longitude` vazios e forneça:
- `address` completo
- `cep` (se disponível)
- `neighborhood`

A aplicação tentará geocodificar automaticamente.

### Opção 3: OpenStreetMap

1. Abra https://www.openstreetmap.org
2. Pesquise o local
3. Clique com botão direito → "Mostrar endereço"
4. Copie as coordenadas

## 🗂️ Categorias Disponíveis

Use um desses valores no campo `category`:

| Valor | Label | Ícone | Exemplo |
|-------|-------|-------|---------|
| `museu` | Museu | 🏛️ | Museu do Piauí |
| `parque` | Parque | 🌳 | Parque da Cidadania |
| `monumento` | Monumento | 🗿 | Palácio de Karnak |
| `igreja` | Igreja | ⛪ | Catedral de Teresina |
| `praça` | Praça | 🏞️ | Praça Pedro II |
| `centro-cultural` | Centro Cultural | 🎭 | Theatro 4 de Setembro |
| `outro` | Outro | 📍 | Qualquer outro tipo |

## 🔄 Importar Dados em Massa

### Formato JSON de Importação

Crie um arquivo `import.json`:

```json
[
  {
    "title": "Ponto 1",
    "category": "museu",
    "address": "Endereço 1",
    "published": true
  },
  {
    "title": "Ponto 2",
    "category": "parque",
    "address": "Endereço 2",
    "published": true
  }
]
```

### Importar via Código

Substitua o conteúdo de `data/points.json` pelo seu arquivo de importação.

## 📊 Exemplos de Pontos Turísticos de Teresina

Aqui estão alguns pontos reais para você adicionar:

```json
[
  {
    "id": "5",
    "title": "Ponte Estaiada",
    "subtitle": "Cartão Postal de Teresina",
    "description": "Ponte moderna que conecta as zonas norte e sul da cidade.",
    "category": "monumento",
    "address": "Av. Raul Lopes",
    "neighborhood": "Noivos",
    "latitude": -5.0794,
    "longitude": -42.7864,
    "phone": "",
    "schedule": "Acesso livre",
    "published": true
  },
  {
    "id": "6",
    "title": "Parque Potycabana",
    "subtitle": "Complexo de Lazer Urbano",
    "description": "Parque temático com lago, bar flutuante e área de lazer.",
    "category": "parque",
    "address": "Av. Boa Esperança, Poti Velho",
    "neighborhood": "Poti Velho",
    "latitude": -5.0580,
    "longitude": -42.7735,
    "phone": "(86) 3215-7774",
    "schedule": "Terça a Domingo, 8h às 18h",
    "published": true
  },
  {
    "id": "7",
    "title": "Catedral Metropolitana",
    "subtitle": "Nossa Senhora da Assunção",
    "description": "Principal igreja católica de Teresina.",
    "category": "igreja",
    "address": "Praça Saraiva, Centro",
    "neighborhood": "Centro",
    "latitude": -5.0907,
    "longitude": -42.8028,
    "phone": "(86) 3221-5081",
    "schedule": "Diariamente",
    "published": true
  }
]
```

## 🎨 Personalizar Cores e Estilos

### Alterar cor principal (de vermelho para azul)

1. **Tailwind CSS**

Substitua todas as ocorrências de `red-600` por `blue-600`:

```tsx
// components/Sidebar.tsx
className="bg-blue-600 text-white"  // era red-600
```

2. **Clusters do Mapa**

Edite `app/globals.css`:

```css
.marker-cluster-small div {
  background-color: rgba(37, 99, 235, 0.8) !important;  /* blue-600 */
}
```

3. **Ícones personalizados**

Edite `components/Map.tsx`:

```tsx
background: #2563eb;  // blue-600 (era #dc2626)
```

## ⚡ Performance e Otimização

### Pré-carregar imagens

Para melhorar a experiência, você pode pré-carregar as thumbnails:

```typescript
import { preloadImages, getDriveImageUrl } from '@/lib/driveUtils';

// Antes de renderizar
const imageUrls = points
  .flatMap(p => p.imageIds)
  .map(id => getDriveImageUrl(id, 'medium'));

await preloadImages(imageUrls);
```

### Lazy Loading

As imagens já usam `loading="lazy"` por padrão nos popups.

## 🐛 Troubleshooting

### Problema: Mapa não aparece

**Solução 1**: Verifique o console do navegador (F12)

**Solução 2**: Confirme que Leaflet está importado corretamente:
```bash
npm install leaflet react-leaflet leaflet.markercluster
```

**Solução 3**: Limpe o cache:
```bash
npm run dev -- --clean
```

### Problema: Coordenadas erradas

**Solução**: Use uma ferramenta de geocoding online para conferir:
- https://www.latlong.net/
- https://nominatim.openstreetmap.org/ui/search.html

### Problema: Imagem do Drive não carrega

**Checklist**:
- [ ] Imagem está compartilhada publicamente?
- [ ] File ID está correto?
- [ ] URL funciona no navegador?
- [ ] Não há espaços ou caracteres especiais no ID?

## 📱 Testar Responsividade

### Desktop
- Sidebar à esquerda (350px)
- Mapa à direita (restante)

### Tablet (< 768px)
- Sidebar acima (50% altura)
- Mapa abaixo (50% altura)

### Mobile (< 480px)
- Stack vertical
- Sidebar com scroll

Para testar, use o DevTools (F12) → Toggle device toolbar

## 🚢 Deploy em Produção

### Vercel (Recomendado)

1. Crie conta em https://vercel.com
2. Instale Vercel CLI:
   ```bash
   npm i -g vercel
   ```
3. Deploy:
   ```bash
   vercel
   ```
4. Configure as variáveis de ambiente no painel Vercel

### Outras opções
- **Netlify**: Similar ao Vercel
- **AWS Amplify**: Para integração com AWS
- **Self-hosted**: `npm run build && npm start`

## 📚 Recursos Adicionais

- **Leaflet Docs**: https://leafletjs.com/reference.html
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Nominatim API**: https://nominatim.org/release-docs/latest/api/Overview/

---

Dúvidas? Abra uma issue no GitHub! 🚀

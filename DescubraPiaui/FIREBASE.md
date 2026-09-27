# 🔥 Configuração do Firebase

Este guia explica como configurar o Firebase para autenticação do painel administrativo.

## Passo 1: Criar Projeto no Firebase

1. Acesse https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"**
3. Nome do projeto: `descubra-piaui` (ou outro nome)
4. Aceite os termos e clique em **"Continuar"**
5. (Opcional) Desabilite Google Analytics se não for usar
6. Clique em **"Criar projeto"**

## Passo 2: Adicionar App Web

1. No painel do projeto, clique no ícone **"Web"** (`</>`)
2. Apelido do app: `Mapa de Pontos Turísticos`
3. **NÃO** marque "Configurar Firebase Hosting" (vamos usar Vercel)
4. Clique em **"Registrar app"**
5. **COPIE AS CREDENCIAIS** que aparecem:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Passo 3: Configurar Variáveis de Ambiente

1. Crie o arquivo `.env.local` na raiz do projeto:
   ```bash
   cp .env.example .env.local
   ```

2. Cole suas credenciais:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

## Passo 4: Ativar Authentication

1. No painel do Firebase, vá em **"Authentication"** no menu lateral
2. Clique em **"Começar"**
3. Na aba **"Sign-in method"**, clique em **"Email/Password"**
4. Ative o toggle **"Ativar"**
5. Clique em **"Salvar"**

## Passo 5: Criar Usuário Administrador

1. Ainda em **"Authentication"**, vá na aba **"Users"**
2. Clique em **"Adicionar usuário"**
3. Preencha:
   - **Email**: admin@pontosturisticos.com (ou seu email)
   - **Senha**: Crie uma senha forte (mín. 6 caracteres)
4. Clique em **"Adicionar usuário"**

## Passo 6: (Opcional) Configurar Firestore

Se quiser usar Firestore em vez de JSON para persistência:

1. No painel do Firebase, vá em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Iniciar no modo de produção"**
4. Selecione a localização: `southamerica-east1` (São Paulo)
5. Clique em **"Ativar"**

### Regras de Segurança do Firestore

Vá em **"Regras"** e adicione:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura pública de pontos publicados
    match /points/{pointId} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null;
    }
    
    // Apenas admins podem ler/escrever usuários
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Passo 7: Testar Localmente

1. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse o painel admin (quando implementado):
   ```
   http://localhost:3000/admin
   ```

3. Faça login com as credenciais criadas no Passo 5

## Passo 8: Deploy em Produção

### Vercel

1. No painel da Vercel, vá em **Settings** → **Environment Variables**
2. Adicione TODAS as variáveis do `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

3. Faça um novo deploy:
   ```bash
   vercel --prod
   ```

## Segurança

### ⚠️ IMPORTANTE

- **NUNCA** commite `.env.local` no Git
- As variáveis `NEXT_PUBLIC_*` são expostas no frontend (isso é esperado)
- Para APIs sensíveis, use variáveis sem `NEXT_PUBLIC_` e acesse apenas no backend

### Verificar .gitignore

Confirme que `.env.local` está no `.gitignore`:

```gitignore
# .gitignore
.env*.local
```

## Estrutura de Dados Firestore (Opcional)

Se optar por Firestore, use esta estrutura:

### Coleção `points`

```javascript
{
  id: "auto-generated",
  title: "Theatro 4 de Setembro",
  subtitle: "Teatro Histórico",
  description: "Teatro histórico de 1894",
  descriptionLong: "...",
  category: "centro-cultural",
  address: "Praça Marechal Deodoro, Centro",
  neighborhood: "Centro",
  latitude: -5.0895,
  longitude: -42.8019,
  imageIds: ["1ABC123xyz"],
  phone: "(86) 3221-7834",
  schedule: "Seg-Sex 14h-18h",
  published: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Migrar de JSON para Firestore

Crie um script `scripts/migrate-to-firestore.ts`:

```typescript
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import pointsData from '@/data/points.json';

async function migrate() {
  const pointsRef = collection(db, 'points');
  
  for (const point of pointsData) {
    await addDoc(pointsRef, {
      ...point,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  
  console.log('Migração concluída!');
}

migrate();
```

Execute:
```bash
npx ts-node scripts/migrate-to-firestore.ts
```

## Troubleshooting

### Erro: "Firebase App not initialized"

**Solução**: Verifique se as variáveis de ambiente estão corretas em `.env.local`

### Erro: "Auth domain not authorized"

**Solução**: 
1. Vá em **Authentication** → **Settings** → **Authorized domains**
2. Adicione seu domínio (ex: `pontosturisticos.vercel.app`)

### Erro: "Missing or insufficient permissions"

**Solução**: Revise as regras do Firestore (Passo 6)

## Recursos

- **Firebase Console**: https://console.firebase.google.com/
- **Documentação**: https://firebase.google.com/docs/web/setup
- **Firebase Auth**: https://firebase.google.com/docs/auth/web/start
- **Firestore**: https://firebase.google.com/docs/firestore

---

Configuração completa! 🔥

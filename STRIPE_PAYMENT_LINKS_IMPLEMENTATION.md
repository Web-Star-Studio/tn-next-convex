# 🔗 Sistema de Payment Links do Stripe - Implementação Completa

## 📋 Visão Geral

Esta implementação substitui o sistema complexo de pagamentos por uma abordagem muito mais simples e eficiente usando **Payment Links** do Stripe. 

### 🎯 Fluxo Simplificado

1. **Asset criado** → **Produto + Payment Link do Stripe criados automaticamente**
2. **Usuário clica para reservar** → **Redirecionado para Payment Link do Stripe**
3. **Reserva criada** → **Status "paid" (pagamento realizado)**
4. **Partner confirma** → **Reserva ativa** (fluxo normal continua)

---

## 🚀 Componentes Implementados

### 1. **Schema Updates**
Adicionamos campos Stripe em todas as tabelas de assets:

```typescript
// Novos campos em: activities, events, restaurants, vehicles, accommodations
stripeProductId: v.optional(v.string()),          // Stripe Product ID
stripePaymentLinkId: v.optional(v.string()),       // Stripe Payment Link ID  
stripePaymentLinkUrl: v.optional(v.string()),      // Stripe Payment Link URL
```

### 2. **Payment Actions** (`convex/domains/payments/actions.ts`)
- `createStripeProductAndPaymentLink` - Cria produto e payment link automaticamente
- `updateStripeProductAndPaymentLink` - Atualiza informações do produto
- `deactivateStripeProductAndPaymentLink` - Desativa quando asset é deletado

### 3. **Asset Mutations Updates**
As mutations de criação de assets agora automaticamente:
- Criam produto no Stripe
- Geram payment link
- Salvam URLs no banco de dados

### 4. **Webhook Handler** (`src/app/api/stripe/webhook/route.ts`)
Novo evento processado:
- `checkout.session.completed` - Processa pagamentos via payment links

### 5. **New Booking Mutations**
Mutations específicas para payment links:
- `createActivityBookingFromPaymentLink`
- `createEventBookingFromPaymentLink`  
- `createRestaurantReservationFromPaymentLink`

### 6. **React Component** (`src/components/PaymentLinkButton.tsx`)
Componente pronto para usar com payment links.

---

## 💻 Como Usar

### 1. **Criando um Asset**
```typescript
// Ao criar uma activity (exemplo)
const activityId = await convex.mutation(api.domains.activities.mutations.create, {
  title: "Mergulho com Tartarugas",
  description: "Experiência incrível...",
  price: 150.00, // Em reais
  // ... outros campos
});

// Automaticamente:
// ✅ Produto criado no Stripe  
// ✅ Payment Link gerado
// ✅ URLs salvas no banco
```

### 2. **Usando o Payment Link no Frontend**
```tsx
import { PaymentLinkButton } from "@/components/PaymentLinkButton";

function ActivityCard({ activity }) {
  return (
    <div>
      <h3>{activity.title}</h3>
      <p>{activity.description}</p>
      
      <PaymentLinkButton
        assetName={activity.title}
        assetType="activity"
        price={activity.price}
        stripePaymentLinkUrl={activity.stripePaymentLinkUrl}
        isActive={activity.isActive}
        onReserveClick={() => {
          // Analytics, logs, etc.
          console.log("Usuario clicou para reservar");
        }}
      />
    </div>
  );
}
```

### 3. **Fluxo de Reserva**
1. **Usuário clica** → Redirecionado para Stripe
2. **Pagamento realizado** → Webhook recebe `checkout.session.completed`
3. **Reserva criada automaticamente** → Status "paid" 
4. **Partner recebe notificação** → Pode confirmar/cancelar
5. **Fluxo normal continua** → Chat, emails, etc.

---

## 🔧 Configuração Necessária

### 1. **Variáveis de Ambiente**
```bash
# Já existentes
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Nova (opcional)
NEXT_PUBLIC_APP_URL=https://tucanoronha.com
```

### 2. **Webhook Stripe**
Configure um webhook no Stripe Dashboard para:
- **URL**: `https://seudominio.com/api/stripe/webhook`
- **Eventos**: `checkout.session.completed`

### 3. **Deploy**
```bash
# Deploy do Convex
npx convex deploy

# Deploy do Next.js (Vercel, etc.)
npm run build && npm start
```

---

## 📊 Vantagens da Nova Implementação

### ✅ **Simplicidade**
- **Zero código de UI** de pagamento customizada
- **Stripe cuida de tudo**: formulários, validação, 3D Secure
- **Menos bugs** e problemas de compatibilidade

### ✅ **Segurança**
- **PCI Compliance automático** via Stripe
- **Sem dados sensíveis** no nosso servidor
- **URLs públicas** mas seguras do Stripe

### ✅ **UX Superior**
- **Interface otimizada** do Stripe
- **Suporte mobile nativo**
- **Múltiplas formas de pagamento**

### ✅ **Manutenção Reduzida**
- **Menos código para manter**
- **Updates automáticos** do Stripe
- **Monitoramento integrado**

---

## 🎯 Status dos Assets

### **Implementado**
- ✅ Activities
- ✅ Events  
- ✅ Restaurants (básico)

### **Próximos Passos**
- 🔄 Vehicles 
- 🔄 Accommodations
- 🔄 Packages

### **Melhorias Futuras**
- 📅 Seleção de datas no payment link
- 👥 Quantidade/participantes customizável
- 🎫 Múltiplos tipos de ingresso
- 📧 Emails customizados pós-pagamento

---

## 🛠️ Customizações Avançadas

### **Payment Link com Metadados**
```typescript
// Personalizar success URL
const paymentLink = await stripe.paymentLinks.create({
  line_items: [...],
  after_completion: {
    type: "redirect",
    redirect: {
      url: `${baseUrl}/reservas/sucesso?asset=${assetId}&type=${assetType}`,
    },
  },
  metadata: {
    assetType,
    assetId,
    customField: "valor",
  },
});
```

### **Webhooks Customizados**
```typescript
// No webhook handler
if (flow === "asset_reservation") {
  // Lógica personalizada
  const { customField } = session.metadata;
  
  // Processar dados extras
  await processCustomData(customField);
}
```

---

## 🚨 Importante

### **Ambiente de Teste**
- Use **chaves de teste** do Stripe durante desenvolvimento
- **Payment links de teste** não processam pagamentos reais
- **Card test**: `4242 4242 4242 4242`

### **Produção**  
- Configure **webhooks de produção**
- Use **chaves live** do Stripe
- Teste o **fluxo completo** antes do lançamento

### **Monitoramento**
- Acompanhe **logs do webhook** no Convex
- Monitore **eventos no Stripe Dashboard**
- Configure **alertas** para falhas

---

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. **Verifique os logs** do Convex Dashboard
2. **Confira o Stripe Dashboard** para eventos de webhook
3. **Teste com payment links** de desenvolvimento primeiro
4. **Consulte a documentação** do Stripe sobre Payment Links

---

**🎉 Sistema implementado com sucesso! Agora é só usar e aproveitar a simplicidade dos Payment Links do Stripe.** 
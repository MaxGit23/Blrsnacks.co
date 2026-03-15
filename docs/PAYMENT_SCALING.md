# Blrsnacks.co — Payment Gateway Scaling Plan

## Current State: Cash on Delivery (COD)

The platform currently supports **COD only** as defined in the Prisma schema:

```prisma
enum PaymentMethod {
  COD
}
```

This document outlines the exact steps to integrate real payment gateways while preserving the COD option.

---

## Recommended Gateway: Razorpay

Best fit for Indian e-commerce: UPI, cards, netbanking, wallets. Alternative: Cashfree or PayU.

---

## Step 1: Schema Changes

```prisma
// prisma/schema.prisma

enum PaymentMethod {
  COD
  RAZORPAY
  STRIPE     // future international support
}

enum PaymentStatus {
  PENDING
  AUTHORIZED
  CAPTURED
  FAILED
  REFUNDED
}

model Payment {
  id              String        @id @default(uuid())
  orderId         String        @unique
  order           Order         @relation(fields: [orderId], references: [id])
  method          PaymentMethod
  status          PaymentStatus @default(PENDING)
  gatewayId       String?       // Razorpay payment_id or Stripe payment_intent_id
  gatewayOrderId  String?       // Razorpay order_id
  amount          Decimal       @db.Decimal(10, 2)
  currency        String        @default("INR")
  metadata        Json?         // Gateway-specific response data
  paidAt          DateTime?
  refundedAt      DateTime?

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([orderId])
  @@index([gatewayId])
}

// Add to Order model:
model Order {
  // ... existing fields
  payment Payment?
}
```

Run migration:
```bash
npx prisma migrate dev --name add-payment-model
```

---

## Step 2: Backend — Payment Module

### Install SDK

```bash
cd backend
npm install razorpay
npm install -D @types/razorpay  # if available, or create custom types
```

### Create Payment Module

```
backend/src/modules/payments/
├── payments.module.ts
├── payments.controller.ts
├── payments.service.ts
├── dto/
│   ├── create-payment.dto.ts
│   └── verify-payment.dto.ts
└── razorpay.provider.ts
```

### Payment Flow

```
┌──────────┐    ┌──────────┐    ┌───────────┐    ┌──────────┐
│ Frontend │───▶│ Backend  │───▶│ Razorpay  │───▶│ Webhook  │
│          │    │          │    │ API       │    │ Callback │
└──────────┘    └──────────┘    └───────────┘    └──────────┘
     │               │                                │
     │    1. POST /payments/create-order               │
     │◀──────────────│ (returns razorpay_order_id)     │
     │               │                                │
     │    2. Razorpay Checkout opens in browser        │
     │               │                                │
     │    3. POST /payments/verify                     │
     │──────────────▶│ (razorpay_payment_id + sig)     │
     │               │                                │
     │               │    4. Verify signature           │
     │               │    5. Update Payment status      │
     │               │    6. Confirm Order               │
     │◀──────────────│ (order confirmed)               │
     │               │                                │
     │               │    7. Webhook backup             │
     │               │◀───────────────────────────────│
```

### Key Service Methods

```typescript
// payments.service.ts

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  // 1. Create Razorpay order
  async createOrder(orderId: string): Promise<{ razorpayOrderId: string; amount: number; key: string }> {
    const order = await this.prisma.order.findUniqueOrThrow({
      where: { id: orderId },
    });

    const razorpay = new Razorpay({
      key_id: this.config.get('RAZORPAY_KEY_ID'),
      key_secret: this.config.get('RAZORPAY_KEY_SECRET'),
    });

    const rpOrder = await razorpay.orders.create({
      amount: Number(order.totalAmount) * 100, // paise
      currency: 'INR',
      receipt: orderId,
    });

    await this.prisma.payment.create({
      data: {
        orderId,
        method: 'RAZORPAY',
        amount: order.totalAmount,
        gatewayOrderId: rpOrder.id,
        status: 'PENDING',
      },
    });

    return {
      razorpayOrderId: rpOrder.id,
      amount: rpOrder.amount,
      key: this.config.get('RAZORPAY_KEY_ID'),
    };
  }

  // 2. Verify payment signature
  async verifyPayment(razorpayPaymentId: string, razorpayOrderId: string, signature: string): Promise<void> {
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', this.config.get('RAZORPAY_KEY_SECRET'))
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid payment signature');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { gatewayOrderId: razorpayOrderId },
        data: {
          gatewayId: razorpayPaymentId,
          status: 'CAPTURED',
          paidAt: new Date(),
        },
      });

      const payment = await tx.payment.findUnique({
        where: { gatewayOrderId: razorpayOrderId },
      });

      await tx.order.update({
        where: { id: payment.orderId },
        data: { status: 'CONFIRMED' },
      });
    });
  }
}
```

---

## Step 3: Environment Variables

Add to `env.validation.ts`:

```typescript
RAZORPAY_KEY_ID: Joi.string().optional().allow(''),
RAZORPAY_KEY_SECRET: Joi.string().optional().allow(''),
RAZORPAY_WEBHOOK_SECRET: Joi.string().optional().allow(''),
```

Add to `.env.example`:

```env
# ─── Payment Gateway (Razorpay) ─────────────────────────────────────────────
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxx
```

---

## Step 4: Frontend — Checkout Integration

### Install Razorpay Script

```typescript
// lib/razorpay.ts
export function loadRazorpay(): Promise<void> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}
```

### Checkout Page Update

```typescript
// In checkout page — after order is placed with paymentMethod: 'RAZORPAY'

const { razorpayOrderId, amount, key } = await paymentsApi.createOrder(order.id);

await loadRazorpay();

const options = {
  key,
  amount,
  currency: 'INR',
  name: 'BLR Snacks',
  description: 'Order Payment',
  order_id: razorpayOrderId,
  handler: async (response) => {
    await paymentsApi.verify({
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
    });
    router.push(`/orders/${order.id}?payment=success`);
  },
  prefill: { email: user.email },
  theme: { color: '#22c55e' }, // brand-primary
};

const razorpay = new (window as any).Razorpay(options);
razorpay.open();
```

---

## Step 5: Webhook Handler

```typescript
// payments.controller.ts

@Post('webhook')
@HttpCode(200)
async handleWebhook(@Req() req: Request, @Headers('x-razorpay-signature') signature: string) {
  const body = JSON.stringify(req.body);
  const expectedSig = crypto
    .createHmac('sha256', this.config.get('RAZORPAY_WEBHOOK_SECRET'))
    .update(body)
    .digest('hex');

  if (expectedSig !== signature) {
    throw new UnauthorizedException('Invalid webhook signature');
  }

  const event = req.body;
  if (event.event === 'payment.captured') {
    // Idempotent update — safe to receive multiple times
    await this.paymentsService.markAsCaptured(event.payload.payment.entity.id);
  }

  return { status: 'ok' };
}
```

---

## Step 6: Refund Support

```typescript
async refundPayment(orderId: string, amount?: number): Promise<void> {
  const payment = await this.prisma.payment.findUnique({
    where: { orderId },
  });

  if (!payment || payment.status !== 'CAPTURED') {
    throw new BadRequestException('Payment cannot be refunded');
  }

  const razorpay = new Razorpay({ ... });
  await razorpay.payments.refund(payment.gatewayId, {
    amount: amount ? amount * 100 : undefined, // partial or full
  });

  await this.prisma.payment.update({
    where: { id: payment.id },
    data: { status: 'REFUNDED', refundedAt: new Date() },
  });
}
```

---

## Migration Strategy (COD → COD + Online)

1. **Phase 1 (current)**: COD only — working and tested
2. **Phase 2**: Add Razorpay in **test mode** — let users choose COD or online
3. **Phase 3**: Enable live Razorpay keys after PCI-DSS compliance review
4. **Phase 4**: Add Stripe for international orders (if needed)

### Backward Compatibility

- COD orders continue to work as before (no payment record created)
- Payment model is optional (`payment Payment?` on Order)
- Frontend checkout conditionally shows payment options based on `paymentMethod` selection
- Admin orders page already shows `paymentMethod` field

---

## Checklist Before Go-Live

- [ ] Complete Razorpay business verification
- [ ] Test with Razorpay test keys (card: 4111 1111 1111 1111)
- [ ] Configure webhook URL in Razorpay dashboard
- [ ] Set up refund workflow in admin panel
- [ ] Add payment status to admin orders table
- [ ] Handle payment failures gracefully (retry, timeout)
- [ ] Log all payment events for audit trail
- [ ] Enable Razorpay PG dashboard alerts

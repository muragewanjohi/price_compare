# API Documentation

## Authentication

All API endpoints require authentication using a Bearer token:

```http
Authorization: Bearer <your_api_key>
```

## Endpoints

### Pricing Pages

#### Create Pricing Page
```http
POST /api/v1/pricing-pages
```

**Request Body:**
```json
{
  "name": "Enterprise Pricing",
  "template": "enterprise",
  "tiers": [
    {
      "name": "Basic",
      "price": 29,
      "interval": "month",
      "features": ["Feature 1", "Feature 2"]
    }
  ],
  "settings": {
    "currency": "usd",
    "showAnnualPricing": true
  }
}
```

#### Get Pricing Page
```http
GET /api/v1/pricing-pages/:id
```

#### Update Pricing Page
```http
PUT /api/v1/pricing-pages/:id
```

#### Delete Pricing Page
```http
DELETE /api/v1/pricing-pages/:id
```

### A/B Tests

#### Create A/B Test
```http
POST /api/v1/ab-tests
```

**Request Body:**
```json
{
  "name": "Pricing Test",
  "pricingPageId": "page_123",
  "variants": [
    {
      "name": "Control",
      "trafficPercentage": 50,
      "pricingTiers": [...]
    },
    {
      "name": "Variant A",
      "trafficPercentage": 50,
      "pricingTiers": [...]
    }
  ],
  "metrics": ["conversion_rate", "revenue"]
}
```

#### Get Test Results
```http
GET /api/v1/ab-tests/:id/results
```

### Analytics

#### Get Revenue Analytics
```http
GET /api/v1/analytics/revenue
```

**Query Parameters:**
- `startDate`: ISO date string
- `endDate`: ISO date string
- `metrics`: Array of metrics to include

#### Get Conversion Analytics
```http
GET /api/v1/analytics/conversion
```

### Stripe Integration

#### Connect Stripe Account
```http
POST /api/v1/stripe/connect
```

#### Get Stripe Products
```http
GET /api/v1/stripe/products
```

### Stripe API Integration Guide

#### Prerequisites
- Stripe account with API access
- Stripe API keys (publishable and secret)
- Webhook endpoint configured

#### Authentication
```javascript
// Initialize Stripe with your publishable key
const stripe = Stripe('pk_test_your_publishable_key');
```

#### Required Stripe API Keys
```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Stripe Product Creation
```javascript
// Create a product with pricing tiers
const product = await stripe.products.create({
  name: 'Premium Plan',
  description: 'Premium subscription plan',
  metadata: {
    pricing_page_id: 'page_123'
  }
});

// Create price for the product
const price = await stripe.prices.create({
  product: product.id,
  unit_amount: 2900, // $29.00
  currency: 'usd',
  recurring: {
    interval: 'month'
  }
});
```

#### Webhook Handling
```javascript
// Example webhook handler
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful checkout
      break;
    case 'customer.subscription.updated':
      // Handle subscription updates
      break;
    // ... handle other events
  }
});
```

#### Required Stripe Events
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

#### Stripe Elements Integration
```javascript
// Initialize Stripe Elements
const elements = stripe.elements();

// Create card element
const card = elements.create('card');
card.mount('#card-element');

// Handle form submission
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const {token, error} = await stripe.createToken(card);
  if (error) {
    // Handle error
  } else {
    // Send token to your server
  }
});
```

#### Error Handling
```javascript
// Common Stripe errors to handle
const stripeErrors = {
  'card_error': 'Card details are incorrect',
  'validation_error': 'Invalid input data',
  'api_error': 'Stripe API error',
  'idempotency_error': 'Duplicate request'
};
```

#### Testing
```javascript
// Test card numbers
const testCards = {
  success: '4242 4242 4242 4242',
  decline: '4000 0000 0000 0002',
  authentication: '4000 0025 0000 3155'
};
```

#### Best Practices
1. Always use test keys in development
2. Implement proper error handling
3. Use webhooks for async events
4. Keep API keys secure
5. Follow Stripe's PCI compliance guidelines
6. Implement idempotency for API calls
7. Use Stripe Elements for secure card input
8. Handle failed payments gracefully

#### Rate Limits
- API requests: 100 per second
- Webhook events: 1000 per second
- Checkout sessions: 100 per minute

#### Security Considerations
1. Never expose secret keys in client-side code
2. Validate webhook signatures
3. Use HTTPS for all API calls
4. Implement proper error logging
5. Monitor for suspicious activity
6. Keep Stripe.js and Elements up to date

## Webhooks

### Available Events

- `pricing_page.created`
- `pricing_page.updated`
- `pricing_page.deleted`
- `ab_test.started`
- `ab_test.completed`
- `subscription.created`
- `subscription.updated`
- `subscription.cancelled`

### Webhook Payload Example
```json
{
  "event": "pricing_page.created",
  "timestamp": "2024-03-27T12:00:00Z",
  "data": {
    "id": "page_123",
    "name": "Enterprise Pricing",
    "created_at": "2024-03-27T12:00:00Z"
  }
}
```

## Rate Limits

- 100 requests per minute per API key
- 1000 requests per hour per API key
- Rate limit headers included in all responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Error Responses

All errors follow this format:
```json
{
  "error": {
    "code": "error_code",
    "message": "Human readable error message",
    "details": {}
  }
}
```

Common error codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error
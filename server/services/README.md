# eCommerce Microservices Architecture

This project has been converted into a distributed microservices architecture with the following components:

## Services Overview

### 1. **API Gateway** (Port 8080)
- Central entry point for all client requests
- Routes requests to appropriate microservices
- Handles authentication context (customer ID)
- File: `services/gateway/gateway.js`

### 2. **Product Service** (Port 8081)
- Manages product catalog
- Endpoints:
  - `GET /api/products` - List all products
  - `GET /api/products/:productId` - Get product details
- File: `services/product/product-service.js`

### 3. **Cart Service** (Port 8082)
- Manages shopping carts
- Calls Product Service to validate products
- Endpoints:
  - `GET /api/cart` - Get user's cart
  - `POST /api/cart/items` - Add item to cart
  - `PATCH /api/cart/items/:productId` - Update item quantity
  - `DELETE /api/cart/items/:productId` - Remove item from cart
  - `DELETE /api/cart` - Clear cart
- File: `services/cart/cart-service.js`

### 4. **Order Service** (Port 8083)
- Manages orders and checkout
- Calls Cart Service and Payment Service
- Endpoints:
  - `GET /api/orders` - List user's orders
  - `POST /api/orders` - Create new order
- File: `services/order/order-service.js`

### 5. **Payment Service** (Port 8084)
- Processes payments
- Currently uses DummyPaymentProvider (mock)
- Endpoints:
  - `POST /api/payments/charge` - Process payment
  - `GET /api/payments/provider` - Get payment provider info
- File: `services/payment/payment-service.js`

## Architecture Features

- **Service-to-Service Communication**: Uses HTTP requests with the `makeServiceRequest` utility
- **Customer Context**: Each request includes `x-customer-id` header for multi-tenant support
- **Error Handling**: Centralized error handler for consistent error responses
- **Shared Utilities**: Common middleware, configs, and utilities in `services/shared/`
- **MVC Pattern**: Each service follows Models-Views-Controllers pattern with services and repositories

## Installation

```bash
cd server
npm install
```

## Running the Services

### Option 1: Run all services together (Recommended for development)
```bash
npm run dev
```

This command runs:
- API Gateway on port 8080
- Product Service on port 8081
- Cart Service on port 8082
- Order Service on port 8083
- Payment Service on port 8084
- Client on port 3000

### Option 2: Run individual services
```bash
# Terminal 1: API Gateway
npm run gateway

# Terminal 2: Product Service
npm run product-service

# Terminal 3: Cart Service
npm run cart-service

# Terminal 4: Order Service
npm run order-service

# Terminal 5: Payment Service
npm run payment-service

# Terminal 6: Client (from client directory)
npm start
```

### Option 3: Production mode
```bash
npm start
# This runs only the API Gateway. Services should be started separately in production.
```

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=8080
DEV_MODE=development
CLIENT_ORIGIN=http://localhost:3000
GATEWAY_URL=http://localhost:8080

# Service URLs
PRODUCT_SERVICE_URL=http://localhost:8081
PRODUCT_SERVICE_PORT=8081

CART_SERVICE_URL=http://localhost:8082
CART_SERVICE_PORT=8082

ORDER_SERVICE_URL=http://localhost:8083
ORDER_SERVICE_PORT=8083

PAYMENT_SERVICE_URL=http://localhost:8084
PAYMENT_SERVICE_PORT=8084
```

## File Structure

```
server/
├── services/
│   ├── gateway/              # API Gateway
│   │   ├── gateway.js
│   │   └── gateway-app.js
│   ├── product/              # Product Service
│   │   ├── product-service.js
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── data/
│   ├── cart/                 # Cart Service
│   │   ├── cart-service.js
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── routes/
│   ├── order/                # Order Service
│   │   ├── order-service.js
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── routes/
│   ├── payment/              # Payment Service
│   │   ├── payment-service.js
│   │   ├── services/
│   │   ├── providers/
│   │   └── routes/
│   └── shared/               # Shared utilities and middleware
│       ├── config/
│       ├── middleware/
│       └── utils/
├── package.json
├── .env
└── README.md
```

## Data Flow

1. **Client Request** → API Gateway (8080)
2. **API Gateway** → Routes to appropriate service based on path
3. **Services** communicate with each other via HTTP requests
4. **Example Order Flow**:
   - Client creates order at Gateway (`POST /api/orders`)
   - Gateway routes to Order Service
   - Order Service requests cart from Cart Service
   - Cart Service validates products with Product Service
   - Order Service processes payment via Payment Service
   - Order Service returns confirmed order to Gateway
   - Gateway returns response to Client

## Inter-Service Communication

Services communicate using the `makeServiceRequest` utility:

```javascript
const { makeServiceRequest } = require("../../shared/utils/makeServiceRequest");

// Example: Cart Service calling Product Service
const product = await makeServiceRequest(
  env.serviceUrls.products,
  "GET",
  `/api/products/${productId}`,
  null,
  customerId
);
```

## Customer Context

All services use the `x-customer-id` header to identify customers:
- Frontend sends `x-customer-id` via API client
- Gateway forwards it to services
- Services use it to scope data to customer

## Health Checks

Each service provides a health check endpoint:
```
GET /health
```

Example response:
```json
{
  "success": true,
  "service": "Product Service",
  "status": "up"
}
```

## Future Enhancements

1. **Database Integration**: Replace in-memory storage with MongoDB
2. **Message Queue**: Add RabbitMQ/Kafka for async communication
3. **Service Discovery**: Implement Consul or similar
4. **Load Balancing**: Add Nginx for load distribution
5. **Docker**: Create Dockerfile and docker-compose for containerization
6. **Real-time Events**: Add Socket.io integration for live updates
7. **API Documentation**: Add Swagger/OpenAPI documentation
8. **Logging**: Add structured logging with Winston or Bunyan
9. **Monitoring**: Add Prometheus metrics and Grafana dashboards

## Testing

Services can be tested individually:

```bash
# Test Product Service
curl http://localhost:8081/health

# Test Cart Service
curl http://localhost:8082/health

# Test Order Service
curl http://localhost:8083/health

# Test Payment Service
curl http://localhost:8084/health

# Test API Gateway
curl http://localhost:8080/health
```

## Notes

- Each service has its own repository and data storage
- Services are loosely coupled and independently deployable
- The architecture is ready for containerization
- Error handling is consistent across all services
- Customer context is propagated through the entire request lifecycle

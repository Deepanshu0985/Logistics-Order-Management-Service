# 🚚 Logistics Order Management Service

A full-stack Spring Boot + React application for managing logistics orders and delivery partners with real-time updates, inspired by Swiggy-style order management systems.

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 21
- **Security**: Spring Security + JWT
- **Database**: PostgreSQL / H2 (dev)
- **WebSocket**: STOMP over WebSocket
- **API Docs**: Swagger/OpenAPI 3.0
- **Monitoring**: Spring Actuator

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **WebSocket**: SockJS + STOMP

---

## ✨ Features

### Core Features
- ✅ Full CRUD for Orders and Delivery Partners
- ✅ Order lifecycle management (PLACED → ASSIGNED → PICKED → DELIVERED → CANCELLED)
- ✅ Automatic partner status updates
- ✅ Paginated API responses with filtering

### 🔐 Authentication & Security
- ✅ JWT-based stateless authentication
- ✅ Role-based access control (ADMIN, PARTNER, CUSTOMER)
- ✅ Secure password hashing (BCrypt)
- ✅ Protected API endpoints

### 📡 Real-Time Features
- ✅ WebSocket notifications for order updates
- ✅ Live connection status indicator
- ✅ Toast notifications for events

### 🤖 Intelligent Features
- ✅ Auto-assignment algorithm for delivery partners
- ✅ Order audit/history logs
- ✅ Order cancellation with reason tracking

### 📊 Observability
- ✅ Swagger UI for API documentation
- ✅ Spring Actuator health endpoints
- ✅ Detailed audit logging

---

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL (optional, H2 included for dev)

### Backend Setup

```bash
cd springBoot

# Run with H2 (default for development)
./gradlew bootRun

# Or with PostgreSQL
export SPRING_DATASOURCE_URL=jdbc:postgresql://host/db
export SPRING_DATASOURCE_USERNAME=user
export SPRING_DATASOURCE_PASSWORD=pass
./gradlew bootRun
```

Backend runs at: `http://localhost:8080`

### Frontend Setup

```bash
cd logistics-frontend

npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔗 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | Login & get JWT token |

### 📦 Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/orders` | Create order (with optional `autoAssign`) |
| `GET` | `/api/v1/orders` | Get orders (paginated, filterable) |
| `GET` | `/api/v1/orders/{id}` | Get order by ID |
| `GET` | `/api/v1/orders/{id}/history` | Get order audit history |
| `PUT` | `/api/v1/orders/{id}/status` | Update order status |
| `PUT` | `/api/v1/orders/{id}/assign` | Assign delivery partner |
| `PUT` | `/api/v1/orders/{id}/cancel` | Cancel order with reason |

### 🚴 Delivery Partners
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/delivery-partners` | Create partner |
| `GET` | `/api/v1/delivery-partners` | Get partners (paginated) |
| `GET` | `/api/v1/delivery-partners/available` | Get available by city |
| `PUT` | `/api/v1/delivery-partners/{id}/status` | Update status |

### 📊 Monitoring
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/actuator/health` | Health check |
| `GET` | `/swagger-ui.html` | API documentation |
| `GET` | `/ws` | WebSocket endpoint |

---

## 🔑 Authentication Flow

### Register
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "password123",
    "role": "ADMIN"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'
```

### Use Token
```bash
curl http://localhost:8080/api/v1/orders \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## 📡 WebSocket Events

Connect to `/ws` endpoint and subscribe to `/topic/orders`:

| Event Type | Description |
|------------|-------------|
| `ORDER_CREATED` | New order placed |
| `STATUS_CHANGED` | Order status updated |
| `PARTNER_ASSIGNED` | Partner assigned to order |
| `ORDER_CANCELLED` | Order cancelled |

---

## 🐳 Docker

### Build & Run

```bash
# Build image
docker build -t logistics-backend .

# Run with environment variables
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host/db \
  -e SPRING_DATASOURCE_USERNAME=user \
  -e SPRING_DATASOURCE_PASSWORD=pass \
  -e JWT_SECRET=your-secret-key \
  logistics-backend
```

### Docker Compose (Optional)

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/logistics
      - JWT_SECRET=your-secret-key
    depends_on:
      - db
  
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=logistics
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
```

---

## 📂 Project Structure

```
springBoot/
├── src/main/java/com/logistics/ordermanagement/
│   ├── config/           # Security, WebSocket, OpenAPI configs
│   ├── controller/       # REST controllers
│   ├── service/          # Business logic
│   ├── repository/       # Data access
│   ├── entity/           # JPA entities
│   ├── dto/              # Request/Response DTOs
│   ├── security/         # JWT filter & service
│   └── exception/        # Custom exceptions
│
└── logistics-frontend/
    ├── src/
    │   ├── api/          # Axios API clients
    │   ├── components/   # React components
    │   ├── context/      # Auth context
    │   ├── hooks/        # WebSocket hook
    │   └── pages/        # Page components
    └── index.html
```

---

## 🌐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | H2 in-memory | Database URL |
| `SPRING_DATASOURCE_USERNAME` | sa | DB username |
| `SPRING_DATASOURCE_PASSWORD` | (empty) | DB password |
| `JWT_SECRET` | (base64 key) | JWT signing key |
| `JWT_EXPIRATION` | 86400000 | Token expiry (ms) |
| `PORT` | 8080 | Server port |

---

## 📜 Order Lifecycle

```
┌─────────┐      ┌──────────┐      ┌────────┐      ┌───────────┐
│ PLACED  │ ───► │ ASSIGNED │ ───► │ PICKED │ ───► │ DELIVERED │
└─────────┘      └──────────┘      └────────┘      └───────────┘
     │                │                │
     │                │                └── Partner → AVAILABLE
     │                └── Partner → BUSY
     │
     └── Can be CANCELLED at any stage (except DELIVERED)
```

---

## 👤 Author

Built by [Deepanshu0985](https://github.com/Deepanshu0985)

---

## 📄 License

MIT License

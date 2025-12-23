# 🚚 Logistics Order Management Service

A Spring Boot backend service for managing logistics orders and delivery partners, inspired by Swiggy-style order management systems.

## Tech Stack

- **Framework**: Spring Boot 3.2.1
- **Language**: Java 21
- **Build Tool**: Gradle
- **Database**: PostgreSQL (Neon Cloud)
- **ORM**: Spring Data JPA / Hibernate

---

## Features

- ✅ Full CRUD for Orders and Delivery Partners
- ✅ Order lifecycle management (PLACED → ASSIGNED → PICKED → DELIVERED)
- ✅ Automatic partner status updates
- ✅ Paginated API responses
- ✅ City and status-based filtering with database indexes
- ✅ Global exception handling
- ✅ Request validation with detailed error messages

---

## API Endpoints

### 📦 Orders API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/orders` | Create a new order |
| `GET` | `/api/v1/orders` | Get all orders (paginated) |
| `GET` | `/api/v1/orders/{id}` | Get order by ID |
| `GET` | `/api/v1/orders/number/{orderNumber}` | Get order by order number |
| `PUT` | `/api/v1/orders/{id}/status` | Update order status |
| `PUT` | `/api/v1/orders/{id}/assign` | Assign delivery partner to order |

#### Query Parameters for GET `/api/v1/orders`

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | int | Page number (default: 0) |
| `size` | int | Page size (default: 10) |
| `city` | string | Filter by city |
| `status` | string | Filter by status (PLACED, ASSIGNED, PICKED, DELIVERED) |

---

### 🚴 Delivery Partners API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/delivery-partners` | Create a new delivery partner |
| `GET` | `/api/v1/delivery-partners` | Get all partners (paginated) |
| `GET` | `/api/v1/delivery-partners/{id}` | Get partner by ID |
| `GET` | `/api/v1/delivery-partners/available` | Get available partners by city |
| `PUT` | `/api/v1/delivery-partners/{id}/status` | Update partner status |

---

## Request/Response Examples

### Create Order

**Request:**
```bash
POST /api/v1/orders
Content-Type: application/json

{
  "customerName": "Jane Doe",
  "customerPhone": "9876543210",
  "pickupAddress": "123 Main Street, Near Metro Station, Mumbai",
  "deliveryAddress": "456 Oak Avenue, Apartment 7B, Andheri",
  "city": "Mumbai"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "orderNumber": "ORD-A1B2C3D4",
    "customerName": "Jane Doe",
    "customerPhone": "9876543210",
    "pickupAddress": "123 Main Street, Near Metro Station, Mumbai",
    "deliveryAddress": "456 Oak Avenue, Apartment 7B, Andheri",
    "city": "MUMBAI",
    "status": "PLACED",
    "deliveryPartner": null,
    "createdAt": "2025-12-23T22:30:00",
    "updatedAt": "2025-12-23T22:30:00"
  },
  "timestamp": "2025-12-23T22:30:00"
}
```

---

### Create Delivery Partner

**Request:**
```bash
POST /api/v1/delivery-partners
Content-Type: application/json

{
  "name": "Rahul Kumar",
  "phone": "9876543210",
  "email": "rahul@example.com",
  "city": "Mumbai",
  "vehicleType": "bike"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Delivery partner created successfully",
  "data": {
    "id": 1,
    "name": "Rahul Kumar",
    "phone": "9876543210",
    "email": "rahul@example.com",
    "city": "MUMBAI",
    "status": "AVAILABLE",
    "vehicleType": "bike",
    "createdAt": "2025-12-23T22:30:00"
  },
  "timestamp": "2025-12-23T22:30:00"
}
```

---

### Assign Delivery Partner

**Request:**
```bash
PUT /api/v1/orders/1/assign
Content-Type: application/json

{
  "deliveryPartnerId": 1
}
```

**Response:**
- Order status changes to `ASSIGNED`
- Partner status changes to `BUSY`

---

### Update Order Status

**Request:**
```bash
PUT /api/v1/orders/1/status
Content-Type: application/json

{
  "status": "PICKED"
}
```

**Valid Status Transitions:**
```
PLACED → ASSIGNED (via partner assignment)
ASSIGNED → PICKED
PICKED → DELIVERED (partner becomes AVAILABLE again)
```

---

### Get Orders with Filters

**Request:**
```bash
GET /api/v1/orders?city=Mumbai&status=PLACED&page=0&size=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": [...],
    "page": 0,
    "size": 10,
    "totalElements": 25,
    "totalPages": 3,
    "last": false
  },
  "timestamp": "2025-12-23T22:30:00"
}
```

---

## Error Responses

### Validation Error
```json
{
  "success": false,
  "error": "Validation Failed",
  "message": "One or more fields have validation errors",
  "path": "/api/v1/orders",
  "timestamp": "2025-12-23T22:30:00",
  "fieldErrors": {
    "customerPhone": "Phone number must be 10 digits",
    "city": "City is required"
  }
}
```

### Resource Not Found
```json
{
  "success": false,
  "error": "Resource Not Found",
  "message": "Order not found with id: '999'",
  "path": "/api/v1/orders/999",
  "timestamp": "2025-12-23T22:30:00"
}
```

### Invalid Status Transition
```json
{
  "success": false,
  "error": "Invalid Status Transition",
  "message": "Invalid status transition from DELIVERED to PLACED",
  "path": "/api/v1/orders/1/status",
  "timestamp": "2025-12-23T22:30:00"
}
```

---

## Order Lifecycle

```
┌─────────┐      ┌──────────┐      ┌────────┐      ┌───────────┐
│ PLACED  │ ───► │ ASSIGNED │ ───► │ PICKED │ ───► │ DELIVERED │
└─────────┘      └──────────┘      └────────┘      └───────────┘
     │                │
     │                └── Partner status: BUSY
     └── Partner status: AVAILABLE
                                         │
                                         └── Partner status: AVAILABLE (auto-released)
```

---

## Database Schema

### Orders Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT | Primary key |
| `order_number` | VARCHAR(50) | Unique order identifier |
| `customer_name` | VARCHAR(100) | Customer name |
| `customer_phone` | VARCHAR(15) | Customer phone |
| `pickup_address` | TEXT | Pickup address |
| `delivery_address` | TEXT | Delivery address |
| `city` | VARCHAR(50) | City (indexed) |
| `status` | VARCHAR(20) | Order status (indexed) |
| `delivery_partner_id` | BIGINT | FK to delivery_partners |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### Delivery Partners Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT | Primary key |
| `name` | VARCHAR(100) | Partner name |
| `phone` | VARCHAR(15) | Unique phone number |
| `email` | VARCHAR(100) | Email (optional) |
| `city` | VARCHAR(50) | City (indexed) |
| `status` | VARCHAR(20) | Partner status (indexed) |
| `vehicle_type` | VARCHAR(20) | Vehicle type |
| `created_at` | TIMESTAMP | Creation timestamp |

---

## Getting Started

### Prerequisites
- Java 21+
- Gradle 8.5+
- PostgreSQL (or use Neon Cloud)

### Run Locally

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd springBoot
   ```

2. Configure database in `src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://your-host/your-db
       username: your-username
       password: your-password
   ```

3. Build and run:
   ```bash
   ./gradlew bootRun
   ```

4. Access the API at `http://localhost:8080/api/v1/`

---

## Project Structure

```
src/main/java/com/logistics/ordermanagement/
├── OrderManagementApplication.java    # Main entry point
├── config/
│   └── CorsConfig.java               # CORS configuration
├── controller/
│   ├── OrderController.java          # Order REST endpoints
│   └── DeliveryPartnerController.java # Partner REST endpoints
├── service/
│   ├── OrderService.java             # Order service interface
│   ├── DeliveryPartnerService.java   # Partner service interface
│   └── impl/                         # Service implementations
├── repository/
│   ├── OrderRepository.java          # Order data access
│   └── DeliveryPartnerRepository.java # Partner data access
├── entity/
│   ├── Order.java                    # Order entity
│   └── DeliveryPartner.java          # Partner entity
├── enums/
│   ├── OrderStatus.java              # PLACED, ASSIGNED, PICKED, DELIVERED
│   └── PartnerStatus.java            # AVAILABLE, BUSY, OFFLINE
├── dto/
│   ├── request/                      # Request DTOs
│   └── response/                     # Response DTOs
└── exception/
    ├── GlobalExceptionHandler.java   # Centralized error handling
    ├── ResourceNotFoundException.java
    ├── BadRequestException.java
    └── InvalidStatusTransitionException.java
```

---

## Author

Built as a demonstration of Spring Boot backend engineering best practices.

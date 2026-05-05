# API Reference

Complete documentation for the Inventory Management System API.

## Base URL

```
http://localhost:3001/api
```

In production, replace with your deployed backend URL.

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer your-jwt-token-here
```

## Response Format

All responses are JSON formatted:

### Success Response
```json
{
  "data": { /* endpoint-specific data */ },
  "message": "Success message"
}
```

### Error Response
```json
{
  "error": "Error message",
  "timestamp": "2026-05-04T10:30:00.000Z"
}
```

## Authentication Endpoints

### Register User

**Endpoint:** `POST /auth/register`

**Public:** Yes

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response:** (201 Created)
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user"
  },
  "token": "jwt-token-here"
}
```

**Errors:**
- `400`: Email and password required
- `400`: Email already exists
- `500`: Server error

---

### Login User

**Endpoint:** `POST /auth/login`

**Public:** Yes

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** (200 OK)
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user"
  },
  "token": "jwt-token-here"
}
```

**Errors:**
- `400`: Email and password required
- `401`: Invalid email or password
- `500`: Server error

---

### Get Current User Profile

**Endpoint:** `GET /auth/me`

**Protected:** Yes

**Authorization:** Bearer token required

**Response:** (200 OK)
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "created_at": "2026-05-04T10:30:00Z",
    "updated_at": "2026-05-04T10:30:00Z"
  }
}
```

**Errors:**
- `401`: Access token required
- `403`: Invalid or expired token
- `404`: User not found

---

### Change Password

**Endpoint:** `POST /auth/change-password`

**Protected:** Yes

**Authorization:** Bearer token required

**Request Body:**
```json
{
  "oldPassword": "currentpassword123",
  "newPassword": "newpassword456"
}
```

**Response:** (200 OK)
```json
{
  "message": "Password changed successfully"
}
```

**Errors:**
- `400`: Both passwords required
- `401`: Current password is incorrect
- `401`: Not authenticated
- `403`: Insufficient permissions

---

## Product Endpoints

### List Products

**Endpoint:** `GET /products`

**Public:** Yes

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `search` (optional): Search by name or SKU

**Response:** (200 OK)
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Product description",
      "sku": "SKU123",
      "quantity": 50,
      "price": 29.99,
      "category": "Electronics",
      "image_url": "https://...",
      "created_by": "uuid",
      "created_at": "2026-05-04T10:30:00Z",
      "updated_at": "2026-05-04T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

**Examples:**
```bash
# Get first 10 products
GET /products

# Get page 2 with 20 items
GET /products?page=2&limit=20

# Search for products
GET /products?search=laptop

# Filter by category
GET /products?category=Electronics

# Combined search and filter
GET /products?search=laptop&category=Electronics&page=1&limit=10
```

---

### Get Product by ID

**Endpoint:** `GET /products/:id`

**Public:** Yes

**Parameters:**
- `id` (required): Product UUID

**Response:** (200 OK)
```json
{
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "description": "Product description",
    "sku": "SKU123",
    "quantity": 50,
    "price": 29.99,
    "category": "Electronics",
    "image_url": "https://...",
    "created_by": "uuid",
    "created_at": "2026-05-04T10:30:00Z",
    "updated_at": "2026-05-04T10:30:00Z"
  }
}
```

**Errors:**
- `404`: Product not found

---

### Create Product

**Endpoint:** `POST /products`

**Protected:** Yes

**Authorization:** Admin or Manager role required

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "sku": "SKU123",
  "quantity": 50,
  "price": 29.99,
  "category": "Electronics",
  "image_url": "https://example.com/image.jpg"
}
```

**Required Fields:**
- `name`: Product name
- `sku`: Stock Keeping Unit (must be unique)
- `quantity`: Initial quantity
- `price`: Product price

**Optional Fields:**
- `description`: Product description
- `category`: Product category
- `image_url`: URL to product image

**Response:** (201 Created)
```json
{
  "message": "Product created successfully",
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "description": "Product description",
    "sku": "SKU123",
    "quantity": 50,
    "price": 29.99,
    "category": "Electronics",
    "image_url": "https://example.com/image.jpg",
    "created_by": "uuid",
    "created_at": "2026-05-04T10:30:00Z",
    "updated_at": "2026-05-04T10:30:00Z"
  }
}
```

**Errors:**
- `400`: Missing required fields
- `400`: SKU already exists
- `401`: Not authenticated
- `403`: Insufficient permissions

---

### Update Product

**Endpoint:** `PUT /products/:id`

**Protected:** Yes

**Authorization:** Admin or Manager role required

**Parameters:**
- `id` (required): Product UUID

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "description": "Updated description",
  "sku": "SKU456",
  "quantity": 75,
  "price": 39.99,
  "category": "Computers",
  "image_url": "https://example.com/updated-image.jpg"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Response:** (200 OK)
```json
{
  "message": "Product updated successfully",
  "data": {
    "id": "uuid",
    "name": "Updated Product Name",
    "description": "Updated description",
    "sku": "SKU456",
    "quantity": 75,
    "price": 39.99,
    "category": "Computers",
    "image_url": "https://example.com/updated-image.jpg",
    "created_by": "uuid",
    "created_at": "2026-05-04T10:30:00Z",
    "updated_at": "2026-05-04T10:31:00Z"
  }
}
```

**Errors:**
- `400`: Product not found
- `401`: Not authenticated
- `403`: Insufficient permissions

---

### Delete Product

**Endpoint:** `DELETE /products/:id`

**Protected:** Yes

**Authorization:** Admin role required

**Parameters:**
- `id` (required): Product UUID

**Response:** (200 OK)
```json
{
  "message": "Product deleted successfully"
}
```

**Errors:**
- `400`: Product not found
- `401`: Not authenticated
- `403`: Insufficient permissions (Admin only)

---

### Update Product Quantity

**Endpoint:** `PATCH /products/:id/update-quantity`

**Protected:** Yes

**Authorization:** Admin or Manager role required

**Parameters:**
- `id` (required): Product UUID

**Request Body:**
```json
{
  "quantity": 100
}
```

**Response:** (200 OK)
```json
{
  "message": "Quantity updated successfully",
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "description": "Product description",
    "sku": "SKU123",
    "quantity": 100,
    "price": 29.99,
    "category": "Electronics",
    "image_url": "https://...",
    "created_by": "uuid",
    "created_at": "2026-05-04T10:30:00Z",
    "updated_at": "2026-05-04T10:32:00Z"
  }
}
```

**Errors:**
- `400`: Quantity is required
- `400`: Product not found
- `401`: Not authenticated
- `403`: Insufficient permissions

---

### Upload Product Image

**Endpoint:** `POST /products/upload`

**Protected:** Yes

**Authorization:** Admin or Manager role required

**Request Body:**
```
Content-Type: multipart/form-data

image: [binary file]
```

**Supported Formats:**
- JPEG, JPG, PNG, GIF, WEBP
- Maximum file size: 5MB

**Response:** (200 OK)
```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "http://localhost:3001/uploads/product-1234567890-123456789.jpg",
  "filename": "product-1234567890-123456789.jpg"
}
```

**Errors:**
- `400`: No file uploaded
- `400`: Only image files are allowed
- `400`: File size exceeds 5MB
- `401`: Not authenticated
- `403`: Insufficient permissions

**Usage:**
After uploading, use the returned `imageUrl` when creating or updating a product.

**Example with cURL:**
```bash
curl -X POST http://localhost:3001/api/products/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

---

## Health Check

### Server Health

**Endpoint:** `GET /health`

**Public:** Yes

**Response:** (200 OK)
```json
{
  "status": "ok",
  "timestamp": "2026-05-04T10:30:00.000Z"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Authentication required or failed |
| 403 | Forbidden - Authenticated but insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Authentication Token

Once logged in, you receive a JWT token:

```
Header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
Payload: eyJpZCI6InV1aWQiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciJ9
Signature: signature
```

**Token Expiration:** 7 days (configurable)

### Using the Token

Include in request header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Rate Limiting

Currently not implemented. Add the `express-rate-limit` package for production use.

---

## CORS

The API supports CORS for cross-origin requests from:
- `http://localhost:4200` (development)
- Your production frontend URL (configured in `.env`)

---

## Error Handling

All error responses include:
- `error`: Error message
- `timestamp`: When the error occurred

Example:
```json
{
  "error": "Product not found",
  "timestamp": "2026-05-04T10:30:00.000Z"
}
```

---

## Testing the API

### With cURL

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Get products
curl http://localhost:3001/api/products

# Create product (with token)
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Product","sku":"SKU123","quantity":10,"price":29.99}'
```

### With Postman

1. Import the base URL: `http://localhost:3001/api`
2. Create login request to get token
3. Set token in Authorization tab for protected endpoints
4. Test all endpoints

### With Swagger

Visit `http://localhost:3001/api/docs` for interactive API testing.

---

## Webhook Ready

The API is structured to support webhooks. Add webhook listeners in the routes for:
- Product created/updated/deleted
- Inventory low stock alerts
- User activity logging

---

For more information, visit the [README.md](README.md) or [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md).

# Inventory Management System

A full-stack web application for managing product inventory with user authentication, role-based access control, and comprehensive product management features.

## Live Links

> **Note**: Add your deployment URLs here after deploying

- **Frontend URL**: `https://your-frontend-url.vercel.app` (to be deployed)
- **Backend API URL**: `https://your-backend-url.onrender.com` (to be deployed)
- **API Documentation**: `https://your-backend-url.onrender.com/api/docs` (to be deployed)

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## Tech Stack

### Frontend
- **Framework**: Angular 17
- **Styling**: Tailwind CSS
- **HTTP Client**: Angular HttpClient
- **State Management**: Angular Signals

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI

## Features

### Core Features
- User authentication (Register/Login)
- Role-based access control (Admin, Manager, User)
- Product CRUD operations
- Product search and filtering
- Pagination support
- Inventory quantity tracking
- Category management
- **File upload for product images** (up to 5MB)
- Product image support (upload or URL)
- Change password functionality

### User Roles
- **Admin**: Full access - create, edit, delete products, upload images
- **Manager**: Can create, edit products, and upload images
- **User**: View-only access to products

## Project Structure

```
inventory-management-system/
├── client/                          # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── navbar/         # Navigation component
│   │   │   ├── pages/
│   │   │   │   ├── login/          # Login page
│   │   │   │   ├── register/       # Registration page
│   │   │   │   ├── dashboard/      # Main dashboard
│   │   │   │   ├── products/       # Products listing
│   │   │   │   ├── product-form/   # Add/Edit product
│   │   │   │   └── profile/        # User profile
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts    # Authentication
│   │   │   │   └── products.service.ts # Products API
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts   # Route protection
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts   # JWT token injection
│   │   │   │   └── error.interceptor.ts  # Error handling
│   │   │   ├── app.routes.ts       # Routing configuration
│   │   │   └── app.component.ts    # Root component
│   │   ├── main.ts                 # Application entry point
│   │   ├── styles.scss             # Global styles
│   │   └── index.html              # HTML template
│   ├── package.json
│   ├── tsconfig.json
│   ├── angular.json
│   └── tailwind.config.js
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts             # Auth endpoints
│   │   │   └── products.ts         # Product endpoints
│   │   ├── middleware/
│   │   │   ├── auth.ts             # JWT verification & role checking
│   │   │   └── upload.ts           # Multer file upload configuration
│   │   ├── lib/
│   │   │   └── supabase.ts         # Supabase configuration
│   │   └── index.ts                # Server entry point
│   ├── uploads/                    # Uploaded product images
│   ├── .env.example                # Environment template
│   ├── package.json
│   └── tsconfig.json
│
├── screenshots/                     # UI and API testing screenshots
│   └── README.md                   # Screenshot guidelines
│
└── README.md

```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or pnpm
- Supabase account (free tier available at supabase.com)

### 1. Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project and choose your region
3. Once created, go to the SQL Editor and run the following SQL:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100) UNIQUE NOT NULL,
  quantity INTEGER DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(255) DEFAULT 'Uncategorized',
  image_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_created_by ON products(created_by);
```

4. Get your Supabase credentials:
   - Go to Settings > API
   - Copy your `Project URL` (SUPABASE_URL)
   - Copy your `anon public` key (SUPABASE_KEY)
   - Copy your `service_role` key (SUPABASE_SERVICE_ROLE_KEY)

### 2. Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Create a `.env` file with your Supabase credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:4200
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The server will be available at `http://localhost:3001`
API documentation available at `http://localhost:3001/api/docs`

### 3. Frontend Setup

1. Navigate to the client directory (in a new terminal):
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:4200`

### 4. Run Both Concurrently (Optional)

From the root directory:
```bash
npm run dev
```

This will start both the server and client in development mode.

## Default Test Accounts

After setting up the database, you can create test accounts by registering through the app, or directly insert into the database:

```sql
-- Insert test admin user (password: admin123)
INSERT INTO users (email, password_hash, name, role) 
VALUES (
  'admin@example.com',
  '$2a$10$...',  -- bcrypt hash of 'admin123'
  'Admin User',
  'admin'
);

-- Insert test manager user (password: manager123)
INSERT INTO users (email, password_hash, name, role) 
VALUES (
  'manager@example.com',
  '$2a$10$...',  -- bcrypt hash of 'manager123'
  'Manager User',
  'manager'
);
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (requires auth)
- `POST /api/auth/change-password` - Change password (requires auth)

### Products
- `GET /api/products` - List products (with pagination, search, filter)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin/manager only)
- `PUT /api/products/:id` - Update product (admin/manager only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `PATCH /api/products/:id/update-quantity` - Update quantity (admin/manager only)
- `POST /api/products/upload` - Upload product image (admin/manager only)

### Health Check
- `GET /api/health` - Server health status

### Static Files
- `GET /uploads/:filename` - Access uploaded product images

## Deployment

### Backend Deployment (Render/Railway/Vercel)

1. Push your code to GitHub
2. Connect your GitHub repository to Render/Railway
3. Set environment variables in your hosting platform
4. Deploy the server folder
5. **Important**: Ensure the uploads directory is writable or configure cloud storage (AWS S3, Cloudinary) for production

### Frontend Deployment (Vercel/Netlify)

1. Build the Angular app:
```bash
cd client
npm run build
```

2. Deploy the `dist/inventory-frontend` folder to Vercel or Netlify

3. Update the API URL in `src/app/services/auth.service.ts` and `src/app/services/products.service.ts` to your deployed backend URL

### Production Considerations for File Upload

For production deployment, consider using cloud storage services:
- **AWS S3**: For scalable file storage
- **Cloudinary**: For image optimization and CDN
- **Google Cloud Storage**: Alternative cloud storage

Update the upload middleware to use cloud storage instead of local filesystem for production environments.

## Security Notes

1. **JWT Secret**: Always use a strong, random JWT secret in production
2. **CORS**: Configure CORS properly for your production domain
3. **HTTPS**: Always use HTTPS in production
4. **Environment Variables**: Never commit `.env` files to version control
5. **Password Requirements**: Implement stronger password validation in production
6. **Rate Limiting**: Consider adding rate limiting for authentication endpoints
7. **Input Validation**: Add comprehensive input validation on both frontend and backend

## Development Tips

### Adding a New Page

1. Create a new component in `client/src/app/pages/your-page/`
2. Add the route in `client/src/app/app.routes.ts`
3. Import components as needed in your new page

### Adding a New API Endpoint

1. Create a new route file in `server/src/routes/` if needed
2. Add endpoint logic with proper authentication and authorization
3. Document the endpoint with Swagger/JSDoc comments
4. Register the route in `server/src/index.ts`

### Styling

All styling uses Tailwind CSS. Customize in `client/tailwind.config.js`

## Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGIN` in server `.env` matches your frontend URL

### Authentication Issues
- Check JWT_SECRET is set correctly
- Verify token is stored in localStorage
- Check browser console for error details

### Database Connection Issues
- Verify Supabase credentials are correct
- Check network connectivity
- Ensure database tables exist

## Support

For issues or questions, please check:
1. Console logs in browser DevTools
2. Server logs in terminal
3. Supabase dashboard for database issues
4. Check `screenshots/` folder for UI and API testing examples

## Screenshots

All UI screenshots and API testing documentation can be found in the `screenshots/` folder. See `screenshots/README.md` for guidelines on capturing and organizing screenshots.

## License

MIT License - feel free to use this project as a template for your own applications.

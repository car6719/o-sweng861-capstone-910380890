# Campus Pay - A Smart Wallet for Student Payments

**GitHub Repository:** [https://github.com/car6719/o-sweng861-capstone-910380890](https://github.com/car6719/o-sweng861-capstone-910380890)

## Project Overview

Campus Pay is a full-stack web application that provides a unified, secure, and intuitive digital wallet for managing student payments at universities. The platform streamlines payment processing by consolidating tuition, dining dollars, lab fees, and other charges into a single interface, eliminating the confusion and inefficiencies caused by disconnected systems.

**Live Demo:** Run locally following instructions below

### Key Features

#### Must-Have Features (Implemented)
- **User Authentication & Role-Based Access** - Secure JWT authentication with student and admin roles
- **Charge Management** - Admins can create, view, and delete charges; students can view their balances
- **Stripe Payment Integration** - Secure payment processing with support for multiple charge selection
- **Account Ledger & Hold Management** - Automatic balance updates and hold removal after payment
- **Payment History Dashboard** - Detailed transaction tracking with status indicators

#### Nice-to-Have Features (Implemented)
- **Email Notification Infrastructure** - Ready to send payment reminders and confirmations
- **Multi-Charge Payment** - Pay multiple charges in a single transaction
- **Real-time Balance Updates** - Instant reflection of payments

### Problem Statement

Many universities rely on multiple, disconnected systems to manage student payments. This fragmentation results in:
- Confusion about outstanding balances
- Missed payments and late fees
- Administrative delays (academic holds)
- No centralized view of financial obligations
- Manual tracking across multiple platforms by bursar staff

### Solution

Campus Pay addresses these challenges by offering:
- Single dashboard for all student charges
- Real-time balance overview
- Secure, integrated payment processing
- Automated hold management
- Role-based access for students and administrators

## Tech Stack

- **Frontend**: React 18 with TypeScript, Vite
- **Backend**: Node.js with Express and TypeScript
- **Database**: In-memory (development), PostgreSQL-ready (production)
- **Payment Processing**: Stripe API
- **Authentication**: JWT with bcrypt hashing
- **Styling**: Custom CSS with CSS variables

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **Stripe Account** (free test account) - [Sign up here](https://stripe.com)

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/car6719/o-sweng861-capstone-910380890.git
cd "Campus Project Portfolio"
```

Or download and extract the ZIP file from GitHub.

#### 2. Install Dependencies

Install all dependencies for root, server, and client:

```bash
npm run install-all
```

This will automatically:
- Install root dependencies
- Install server dependencies
- Install client dependencies

#### 3. Configure Environment Variables

**Server Configuration:**

Create `server/.env` file:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your configuration:

```env
PORT=5001
JWT_SECRET=your_secure_random_string_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NODE_ENV=development

# Optional: Email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=Campus Pay <noreply@campuspay.edu>
```

**Client Configuration:**

Create `client/.env` file:

```bash
cp client/.env.example client/.env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

#### 4. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Create a free account
3. Navigate to **Developers → API keys**
4. Copy your **test mode** keys (starting with `sk_test_` and `pk_test_`)
5. Add them to both `server/.env` and `client/.env`

#### 5. Run the Application

**Development Mode (recommended):**

```bash
npm run dev
```

This starts both servers concurrently:
- 🎨 Frontend: http://localhost:5173 (or 5174 if 5173 is in use)
- ⚡ Backend: http://localhost:5001

**Or run servers separately:**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

#### 6. Access the Application

Open your browser and navigate to:

**Application URL:** http://localhost:5173 (or check terminal output for actual port)

**API Health Check:** http://localhost:5001/health

## Sample Credentials

The application comes with pre-configured demo accounts:

### Student Account
- **Email:** `student@campus.edu`
- **Password:** `student123`
- **Student ID:** STU001

### Bursar Admin Account
- **Email:** `admin@campus.edu`
- **Password:** `admin123`

### Test Payment Card (Stripe Test Mode)

- **Card Number:** `4242 4242 4242 4242`
- **Expiry Date:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP Code:** Any 5 digits (e.g., `12345`)

For more test cards, see [Stripe Test Cards](https://stripe.com/docs/testing#cards)

## Running Tests

### Current Status
The project currently uses manual testing. Automated test suites are planned for future releases.

### Manual Testing Workflow

#### 1. Test Student Features

1. Login as student (`student@campus.edu` / `student123`)
2. Verify dashboard displays:
   - Current balance
   - List of charges (paid and unpaid)
   - Payment history
3. Select one or more unpaid charges
4. Click "Pay Now" and complete Stripe payment
5. Verify:
   - Payment appears in history
   - Charges marked as paid
   - Balance updated

#### 2. Test Admin Features

1. Login as admin (`admin@campus.edu` / `admin123`)
2. Navigate to "Manage Charges"
3. Create a new charge for a student
4. Verify charge appears in list
5. Navigate to "Manage Users"
6. Toggle account hold for a student
7. Test deleting unpaid charges

#### 3. Test Authentication

1. Test registration with new account
2. Test login with invalid credentials
3. Test protected routes redirect when not authenticated
4. Test role-based access (student cannot access admin routes)

### Future Testing Plans

- [ ] Unit tests with Jest
- [ ] Integration tests for API endpoints
- [ ] E2E tests with Playwright or Cypress
- [ ] Stripe webhook testing

## Docker Deployment (Optional)

### Dockerfile for Server

Create `server/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5001
CMD ["npm", "start"]
```

### Dockerfile for Client

Create `client/Dockerfile`:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml` in root:

```yaml
version: '3.8'
services:
  server:
    build: ./server
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - PORT=5001
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
    
  client:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - server
```

Run with:
```bash
docker-compose up
```

## Cloud Deployment

### Backend Deployment Options

#### Heroku
```bash
heroku create campus-pay-api
git subtree push --prefix server heroku main
```

#### Railway / Render
1. Connect your GitHub repository
2. Select `server` as root directory
3. Set environment variables in dashboard
4. Deploy

### Frontend Deployment Options

#### Vercel
```bash
cd client
vercel
```

#### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Base directory: `client`

### Environment Variables for Production

**Server:**
- Set `NODE_ENV=production`
- Use strong random `JWT_SECRET`
- Use production Stripe keys (starting with `sk_live_`)
- Configure production database (PostgreSQL recommended)

**Client:**
- Update `VITE_API_URL` to your production API URL
- Use production Stripe publishable key

## Project Structure

```
Campus Project Portfolio/
├── client/                     # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── Navbar.tsx      # Navigation bar
│   │   │   ├── PaymentForm.tsx # Stripe payment form
│   │   │   └── ProtectedRoute.tsx # Route protection HOC
│   │   ├── contexts/           # React Context providers
│   │   │   └── AuthContext.tsx # Authentication context
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx        # Landing page
│   │   │   ├── Login.tsx       # Login page
│   │   │   ├── Register.tsx    # Registration page
│   │   │   ├── Dashboard.tsx   # Student dashboard
│   │   │   ├── ManageCharges.tsx # Admin charge management
│   │   │   └── ManageUsers.tsx # Admin user management
│   │   ├── services/           # API service layer
│   │   │   ├── api.ts          # Axios configuration
│   │   │   └── index.ts        # API service functions
│   │   ├── types/              # TypeScript type definitions
│   │   │   └── index.ts        # Shared types
│   │   ├── App.tsx             # Main application component
│   │   ├── main.tsx            # Application entry point
│   │   └── index.css           # Global styles
│   ├── index.html              # HTML template
│   ├── vite.config.ts          # Vite configuration
│   └── package.json            # Client dependencies
│
├── server/                     # Express backend API
│   ├── src/
│   │   ├── database/           # Database configuration
│   │   │   └── db.ts           # In-memory database implementation
│   │   ├── middleware/         # Express middleware
│   │   │   └── auth.ts         # JWT authentication middleware
│   │   ├── models/             # Data models
│   │   │   └── index.ts        # User, Charge, Payment models
│   │   ├── routes/             # API route handlers
│   │   │   ├── auth.ts         # Authentication routes
│   │   │   ├── charges.ts      # Charge management routes
│   │   │   ├── payments.ts     # Payment processing routes
│   │   │   └── users.ts        # User management routes
│   │   ├── types/              # TypeScript type definitions
│   │   │   └── index.ts        # Backend types
│   │   ├── utils/              # Utility functions
│   │   │   └── email.ts        # Email notification utilities
│   │   └── index.ts            # Server entry point
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json            # Server dependencies
│
├── .gitignore                  # Git ignore rules
├── package.json                # Root package.json
├── README.md                   # This file
└── SETUP.md                    # Detailed setup instructions
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Charges
- `GET /api/charges` - Get all charges (student: own charges, admin: all)
- `GET /api/charges/balance` - Get current user balance
- `POST /api/charges` - Create new charge (admin only)
- `DELETE /api/charges/:id` - Delete charge (admin only)

### Payments
- `GET /api/payments` - Get payment history
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users` - Get all students (admin only)
- `PUT /api/users/holds/:userId` - Manage account holds (admin only)

## Configuration Files

### Server Configuration (`server/.env`)
```env
PORT=5001                                    # Server port
JWT_SECRET=your_jwt_secret                   # Secret for JWT signing
STRIPE_SECRET_KEY=sk_test_xxx                # Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_xxx           # Stripe public key
NODE_ENV=development                          # Environment
```

### Client Configuration (`client/.env`)
```env
VITE_API_URL=http://localhost:5001/api      # Backend API URL
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx     # Stripe public key
```

## Security Notes

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- Passwords are hashed using bcrypt with 10 salt rounds
- All API routes except auth are protected with JWT middleware
- Role-based access control implemented for admin routes
- Input validation using express-validator
- CORS enabled (configure for production domains)

**Production Security Checklist:**
- [ ] Use strong, random JWT_SECRET (32+ characters)
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS for specific domains
- [ ] Implement rate limiting
- [ ] Add request size limits
- [ ] Use environment-specific Stripe keys
- [ ] Implement CSRF protection
- [ ] Add security headers (helmet.js)
- [ ] Enable database encryption
- [ ] Implement audit logging

## Troubleshooting

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use`

**Solution:**
```bash
# macOS/Linux
lsof -ti:5001 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Or change ports in .env files
```

### Dependencies Installation Issues

**Problem:** Native module compilation errors

**Solution:** This project uses pure JavaScript dependencies to avoid compilation issues. If you encounter any problems:
```bash
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json
rm -rf client/node_modules client/package-lock.json
npm run install-all
```

### Stripe Test Mode Issues

**Problem:** Payments failing or not processing

**Solution:**
- Verify you're using test mode keys (starting with `sk_test_` and `pk_test_`)
- Check browser console for errors
- Ensure both server and client `.env` files have matching Stripe keys
- Use official Stripe test cards: https://stripe.com/docs/testing

### Database Reset

**Problem:** Need to clear all data and start fresh

**Solution:** The in-memory database resets automatically when you restart the server:
```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

## License

This project is licensed under the ISC License.

## hris Randolph**
- GitHub: [@car6719](https://github.com/car6719)
- Repository: [o-sweng861-capstone-910380890](https://github.com/car6719/o-sweng861-capstone-910380890)

**Campus Pay Team**

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support
[GitHub repository](https://github.com/car6719/o-sweng861-capstone-910380890/issues)
For support and questions:
- Open an issue in the GitHub repository
- Check [SETUP.md](SETUP.md) for detailed setup instructions

## Roadmap

- [ ] PostgreSQL database integration
- [ ] Unit and integration tests (Jest, Supertest)
- [ ] E2E tests (Playwright)
- [ ] Email notification implementation
- [ ] Payment reminders scheduler
- [ ] Mobile responsive improvements
- [ ] Dark mode support
- [ ] Multi-semester support
- [ ] Export transactions to PDF/CSV
- [ ] Payment plans and installments
- [ ] Refund processing
- [ ] Analytics dashboard for admins

## Additional Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

---

If you find this project useful, please consider giving it a star on GitHub!

# Campus Pay - Setup Guide

## Quick Start

### 1. Install Dependencies

First, install all dependencies for both server and client:

```bash
cd "Campus Project Portfolio"
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Configure Environment Variables

#### Server Configuration

Copy the example environment file:
```bash
cp server/.env.example server/.env
```

Edit `server/.env` and add your configuration:
```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NODE_ENV=development
```

**Important:** You need to get Stripe API keys:
1. Go to https://stripe.com and create a free account
2. Navigate to Developers > API keys
3. Copy your test mode keys (they start with `sk_test_` and `pk_test_`)
4. Add them to your `.env` file

#### Client Configuration

Copy the example environment file:
```bash
cp client/.env.example client/.env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

Use the same Stripe publishable key from the server configuration.

### 3. Run the Application

From the root directory, run:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend client on http://localhost:5173

### 4. Test the Application

Open your browser and navigate to http://localhost:5173

Use these demo accounts:
- **Student**: student@campus.edu / student123
- **Admin**: admin@campus.edu / admin123

## Testing Stripe Payments

Use these test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- Use any future expiration date (e.g., 12/34)
- Use any 3-digit CVC (e.g., 123)
- Use any ZIP code (e.g., 12345)

## Project Structure

```
Campus Project Portfolio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── database/       # Database setup
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Server entry point
│   └── package.json
└── package.json            # Root package.json

```

## Features

### Student Features
- ✅ View account balance
- ✅ View all charges (paid and unpaid)
- ✅ Select and pay multiple charges
- ✅ Secure payment with Stripe
- ✅ View payment history
- ✅ Account hold notifications

### Admin Features
- ✅ Create new charges for students
- ✅ View all charges across all students
- ✅ Delete unpaid charges
- ✅ Manage student accounts
- ✅ Add/remove account holds
- ✅ View student balances

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Charges
- `GET /api/charges` - Get charges (filtered by role)
- `GET /api/charges/balance` - Get current user balance
- `POST /api/charges` - Create charge (admin only)
- `DELETE /api/charges/:id` - Delete charge (admin only)

### Payments
- `GET /api/payments` - Get payment history
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment

### Users
- `GET /api/users/profile` - Get current user profile
- `GET /api/users` - Get all students (admin only)
- `PUT /api/users/holds/:userId` - Update hold status (admin only)

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use, you can change them:
- Server: Edit `PORT` in `server/.env`
- Client: Edit `server.port` in `client/vite.config.ts`

### Database Issues
The app uses an in-memory database for development. Data will reset when the server restarts. For production, implement a persistent database like PostgreSQL.

### Stripe Issues
Make sure you're using test mode API keys (they start with `sk_test_` and `pk_test_`).

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in environment variables
2. Use PostgreSQL instead of SQLite
3. Set secure JWT_SECRET
4. Use production Stripe keys
5. Configure CORS for your frontend domain

### Frontend
1. Build the frontend: `cd client && npm run build`
2. Deploy the `dist` folder to a static hosting service
3. Update `VITE_API_URL` to your production API URL

## Security Notes

- Change JWT_SECRET before deploying to production
- Never commit `.env` files to version control
- Use strong passwords for user accounts
- Implement rate limiting for production
- Enable HTTPS in production
- Regularly update dependencies

## Support

For issues or questions, please check:
- README.md for general information
- This SETUP.md for configuration details
- Stripe documentation: https://stripe.com/docs

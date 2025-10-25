# Simple Orders App

A full-stack order management application built with Next.js, featuring authentication, product management, and order tracking.

## Features

- **Authentication**: Login/logout with session-based authentication
- **Product Management**: View products with name, price, and stock information
- **Order System**: Create orders and view order history
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **MongoDB Integration**: Persistent data storage with MongoDB Atlas

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Clone the repository

2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Create a \`.env\` file in the root directory:

\`\`\`env
MONGODB_URI=mongodb+srv://clustername:<db_password>@user.jqcsr7m.mongodb.net/
DATABASE_NAME=DB_NAME
SESSION_SECRET=your-secret-key-here-change-in-production
\`\`\`

Replace \`<db_password>\` with your actual MongoDB password.

4. Seed the database with initial products:

\`\`\`bash
npm run seed
\`\`\`

5. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials

- Email: \`user@example.com\`
- Password: \`password123\`

## MongoDB Setup

### Database Collections

The application uses the following collections:

1. **products**: Stores product information

   - \`id\`: Unique product identifier
   - \`name\`: Product name
   - \`price\`: Product price
   - \`stock\`: Available stock quantity

2. **orders**: Stores order information
   - \`id\`: Unique order identifier
   - \`userId\`: User who created the order
   - \`productId\`: Product being ordered
   - \`productName\`: Product name (denormalized)
   - \`quantity\`: Order quantity
   - \`totalPrice\`: Total order price
   - \`createdAt\`: Order creation timestamp
   - \`status\`: Order status (pending/completed/cancelled)

### Seeding the Database

Run the seed script to populate the database with initial products:

\`\`\`bash
npm run seed
\`\`\`

This will:

- Clear existing products
- Insert 5 sample products
- Create necessary indexes

## Docker Deployment

### Build and run with Docker Compose:

\`\`\`bash
docker-compose up --build
\`\`\`

The application will be available at [http://localhost:3000](http://localhost:3000)

**Note**: Make sure to set your MongoDB connection string in the \`.env\` file before running Docker.

### Build Docker image manually:

\`\`\`bash
docker build -t simple-orders-app .
docker run -p 3000:3000 --env-file .env simple-orders-app
\`\`\`

## Project Structure

\`\`\`
├── app/
│ ├── api/ # API routes
│ ├── dashboard/ # Dashboard page
│ ├── layout.tsx # Root layout
│ └── page.tsx # Login page
├── components/ # React components
├── lib/
│ ├── auth.ts # Authentication logic
│ ├── mongodb.ts # MongoDB connection
│ ├── products.ts # Product repository
│ └── orders.ts # Order repository
├── scripts/
│ └── seed-database.js # Database seeding script
├── Dockerfile # Docker configuration
└── docker-compose.yml # Docker Compose configuration
\`\`\`

## Architecture

The application follows a clean architecture pattern:

- **Presentation Layer**: React components in \`/components\`
- **API Layer**: Next.js API routes in \`/app/api\`
- **Business Logic**: Service functions in \`/lib\`
- **Data Layer**: MongoDB with repository pattern

### MVC Pattern

- **Models**: Data structures defined in \`/lib\` (User, Product, Order)
- **Views**: React components in \`/components\`
- **Controllers**: API routes in \`/app/api\`

### Repository Pattern

The application uses a repository pattern with service functions:

- \`lib/auth.ts\`: User authentication and session management
- \`lib/mongodb.ts\`: MongoDB connection singleton
- \`lib/products.ts\`: Product data access and management
- \`lib/orders.ts\`: Order creation and retrieval

## API Endpoints

### Authentication

- \`POST /api/auth/login\`: User login
- \`POST /api/auth/logout\`: User logout
- \`GET /api/auth/session\`: Get current session

### Products

- \`GET /api/products\`: Get all products (requires authentication)

### Orders

- \`GET /api/orders\`: Get user's order history (requires authentication)
- \`POST /api/orders\`: Create new order (requires authentication)

## Validation

- Form validation on the client side
- API validation for all requests
- Stock availability checks before order creation
- Session validation for protected routes
- MongoDB schema validation with indexes

## Future Enhancements

- Real authentication with JWT or OAuth
- Payment processing integration
- Admin dashboard for product management
- Order status updates and tracking
- Email notifications
- Advanced search and filtering
- Product categories and images

## License

MIT

# Gujrat Book Shop Dashboard

A modern, responsive React dashboard for managing Gujrat Book Shop operations - a stationery and books e-commerce platform with a clean and intuitive interface.

## Features

### 🏠 Dashboard
- **Overview Statistics**: Revenue, orders, products, and customer metrics
- **Revenue Charts**: Visual representation of revenue trends over time
- **Order Analytics**: Order volume and status tracking
- **Top Products**: Best-performing products by sales and revenue
- **Recent Orders**: Latest order information with status updates

### 📦 Products Management
- **Product Catalog**: View and manage all products
- **Search & Filtering**: Find products by name, category, or status
- **Product Details**: SKU, pricing, stock levels, and status
- **CRUD Operations**: Add, edit, and delete products
- **Image Management**: Product image display and management

### 🛒 Orders Management
- **Order Tracking**: Monitor order status and progress
- **Customer Information**: View customer details for each order
- **Status Updates**: Update order status (pending, processing, shipped, delivered)
- **Order Details**: Complete order information including items and shipping
- **Search & Filtering**: Find orders by ID, customer, or status

### 👥 Customers Management
- **Customer Database**: Comprehensive customer information
- **Order History**: View all orders for each customer
- **Customer Value**: Categorize customers by spending patterns
- **Contact Information**: Email, phone, and address management
- **Customer Analytics**: Spending patterns and order frequency

### 📊 Analytics
- **Revenue Analytics**: Detailed revenue breakdowns and trends
- **Customer Growth**: New customer acquisition and retention
- **Product Performance**: Top-performing products and categories
- **Conversion Rates**: Track conversion metrics over time
- **Custom Time Ranges**: 7 days, 30 days, 90 days, or 1 year

### ⚙️ Settings
- **Store Configuration**: Store name, description, contact information
- **User Profile**: Personal information and preferences
- **Security Settings**: Two-factor authentication, session management
- **Payment Configuration**: Payment methods and transaction settings
- **Regional Settings**: Timezone, language, and currency preferences

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Charts**: Recharts for data visualization
- **Icons**: Heroicons for consistent iconography
- **Routing**: React Router for navigation
- **State Management**: React Context for authentication
- **HTTP Client**: Axios for API communication

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example env.local
# Edit env.local with your configuration
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── layout/        # Layout and navigation
│   └── ui/           # Reusable UI components
├── contexts/          # React contexts
├── pages/            # Main page components
├── services/         # API service functions
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Environment Variables

Create a `.env.local` file with the following variables:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME=Gujrat Book Shop Dashboard
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

# SHOP SPHERE 🌐🛍️
### Modern Online Classified Advertisement & Shopping Marketplace Platform
*Inspired by ClassifiedShop — Rebuilt with the Full MERN Stack (MongoDB, Express.js, React.js, Node.js)*

---

## 📌 1. Project Overview

**SHOP SPHERE** is a full-featured, production-ready MERN Stack web application that merges online classified advertisements with modern ecommerce shopping. It expands and enhances the core concepts of the traditional Java-based ClassifiedShop application by introducing:

- **JWT Authentication & Role-Based Authorization** (Customer, Seller, Admin)
- **Classifieds Directory & Marketplace Catalog** with real-time keyword search, category filtering, condition tagging, and sorting
- **Multer File Upload Pipeline** for high-resolution product photos
- **Persistent Shopping Cart & Checkout System** (Cash on Delivery, Credit/Debit Card mock, UPI / Online)
- **Seller Merchant Hub** where sellers manage their individual listings and fulfill orders
- **Admin Governance & Intelligence Dashboard** with real-time KPI metrics, category management, product moderation, and user/seller suspension controls
- **Automated Turnkey Database Seeder** with sample products, users, sellers, and admin accounts
- **Built-in In-Memory MongoDB Fallback** allowing immediate instant execution without requiring local database daemons or configuration!

---

## 🚀 2. Technology Stack

### Frontend:
* **Framework:** React.js (v18) with Vite
* **Routing:** React Router DOM (v6)
* **API Client:** Axios with JWT request & response interceptors
* **Icons:** React Icons (`Fa` FontAwesome collection)
* **Styling:** Modern CSS3 design system, responsive CSS Grid & Flexbox, smooth transitions, custom toast alert engine, and modal popups

### Backend:
* **Runtime:** Node.js (v18+)
* **Framework:** Express.js (v4)
* **Architecture:** Modular MVC (Controllers, Models, Routes, Middleware, Config, Seeder)
* **Authentication:** JSON Web Tokens (JWT) + `bcryptjs` password hashing (salt rounds: 10)
* **File Uploads:** Multer with static directory serving (`/uploads`)
* **Logging & Security:** Morgan, CORS, Dotenv, central error handler

### Database:
* **Database:** MongoDB (Local MongoDB Community Server, MongoDB Atlas Cloud, or In-Memory fallback)
* **ODM:** Mongoose (v8) with schema validation, indexes, and virtual references

---

## 📁 3. Project Directory Structure

```text
shopsphere/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & auto-seed fallback
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Me, Profile, Password
│   │   ├── productController.js  # Product CRUD, filters, pagination, seller listings
│   │   ├── categoryController.js # Category CRUD and product counts
│   │   ├── cartController.js     # Cart management (add, update, remove, clear)
│   │   ├── orderController.js    # Order checkout, customer orders, seller fulfillment
│   │   └── adminController.js    # Platform stats, users, sellers, global orders
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token validation & role authorization
│   │   ├── uploadMiddleware.js   # Multer file storage and image filter
│   │   └── errorHandler.js       # Central Mongoose & API error handler
│   ├── models/
│   │   ├── User.js               # Customers, Sellers, and Admins schema
│   │   ├── Product.js            # Classifieds & retail products schema
│   │   ├── Category.js           # Categories with slugs and icons
│   │   ├── Cart.js               # Persistent user carts
│   │   └── Order.js              # Order items, shipping address, seller references
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── adminRoutes.js
│   │   └── userRoutes.js
│   ├── seeder/
│   │   └── seed.js               # Database seeder with sample products & users
│   ├── uploads/                  # Uploaded product images
│   ├── .env                      # Active environment variables
│   ├── .env.example              # Sample environment template
│   ├── package.json
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar with branding, search, cart, profile
│   │   │   ├── Footer.jsx        # Trust features, quick links, contact info
│   │   │   ├── ProductCard.jsx   # Product card with badges, price, cart trigger
│   │   │   ├── ProtectedRoute.jsx# Role guard for user, seller, and admin
│   │   │   ├── Modal.jsx         # Action confirmation dialogs
│   │   │   ├── Toast.jsx         # Toast notification alerts
│   │   │   └── Loader.jsx        # Animated loading spinner
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Global user state & JWT authentication
│   │   │   └── CartContext.jsx   # Global cart state (synced with DB & guest storage)
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero section, categories, featured, recent listings
│   │   │   ├── Products.jsx      # Catalog with search, filters, conditions, sorting
│   │   │   ├── ProductDetails.jsx# Image gallery, seller box, stock, add to cart
│   │   │   ├── CategoriesPage.jsx# Visual department grid
│   │   │   ├── CartPage.jsx      # Itemized cart, quantity adjustments, price review
│   │   │   ├── CheckoutPage.jsx  # Address form, payment modes, order summary
│   │   │   ├── OrderSuccessPage.jsx # Order confirmation & tracking number
│   │   │   ├── AboutUs.jsx       # Mission & architecture overview
│   │   │   ├── ContactUs.jsx     # Customer support form & contact details
│   │   │   ├── Login.jsx         # Role-based login with password reset
│   │   │   ├── Register.jsx      # Tabbed Customer / Seller Registration
│   │   │   ├── user/
│   │   │   │   ├── UserDashboard.jsx # Quick stats & recent orders
│   │   │   │   ├── OrderHistory.jsx  # Itemized order history & milestones
│   │   │   │   └── UserProfile.jsx   # Update address & change password
│   │   │   ├── seller/
│   │   │   │   ├── SellerDashboard.jsx # Sales KPI cards, pending fulfillment
│   │   │   │   ├── SellerProducts.jsx  # Product inventory table, edit/delete
│   │   │   │   ├── AddProduct.jsx      # Multi-image upload, condition, pricing
│   │   │   │   ├── EditProduct.jsx     # Modify listing details
│   │   │   │   ├── SellerOrders.jsx    # Update item status (Pending -> Delivered)
│   │   │   │   └── SellerProfile.jsx   # Shop branding & business contact
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx  # Platform KPI analytics & quick links
│   │   │       ├── AdminUsers.jsx      # User list, search, block/unblock, delete
│   │   │       ├── AdminSellers.jsx    # Seller list, audit shops, block, delete
│   │   │       ├── AdminCategories.jsx # Add, update, delete categories
│   │   │       ├── AdminProducts.jsx   # Moderation, toggle featured, delete
│   │   │       └── AdminOrders.jsx     # Platform-wide order tracking & updates
│   │   ├── services/
│   │   │   └── api.js            # Axios instance with interceptors
│   │   ├── App.jsx               # Route mappings
│   │   ├── index.css             # Theme variables, utility classes, tables, cards
│   │   └── main.jsx              # React root entry
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── package.json                  # Root workspace script runner
└── README.md
```

---

## 🔑 4. Account Access & Password Security

- Demo credential fast-fill buttons have been removed from the login pages.
- New customers, sellers and shops can create their own account from `/register`.
- Passwords must be more than 6 characters and include at least one uppercase letter, one lowercase letter, one number and one special character.
- Use **Forgot password?** on any login portal to request a secure reset link by email.
- Reset links expire after 30 minutes and can only be used once.
- If SMTP is not configured locally, the reset page provides a development-only direct reset link and Ethereal email preview.

---

## ⚙️ 5. Installation & Setup Instructions (Windows)

### Prerequisites:
1. **Node.js** (v18.x or later installed). Check with `node -v` in PowerShell.
2. **MongoDB** (Optional: local MongoDB Community Server or MongoDB Atlas Cloud. If not running, SHOP SPHERE will automatically start an in-memory database instance so you can run the app immediately!)

---

### Step 1: Open Terminal in Project Directory
Open **PowerShell** or **Command Prompt** and navigate to:
```powershell
cd C:\Users\harsh\OneDrive\Desktop\shopsphere
```

---

### Step 2: Backend Configuration & Start
Open a terminal tab for the backend:

```powershell
# Navigate into backend
cd backend

# Install dependencies (already installed during setup)
npm install

# (Optional) Run the database seeder if you ever want to reset data:
npm run seed

# Start the Backend Server:
npm start
```
> The backend will listen on **`http://localhost:5000`**.  
> You will see confirmation:
> ```text
> SHOP SPHERE Backend running on port 5000 in development mode.
> Health check available at: http://localhost:5000/api/health
> MongoDB Connected: 127.0.0.1
> ```

---

### Step 3: Frontend Start
Open a second **PowerShell** terminal tab for the frontend:

```powershell
# Navigate into frontend
cd C:\Users\harsh\OneDrive\Desktop\shopsphere\frontend

# Start the Vite React development server:
npm run dev
```

> The frontend will launch at **`http://localhost:3000`** (or `http://localhost:5173`).  
> Open your browser and navigate to:
> **`http://localhost:3000`**

---

## 🌐 6. Environment Variables Configuration

The backend contains a `.env` file with the following default configuration:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/shopsphere
JWT_SECRET=shopsphere_super_secret_jwt_key_2026_classify_store
JWT_EXPIRE=30d
```

### Using MongoDB Atlas (Cloud Database):
To use a free MongoDB Atlas cluster, simply update `MONGO_URI` in `backend/.env`:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/shopsphere?retryWrites=true&w=majority
```

---

## 🧪 7. Functional Testing & Feature Verification

### 1. Public Marketplace & Browsing
- Visit `http://localhost:3000`.
- Use the **Hero Search Bar** to search for *"MacBook"* or *"Sony"*.
- Click on any **Category Pill** (e.g. *Electronics*, *Home & Furniture*) to view filtered items.
- Sort listings by **Price: Low to High**, **Price: High to Low**, or **Recently Added**.
- Click on any product card to view the **Product Details Page**, inspect the image gallery, condition badge, and seller store details.

### 2. User Shopping & Checkout
- Add items to your cart by clicking **Add to Cart**.
- Open the cart (`/cart`) and test quantity counters (`+` / `-`).
- Click **Proceed to Checkout** (`/checkout`).
- Enter shipping information, select **Cash on Delivery** or **Credit/Debit Card**, and click **Place Order**.
- Receive immediate confirmation with an official order number (`SPHERE-XXXX-XXXX`) and view it under **Order History**.

### 3. Seller Module
- Log in as `seller@shopsphere.com` (or click the Seller quick-fill button).
- Navigate to **Seller Hub** (`/seller`) to inspect sales volume and active listings.
- Go to **Post New Listing** (`/seller/add-product`):
  - Enter name, condition, price, stock, and upload images.
  - The listing instantly appears on the public marketplace!
- Go to **Customer Orders** (`/seller/orders`):
  - Review orders placed by buyers for your items.
  - Update milestone status (e.g., from *Pending* to *Processing*, *Shipped*, or *Delivered*).

### 4. Admin Management System
- Log in as `admin@shopsphere.com` (or click the Admin quick-fill button).
- Access the **Admin Control Center** (`/admin`):
  - Review total users, sellers, products, orders, and platform revenue.
- Under **Customer Accounts** (`/admin/users`), search for users and test the **Block / Unblock** toggle.
- Under **Merchants** (`/admin/sellers`), inspect seller shops and moderation actions.
- Under **Categories** (`/admin/categories`), add a new category with a custom description and icon.
- Under **Listings** (`/admin/products`), toggle **Featured** badges on homepage items or delete violating listings.
- Under **Platform Orders** (`/admin/orders`), filter by order status and track platform-wide deliveries.

---

## 🔒 8. Security & Architecture Highlights

1. **Password Hashing:** Passwords are never stored in plain text; hashed with `bcryptjs` salt rounds before MongoDB persistence.
2. **JWT Route Guards:** Sensitive routes are strictly guarded by `protect` and `authorize('user')`, `authorize('seller')`, and `authorize('admin')`.
3. **Suspension Defense:** Blocked accounts cannot obtain new tokens or access APIs; requests return `403 Account Suspended`.
4. **Data Isolation:** Sellers can only view, update, or delete their own product inventory and orders.
5. **Validation & Error Handling:** Comprehensive Mongoose schema validation, duplicate key protection, and meaningful client error messages.

---

## 📄 License
This project is licensed under the MIT License. Developed for **SHOP SPHERE**.


# 👑 AURA LUXE — Haute Parfumerie & Niche Fragrances

A high-concurrency, ultra-luxury E-Commerce boutique built for exclusive perfume collections. Designed with a bespoke dark & gold aesthetic, seamless customer purchase workflows, and real-time executive analytics.

---

## ✨ Features & Highlights

### 🛍️ Client Experience (Storefront)
* **Luxury Dark & Amber Aesthetic**: Tailored UI built with Tailwind CSS, custom Cinzel typography, and animated micro-interactions.
* **Dynamic Product Catalog**: Clean product showcases with real-time average ratings derived strictly from customer database reviews.
* **Smart Shopping Bag & Wishlist**: Powered by `Zustand` with persistent storage support (`sessionStorage` & `localStorage`).
* **Order Tracking & Digital Receipts**: Customers can track order status using unique codes (`AURA-XXXXXX`) or phone numbers, complete with printable boutique receipts.
* **Interactive Reviews System**: Real client feedback moderation and rating submission.

### 📊 Executive Control Center (Admin Suite)
* **Real-time Analytics**: Tracks delivered revenue, pending orders, catalog stats, and **unique client site visits** (excluding page refreshes and admin sessions via `sessionStorage` & atomic locking).
* **Catalog Management**: Full CRUD capabilities for adding, updating, and deleting fragrance items, managing stock levels, prices, sale discounts, and badges (`Best Seller`, `Hot 🔥`).
* **Order Processing**: Real-time order status tracking (`Pending`, `Shipped`, `Delivered`, `Cancelled`) with automated inventory stock deduction upon checkout.
* **Review Moderation**: Admin moderation dashboard to review and remove inappropriate product comments.
* **Custom Luxury Modals**: Clean dark/gold confirmation prompts replacing native browser alerts.

---

## 🛠️ Tech Stack & Architecture

* **Framework**: Next.js (App Router, React 19)
* **Language**: TypeScript
* **Database & Backend**: Supabase (PostgreSQL, Row-Level Security, RPCs)
* **State Management**: Zustand (with Persist Middleware)
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Deployment**: Vercel & GitHub Actions CI/CD

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18+) and npm/pnpm/yarn installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_GITHUB_USERNAME/aura-luxe.git](https://github.com/YOUR_GITHUB_USERNAME/aura-luxe.git)
   cd aura-luxe
Install dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env.local file in the root directory and add your Supabase credentials:

Code snippet
NEXT_PUBLIC_SUPABASE_URL=[https://your-supabase-project.supabase.co](https://your-supabase-project.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
Run the Development Server:

Bash
npm run dev
Open http://localhost:3000 with your browser to view the boutique.

🛡️ Database Schema (Supabase)
The core database relies on four primary tables:

products: Fragrance catalog, stock counts, category tags, and pricing.

orders: Customer details, cart items JSON payload, total amount, and delivery status.

reviews: Client ratings and feedback linked to products.

site_visits: Unique visit counter timestamps for analytics.

✒️ Author & Engineering
Designed & Engineered with passion by Omar Gouda.
<div align="center">

# 📖 FABLE

### *Where Stories Come Alive — Next-Gen Digital Publishing & E-Book Platform*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Better-Auth](https://img.shields.io/badge/Better--Auth-1.7.1-black?style=for-the-badge&logo=shield&logoColor=white)](https://better-auth.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.5.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-22.5.0-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

### 🌐 [ **Live Demo: fable-sage.vercel.app** ](https://fable-sage.vercel.app/)

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_App-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://fable-sage.vercel.app/)

</div>

---

## ⚡ Overview

**Fable** is an end-to-end digital reading & publishing ecosystem designed for authors, readers, and literary enthusiasts. Built with modern web technologies, Fable bridges creative writing and digital commerce — offering an immersive reading client, author publishing workflow, analytics, and instant e-book monetization.

---

## 🔥 Key Highlights & Features

<table>
  <tr>
    <td width="50%">
      <h3>📚 E-Book Storefront & Reader</h3>
      <ul>
        <li><b>Rich Discovery</b>: Curated genres, trending picks & top writers.</li>
        <li><b>In-Browser Reader</b>: Responsive reading interface tailored for desktop & mobile.</li>
        <li><b>Instant Search</b>: Filter books by genre, popularity, and author.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>✍️ Author & Publisher Studio</h3>
      <ul>
        <li><b>Manuscript Publishing</b>: Publish e-books seamlessly with instant metadata setup.</li>
        <li><b>Sales & Analytics</b>: Real-time reader engagement and revenue charts powered by Recharts.</li>
        <li><b>Writer Profile</b>: Showcase bio, portfolio, and published collection.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔐 Authentication & Security</h3>
      <ul>
        <li><b>Better-Auth Integration</b>: Role-based session management (Reader, Writer, Admin).</li>
        <li><b>MongoDB Adapter</b>: Fast, flexible schema storage for users, orders, & book data.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>💳 Commerce & Theme Experience</h3>
      <ul>
        <li><b>Stripe Checkout</b>: Secure digital purchases with instant order completion.</li>
        <li><b>Micro-Animations</b>: Butter-smooth motion via <code>framer-motion</code>.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 📦 Tech Stack & Packages Breakdown

| Category | Package | Version | Purpose |
| :--- | :--- | :---: | :--- |
| **Core Framework** | [`next`](https://www.npmjs.com/package/next) | `^16.3.1` | React App Router, Server Components & API Routes |
| | [`react`](https://www.npmjs.com/package/react) | `19.2.8` | UI Library Foundation |
| | [`react-dom`](https://www.npmjs.com/package/react-dom) | `19.2.8` | DOM Rendering Engine |
| **Authentication & DB** | [`better-auth`](https://www.npmjs.com/package/better-auth) | `^1.7.1` | Authentication Engine & Session Handler |
| | [`@better-auth/mongo-adapter`](https://www.npmjs.com/package/@better-auth/mongo-adapter) | `^1.7.1` | MongoDB Adapter for Better-Auth |
| | [`mongodb`](https://www.npmjs.com/package/mongodb) | `^7.5.0` | Database Driver |
| **Payments** | [`stripe`](https://www.npmjs.com/package/stripe) | `^22.5.0` | Server-Side Payment Processing |
| | [`@stripe/stripe-js`](https://www.npmjs.com/package/@stripe/stripe-js) | `^9.14.0` | Client-Side Stripe Elements Loader |
| **Design & UI** | [`@heroui/react`](https://www.npmjs.com/package/@heroui/react) | `^3.2.4` | Modern UI Component Library |
| | [`tailwindcss`](https://www.npmjs.com/package/tailwindcss) | `^4.0.0` | Utility-First Styling Framework |
| | [`lucide-react`](https://www.npmjs.com/package/lucide-react) | `^1.33.0` | Modern Vector Icon Suite |
| | [`next-themes`](https://www.npmjs.com/package/next-themes) | `^0.4.6` | Theme Provider (Light/Dark Mode) |
| **Interactivity** | [`framer-motion`](https://www.npmjs.com/package/framer-motion) | `^13.1.1` | Page & Component Animation Engine |
| | [`swiper`](https://www.npmjs.com/package/swiper) | `^14.1.0` | Interactive Banners & Book Carousels |
| **Analytics** | [`recharts`](https://www.npmjs.com/package/recharts) | `^3.10.1` | Data Visualization for Dashboards |

---

## 🛠️ Project Structure

```
fable/
 ├── 📁 src/
 │    ├── 📁 app/               # Next.js App Router (Pages, API & Layouts)
 │    │    ├── 📁 api/          # Server API Endpoints
 │    │    ├── 📁 auth/         # Login & Registration Workflows
 │    │    ├── 📁 dashboard/    # Admin, Writer & Reader Role Dashboards
 │    │    ├── 📁 e-books/      # E-Book Storefront & Details Pages
 │    │    └── 📁 writers/      # Writer Profiles & Hub
 │    ├── 📁 components/       # Reusable UI & Interactive Components
 │    └── 📁 lib/              # Auth, Database & Stripe Utilities
 └── 📄 package.json            # Project Manifest & Dependencies
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** `v18.x` or higher
- **npm**, **pnpm**, or **yarn**
- **MongoDB Instance** (Local or Atlas)
- **Stripe Account** (For payments API keys)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rakib97j/Fable.git
   cd fable
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_mongodb_connection_string
   BETTER_AUTH_SECRET=your_auth_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```

5. Visit [`http://localhost:3000`](http://localhost:3000) in your browser.

---

<div align="center">

Made By RAKIBUL HASSAN RAKIB 

</div>

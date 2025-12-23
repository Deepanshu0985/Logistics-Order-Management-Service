# 🚚 Logistics Dashboard

<div align="center">

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.x-FF0055?style=for-the-badge&logo=framer&logoColor=white)

**A stunning, modern logistics order management dashboard**

*Real-time order tracking • Partner management • Beautiful dark theme*

---

</div>

## ✨ Features

### 📦 Order Management
- **Real-time order tracking** with live status updates
- **Status workflow**: Placed → Assigned → Picked → Delivered
- **One-click partner assignment** via elegant modal interface
- **Paginated order list** for efficient data handling

### 🚛 Partner Management
- **Delivery partner directory** with status tracking
- **City-based filtering** for quick partner lookup
- **Status management**: Available / On Delivery / Offline
- **Vehicle type tracking** for assignment optimization

### 🎨 Premium UI/UX
- **Dark glassmorphism theme** with animated gradients
- **Smooth micro-animations** powered by Framer Motion
- **Responsive design** for all screen sizes
- **Custom status badges** with contextual colors and icons
- **Loading states & empty states** for better UX

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI component library with hooks |
| **Vite 7** | Lightning-fast build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling framework |
| **Framer Motion** | Smooth animations & transitions |
| **Lucide React** | Beautiful, consistent iconography |
| **Axios** | HTTP client for API communication |
| **React Router DOM** | Client-side routing |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ 
- **npm** v9+ or **yarn** v1.22+
- Running backend API (Spring Boot Logistics Service)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/logistics-frontend.git

# Navigate to project directory
cd logistics-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Setup

The frontend expects the backend API to be running at `http://localhost:8080`. If your backend runs on a different port, update the base URL in `src/api/orders.api.js` and `src/api/partners.api.js`.

---

## 📁 Project Structure

```
logistics-frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API service modules
│   │   ├── orders.api.js  # Order-related API calls
│   │   └── partners.api.js # Partner-related API calls
│   │
│   ├── components/        # Reusable UI components
│   │   ├── AssignPartnerModal.jsx  # Partner assignment modal
│   │   ├── OrdersTable.jsx         # Orders data table
│   │   ├── Pagination.jsx          # Page navigation
│   │   └── StatusBadge.jsx         # Status indicator badges
│   │
│   ├── pages/             # Page components
│   │   ├── OrdersPage.jsx    # Orders management view
│   │   └── PartnersPage.jsx  # Partners management view
│   │
│   ├── App.jsx            # Root component with navigation
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles & design system
│
├── index.html             # HTML entry point
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js         # Vite configuration
└── package.json           # Project dependencies
```

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary Gradient** | `#6366f1` → `#8b5cf6` | Buttons, active states |
| **Background** | `#0f0f1a` | Main background |
| **Card Background** | `rgba(23, 23, 35, 0.8)` | Glass cards |
| **Text Primary** | `#f8fafc` | Headings, important text |
| **Text Secondary** | `#94a3b8` | Body text |
| **Text Muted** | `#64748b` | Subtle text |

### Status Colors

| Status | Color | Badge Class |
|--------|-------|-------------|
| Placed | `#fbbf24` | `badge-placed` |
| Assigned | `#60a5fa` | `badge-assigned` |
| Picked / In Transit | `#fb923c` | `badge-picked` |
| Delivered | `#4ade80` | `badge-delivered` |
| Available | `#4ade80` | `badge-available` |
| Busy | `#f97316` | `badge-busy` |
| Offline | `#6b7280` | `badge-offline` |

### Component Classes

```css
/* Glass Card Effect */
.glass-card { /* Glassmorphism with backdrop blur */ }

/* Buttons */
.btn-primary   /* Gradient purple button */
.btn-secondary /* Transparent bordered button */
.btn-success   /* Green gradient button */
.btn-warning   /* Orange gradient button */
.btn-sm        /* Small button variant */

/* Form Elements */
.input         /* Styled text input */
.select        /* Styled dropdown select */

/* Table */
.table-container  /* Rounded table wrapper */
.table            /* Styled table with hover effects */
```

---

## 📡 API Integration

### Orders API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/orders` | GET | Fetch paginated orders |
| `/api/orders/:id/status` | PATCH | Update order status |
| `/api/orders/:id/assign` | POST | Assign partner to order |

### Partners API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/partners` | GET | Fetch paginated partners |
| `/api/partners/available/:city` | GET | Get available partners by city |
| `/api/partners/:id/status` | PATCH | Update partner status |

---

## 🖥️ Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality
npm run lint
```

---

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:

- **Desktop** (1200px+): Full layout with side-by-side stats
- **Tablet** (768px - 1199px): Adjusted grid, 2-column stats
- **Mobile** (< 768px): Stacked layout, touch-friendly buttons

---

## 🔮 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Order creation form
- [ ] Partner registration
- [ ] Advanced filtering & search
- [ ] Dashboard analytics with charts
- [ ] Dark/Light theme toggle
- [ ] Export orders to CSV/PDF
- [ ] Notification system

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for efficient logistics management**

*Star ⭐ this repo if you found it helpful!*

</div>

# CaseFlow

> A production-ready, accessible and lightning-fast case management system.

**One-liner:** Import → Validate → Fix → Submit → Track

## Architecture

```
CaseFlow/
├── frontend/          # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── features/      # Redux slices (auth, cases, upload)
│   │   ├── layouts/       # Page layouts (Auth, Dashboard)
│   │   ├── pages/         # Route pages
│   │   ├── services/      # API client
│   │   ├── types/         # TypeScript definitions
│   │   └── lib/           # Utility functions
│   └── ...
├── backend/           # Express + TypeScript
│   ├── src/
│   │   ├── routes/        # API routes (auth, cases)
│   │   └── server.ts      # Express server setup
│   └── ...
└── sample-cases.csv   # Sample data for testing
```

### Technology Stack

#### Frontend
- **Framework:** React with TypeScript
- **Build Tool:** Vite (lightning fast)
- **State Management:** Redux Toolkit + Zustand
- **Styling:** Tailwind CSS with custom design system
- **Animations:** Framer Motion
- **UI Components:** Radix UI (headless, accessible)
- **Data Grid:** TanStack Table with virtualization
- **Form Handling:** React Hook Form + Zod validation
- **CSV Parsing:** PapaParse
- **File Upload:** React Dropzone
- **Notifications:** Sonner (beautiful toasts)
- Lucide React

#### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express
- **Authentication:** JWT + bcryptjs
- **Database:** In-memory (for testing) - easily replaceable with PostgreSQL/MongoDB
- **Validation:** Zod schemas
- **Security:** CORS, helmet-ready
- **Testing:** Vitest + Supertest

## Quick Start

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Rajput-xv/CaseFlow.git
cd CaseFlow
```

2. **Setup Frontend**
```bash
cd frontend
npm install
```

3. **Setup Backend**
```bash
cd ../backend
npm install
```

4. **Run the application**

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App runs on: http://localhost:3000

5. **Login with test credentials**
```
Email: test@example.com
Password: password123
```

## Usage Guide

### 1. Authentication
- Sign up with email/password or login with existing credentials

### 2. Upload CSV
- Navigate to Upload page
- Drag & drop your CSV file or click to browse
- See real-time validation with inline error indicators

### 3. Validate & Fix
- Review parsed data in virtualized data grid
- See validation errors highlighted in red
- View summary stats (total, valid, errors)

### 4. Import Cases
- Click "Import" to batch create cases
- See animated progress and final report
- Download error CSV if needed

### 5. Manage Cases
- Browse cases
- Filter by status, category, priority
- Search by case ID or applicant name
- View detailed case information

## Design Decisions

### 1. Frontend Architecture
- **Modular Structure:** Features are organized by domain (auth, cases, upload)
- **Component Library:** Built reusable UI components with consistent styling
- **State Management:** Redux for global state, local state for UI-specific needs
- **Animation Strategy:** Framer Motion for smooth, performant animations
- **Responsive Design:** Mobile-first approach with Tailwind breakpoints

### 2. Data Grid Strategy
- **Virtualization:** TanStack Virtual for handling large datasets (50k+ rows)
- **Inline Validation:** Real-time error display with Zod schemas
- **Performance:** Memoization and lazy loading for optimal rendering

### 3. CSV Processing
- **Client-side Parsing:** PapaParse for fast, browser-based parsing
- **Streaming:** Handles large files without blocking UI
- **Validation:** Immediate feedback with actionable error messages

### 4. Authentication
- **JWT Strategy:** Stateless authentication for scalability
- **Token Storage:** localStorage (can be upgraded to httpOnly cookies)
- Role-based Access:** Admin vs Operator roles

## Testing

### Frontend
```bash
cd frontend
npm test          # Run unit tests
npm run test:ui   # Visual test UI
npm run e2e       # End-to-end tests
```

### Backend
```bash
cd backend
npm test          # Run unit tests
```

### Test Coverage
- Component tests with React Testing Library
- Unit tests for validation logic
- E2E tests with Playwright (ready to add)
- API endpoint tests (ready to add)

## Project Structure

```
frontend/src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Card, etc.)
│   └── upload/          # Upload-specific components
├── features/
│   ├── auth/            # Authentication slice & logic
│   ├── cases/           # Cases management slice
│   └── upload/          # Upload slice & logic
├── layouts/
│   ├── AuthLayout.tsx   # Auth pages wrapper
│   └── DashboardLayout.tsx  # Dashboard wrapper with sidebar
├── pages/
│   ├── auth/            # Login & Register pages
│   ├── dashboard/       # Dashboard home
│   ├── upload/          # CSV upload & preview
│   └── cases/           # Cases list & detail
├── services/
│   └── api/             # Axios client & API calls
├── types/               # TypeScript interfaces
└── lib/                 # Utility functions

backend/src/
├── routes/
│   ├── auth.ts          # Authentication endpoints
│   └── cases.ts         # Cases CRUD endpoints
└── server.ts            # Express server setup
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

## Sample CSV Format

```csv
case_id,applicant_name,dob,email,phone,category,priority
C-1001,Asha Verma,1990-03-14,asha.verma@example.com,+919876543210,TAX,HIGH
C-1002,John DOE,1985-12-02,john.doe@example.com,+11234567890,LICENSE,MEDIUM
```

**Required Fields:**
- `case_id` - Unique identifier
- `applicant_name` - Full name
- `dob` - ISO date (YYYY-MM-DD)
- `category` - TAX | LICENSE | PERMIT
- `priority` - LOW | MEDIUM | HIGH (defaults to LOW)

**Optional Fields:**
- `email` - Valid email address
- `phone` - E.164 format (e.g., +1234567890)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Rajput-xv - [@Rajput-xv](https://github.com/Rajput-xv)

Project Link: [https://github.com/Rajput-xv/CaseFlow](https://github.com/Rajput-xv/CaseFlow)

---
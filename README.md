# Military Asset Management System

A comprehensive full-stack application for tracking, managing, and controlling military assets across multiple bases with role-based access control.

## 🎯 System Features

### Dashboard
- **8 Key Metrics**: Opening Balance, Purchases, Transfer In, Transfer Out, Assigned, Expended, Net Movement, Closing Balance
- **Advanced Filtering**: Filter by Base, Start Date, and End Date
- **Net Movement Modal**: Click on Net Movement card to see detailed breakdown (Purchases + Transfer In - Transfer Out)
- **Responsive Grid Layout**: 4 columns on desktop, responsive on mobile

### Purchases Module
- **Record Purchases**: Add new equipment purchases to specific bases
- **Equipment Selection**: Choose from predefined equipment types with categories
- **Purchase History**: View all purchases for selected base with date and quantity
- **Real-time Updates**: Auto-refresh history after recording new purchase

### Transfers Module
- **Inter-Base Transfers**: Move assets between any two bases
- **Validation**: Ensures from and to bases are different
- **Transfer History**: Shows both incoming and outgoing transfers
- **Complete Audit Trail**: Timestamp and equipment details for all transfers

### Assignments & Expenditures Module
- **Asset Assignments**: Assign equipment to personnel with tracking
- **Expenditure Recording**: Track assets that have been expended/used
- **Tabbed Interface**: Easy switching between assignments and expenditures views
- **Personnel Tracking**: Record who was assigned which equipment

## 🔐 Role-Based Access Control (RBAC)

### Admin
- Full access to all bases, equipment, and operations
- Username: `admin1` | Password: `admin123`

### Base Commander
- Access restricted to their assigned base only
- Can view and manage all operations for their base
- Username: `commander1` | Password: `cmd123` (Base Alpha)
- Username: `commander2` | Password: `cmd123` (Base Bravo)

### Logistics Officer
- Can record purchases and transfers
- Limited to specific base operations
- Username: `logistics1` | Password: `log123` (Base Alpha)

## 🚀 Quick Start

### Start Backend (Python)
```powershell
cd c:\Users\Manoj\Downloads\mil_asset_system_files\backend
python -m pip install fastapi uvicorn python-multipart
python -m uvicorn app.main:app --reload --port 8000
```
Backend runs on: **http://localhost:8000**

### Start Frontend (Node.js)
```powershell
cd c:\Users\Manoj\Downloads\mil_asset_system_files\frontend
npm install
npm start
```
Frontend runs on: **http://localhost:3000**

## 📊 Available Demo Data

### Bases
- Base Alpha (ID: 1)
- Base Bravo (ID: 2)
- Base Charlie (ID: 3)

### Equipment
1. Rifle M4 (Weapon)
2. Ammunition 5.56mm (Ammo)
3. Military Vehicle (Transport)
4. Helmet (Protective Gear)

### Initial Stock
- Each base starts with 100 units of each equipment type

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI + Uvicorn
- **Database**: In-memory (Dict-based for demo)
- **CORS**: Enabled for localhost:3000 and localhost:5173
- **Auth**: Token-based (simplified for demo)
- **Endpoints**:
  - `/api/auth/token` - Login
  - `/api/dashboard` - Dashboard metrics
  - `/api/bases` - List bases
  - `/api/equipment` - List equipment
  - `/api/purchases` - CRUD purchases
  - `/api/transfers` - CRUD transfers
  - `/api/assignments` - CRUD assignments
  - `/api/expenditures` - CRUD expenditures
  - `/api/stock` - Get current stock

### Frontend (React)
- **Framework**: React 18+ with Create React App
- **UI Library**: Tailwind CSS
- **Routing**: React Router v6+
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useContext via localStorage)

## 📁 Project Structure

```
mil_asset_system_files/
├── backend/
│   └── app/
│       ├── main.py          (All endpoints and logic)
│       ├── __init__.py       (Package marker)
│       ├── config.py         (Database config)
│       ├── models.py         (SQLAlchemy models - optional)
│       ├── schemas.py        (Pydantic schemas)
│       ├── crud.py           (CRUD operations)
│       ├── deps.py           (Dependencies)
│       └── routers/          (Endpoint routers)
│
└── frontend/
    ├── src/
    │   ├── App.jsx           (Main app with routing)
    │   ├── index.js          (React entry point)
    │   ├── index.css         (Global styles)
    │   ├── api/
    │   │   └── api.js        (Axios API client)
    │   └── pages/
    │       ├── Login.jsx     (Login with demo credentials)
    │       ├── Dashboard.jsx (Dashboard with metrics & filters)
    │       ├── PurchaseForm.jsx (Purchases page)
    │       ├── Transfers.jsx (Transfers page)
    │       └── AssignmentsExpeditures.jsx (Assignments & Expenditures)
    │
    └── package.json          (Dependencies)
```

## 🎨 UI Features

### Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Responsive grid layouts (1 col mobile, 2-4 cols desktop)

### Visual Enhancements
- Gradient backgrounds (Blue theme)
- Color-coded metric cards
- Hover effects and transitions
- Modal popups for detailed views
- Loading states and error messages
- Tab-based navigation

### User Experience
- Smooth transitions
- Form validation
- Real-time updates
- Breadcrumb navigation
- Clear error messaging
- Success confirmations

## 📝 Key Metrics Calculation

```
Opening Balance = Sum of opening stock for all equipment
Purchases = Total quantity of all purchases
Transfer In = Total quantity received from other bases
Transfer Out = Total quantity sent to other bases
Assigned = Total quantity assigned to personnel
Expended = Total quantity expended/used
Net Movement = Purchases + Transfer In - Transfer Out
Closing Balance = Opening + Purchases + Transfer In - Transfer Out - Assigned - Expended
```

## 🔄 Data Flow

1. **User Login** → Receives JWT token → Stored in localStorage
2. **Dashboard** → Fetches metrics for selected base
3. **Purchases** → Records purchase → Updates dashboard metrics
4. **Transfers** → Records transfer between bases → Updates both base metrics
5. **Assignments** → Assigns equipment to personnel → Impacts base balance
6. **Expenditures** → Records expended equipment → Reduces available stock

## 🛡️ Security Features

- Token-based authentication
- Role-based access control (RBAC)
- Base-specific data isolation for Base Commanders
- CORS protection
- Form validation
- Error handling with user-friendly messages

## 📈 Future Enhancements

- Persistent database (PostgreSQL/MySQL)
- Detailed audit logs
- PDF report generation
- Email notifications
- Advanced analytics and forecasting
- Multi-language support
- Dark mode
- Export to CSV/Excel

## 🐛 Troubleshooting

### Port Already in Use
- Backend: Change port in uvicorn command `--port 8001`
- Frontend: Set `PORT=3001` before running `npm start`

### CORS Errors
- Check backend CORS middleware allows frontend URL
- Verify frontend API baseURL matches backend URL

### Token Invalid
- Clear localStorage: Open DevTools → Application → Clear all
- Log out and log back in

### Dependencies Issues
```powershell
# Backend
pip install --upgrade fastapi uvicorn python-multipart

# Frontend
npm install
npm audit fix
```

## 📞 Support

For issues or questions, check the console logs:
- Frontend: Browser DevTools Console (F12)
- Backend: Terminal output from uvicorn

---

**System Status**: ✅ Fully Functional
**Last Updated**: December 9, 2025
**Version**: 1.0.0

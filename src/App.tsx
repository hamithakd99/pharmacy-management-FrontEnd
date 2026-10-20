import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import TestPage from './pages/test.page'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import EmployeeLayout from './layouts/EmployeeLayout'
import CashierLayout from './layouts/CashierLayout'
import AdminLayout from './layouts/AdminLayout'
import OpeningStock from './components/Inventory/OpeningStock'
import CreateOrder from './components/Order/CreateOrder/createOrder'
import OrderManagement from './pages/Admin/orderManagement'
import EditPO from './components/PO/EditPO'
import CreatePO from './components/PO/CreatePO'
import PurchaseOrderManagement from './pages/Admin/purchaseOrderManagement'
import EditGRN from './components/GRN/EditGRN'
import CreateGRN from './components/GRN/CreateGRN'
import GRNManagement from './pages/Admin/gRNManagement'
import ExternalUserRegister from './pages/Admin/user registation/admin.externalUser.register.page'
import UserRegister from './pages/Admin/user registation/admin.user.register.page'
import CategoriesManagement from './pages/Admin/categoriesManagement'
import AddProduct from './pages/Admin/Product Management/addNewProduct'
import EditProduct from './pages/Admin/Product Management/editProduct'
import ProductManagement from './pages/Admin/productManagement'
import UserManagement from './pages/Admin/userManagement'
import Dashboard from './pages/Admin/dashBoard'


function App() {
  return (
    <BrowserRouter>
      <Toaster position='top-right' />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        //admin routes
        <Route
          element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
        >
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="users" element={<UserManagement />} />

            <Route path="products" element={<ProductManagement />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />

            <Route path="categories" element={<CategoriesManagement />} />

            <Route path="register/newuser" element={<UserRegister />} />
            <Route
              path="register/external/newuser"
              element={<ExternalUserRegister />}
            />

            <Route path="grn" element={<GRNManagement />} />
            <Route path="grn/create" element={<CreateGRN />} />
            <Route path="grn/edit/:batchNumber" element={<EditGRN />} />

            <Route path="po" element={<PurchaseOrderManagement />} />
            <Route path="po/create" element={<CreatePO />} />
            <Route path="po/purchase-orders/:id" element={<EditPO />} />

            <Route path="orders" element={<OrderManagement />} />
            <Route path="orders/create" element={<CreateOrder />} />

            <Route path="opening-stock" element={<OpeningStock />} />
          </Route>
        </Route>


        {/* Cashier routes */}
        <Route element={<ProtectedRoute allowedRoles={["CASHIER"]} />}>
          <Route path="/cashier" element={<CashierLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="orders/create" element={<CreateOrder />} />
          </Route>
        </Route>


        <Route element={<ProtectedRoute allowedRoles={["EMPLOYEE"]} />}>
          <Route path="/employee/*" element={<EmployeeLayout />} />
        </Route>
        <Route path="/testing" element={<TestPage />} />
        <Route path="/*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

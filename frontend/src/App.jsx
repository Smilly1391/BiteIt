import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

// Public pages
import Join from "./pages/join";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import AboutUs from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Cart from "./pages/Cart";
import Services from "./pages/Services";
import MyOrders from "./pages/MyOrders"; 

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminContacts from "./pages/admin/AdminContacts";

// Route guard
import AdminPrivateRoute from "./routes/AdminPrivateRoute";

function App() {
  const location = useLocation();

  // Hide Navbar on these routes
  const hideNavbarRoutes = ["/login", "/signup", "/forgot-password"];
  const hideNavbar =
    hideNavbarRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/join" element={<Join />} />
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/myorders" element={<MyOrders />} /> {/* ✅ Updated */}
        {/* Admin Auth Route */}
        <Route path="/admin/login" element={<AdminLogin />} />
        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminPrivateRoute>
              <AdminDashboard />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminPrivateRoute>
              <ManageProducts />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminPrivateRoute>
              <ManageOrders />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminPrivateRoute>
              <ManageUsers />
            </AdminPrivateRoute>
          }
        />
                <Route
          path="/admin/contacts"
          element={
            <AdminPrivateRoute>
              <AdminContacts />
            </AdminPrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tenants from "./pages/Tenants";
import Users from "./pages/Users";
import AddTenant from "./pages/AddTenant";
import AddUser from "./pages/AddUser";
import EditTenant from "./pages/EditTenant";
import EditUser from "./pages/EditUser";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/users" element={<Users />} />
              <Route path="/tenants/add" element={<AddTenant />} />
              <Route path="/users/add" element={<AddUser />} />
              <Route path="/tenants/edit/:id" element={<EditTenant />} />
              <Route path="/users/edit/:id" element={<EditUser />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

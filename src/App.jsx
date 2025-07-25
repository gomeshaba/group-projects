import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AdminLayout from "layouts/admin";
import UserPage from "views/UserPage";

const App = () => {
  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-gray-100 shadow">
        <div className="flex space-x-4">
          <Link to="/" className="font-semibold text-blue-600 hover:underline">User</Link>
          <Link to="/admin" className="font-semibold text-blue-600 hover:underline">Admin</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/" element={<UserPage />} />
      </Routes>
    </>
  );
};

export default App;

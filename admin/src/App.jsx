import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import Dashboard from './pages/Dashboard';
import BusList from './pages/BusList';
import RouteList from './pages/RouteList';
import AddNewBus from './pages/addnew.jsx';
import AdminRequestsPage from './pages/AdminRequestsPage.jsx';
import AdminRegister from './pages/AdminRegister.jsx';
import AdminLogin from './pages/AdminLogin.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/buses" element={<BusList />} />
        <Route path="/routes" element={<RouteList />} />
        <Route path="/addnew" element={<AddNewBus />} />
        <Route path="/request" element={<AdminRequestsPage/>}/>
        <Route path="/register" element={<AdminRegister/>}/>
        <Route path="/login" element={<AdminLogin/>}/>
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

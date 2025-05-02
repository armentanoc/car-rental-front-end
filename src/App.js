// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login, Register } from './components/Auth';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from "./context/ThemeContext"
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageVehicles from './pages/Admin/ManageVehicles';
import ManageImages from './pages/Admin/ManageImages';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ClientDashboard from './pages/Client/ClientDashboard';
import AvailableVehicles from './pages/Client/AvailableVehicles';
import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={<PrivateRoute element={<Dashboard />} allowedRoles={['CLIENT', 'ATTENDING', 'MANAGER', 'ADMIN']} />}
            />
            <Route
              path="/admin"
              element={<PrivateRoute element={<AdminDashboard />} allowedRoles={['ADMIN']} />}
            >
              <Route path="users" element={<ManageUsers />} />
              <Route path="vehicles" element={<ManageVehicles />} />
              <Route path="images" element={<ManageImages />} />
            </Route>
            <Route
              path="/client"
              element={<PrivateRoute element={<ClientDashboard />} allowedRoles={['CLIENT']} />}
            >
              <Route path="catalog" element={<AvailableVehicles />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

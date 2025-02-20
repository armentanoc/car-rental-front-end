// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login, Register } from './components/Auth';
import TeacherDashboard from './pages/TeacherDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { RequestSpace } from './components/SpaceManagement';
import { ApproveRequest, ApprovalHistory } from './components/Approval';
import { ManageSpaces, ManageUsers } from './components/Admin';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute'; 
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={<PrivateRoute element={<Dashboard />} allowedRoles={['PROFESSOR', 'GESTOR', 'ADMINISTRADOR']} />} 
          />
          <Route 
            path="/user-dashboard" 
            element={<PrivateRoute element={<TeacherDashboard />} allowedRoles={['PROFESSOR']} />} 
          />
          <Route 
            path="/manager-dashboard" 
            element={<PrivateRoute element={<ManagerDashboard />} allowedRoles={['GESTOR']} />} 
          />
          <Route 
            path="/admin-dashboard" 
            element={<PrivateRoute element={<AdminDashboard />} allowedRoles={['ADMINISTRADOR']} />} 
          />
          <Route 
            path="/request-space" 
            element={<PrivateRoute element={<RequestSpace />} allowedRoles={['PROFESSOR']} />} 
          />
          <Route 
            path="/approve-requests" 
            element={<PrivateRoute element={<ApproveRequest />} allowedRoles={['GESTOR', 'ADMINISTRADOR']} />} 
          />
          <Route 
            path="/approval-history" 
            element={<PrivateRoute element={<ApprovalHistory />} allowedRoles={['GESTOR', 'ADMINISTRADOR']} />} 
          />
          <Route 
            path="/manage-spaces" 
            element={<PrivateRoute element={<ManageSpaces />} allowedRoles={['ADMINISTRADOR']} />} 
          />
          <Route 
            path="/manage-users" 
            element={<PrivateRoute element={<ManageUsers />} allowedRoles={['ADMINISTRADOR']} />} 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

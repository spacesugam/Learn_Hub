import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/footer/Footer';
import About from './components/about/About';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Contact from './components/contact/Contact';
import Feedback from './components/feedback/Feedback';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';


function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container"> {/* Flex container for sticky footer */}
          <Header />
          <main className="main-content"> {/* Content takes available space */}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Main />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute  allowedRoles={['user', 'faculty', 'admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Dashboard /> {/* Dashboard component will render Admin specific UI */}
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/faculty" 
                element={
                  <ProtectedRoute allowedRoles={['faculty', 'admin']}> {/* Admin can also access faculty dash */}
                    <Dashboard /> {/* Dashboard component will render Faculty specific UI */}
                  </ProtectedRoute>
                } 
              />
               <Route 
                path="/feedback" 
                element={
                  <ProtectedRoute allowedRoles={['user', 'faculty', 'admin']}>
                    <Feedback />
                  </ProtectedRoute>
                } 
              />
              {/* Add more protected routes as needed */}
              
             {/* <Route path="*" element={<NotFound />} /> Catch-all for 404 */}
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
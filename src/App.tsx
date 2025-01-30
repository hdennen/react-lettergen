import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProductSelection } from './pages/ProductSelection';
import { LetterBuilder } from './pages/LetterBuilder';
import { Preview } from './pages/Preview';
import { NavBar } from './components/NavBar';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <NavBar />
          <Routes>
            <Route path="/" element={<ProductSelection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route
              path="/letter/:productId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LetterBuilder />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/preview" 
              element={
                <ProtectedRoute>
                  <Preview />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
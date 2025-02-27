import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProductSelection } from './pages/ProductSelection';
import { LetterBuilder } from './pages/LetterBuilder';
import { Preview } from './pages/Preview';
import { NavBar } from './components/NavBar';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProfileSetup } from './pages/ProfileSetup';
import { ProfileNotification } from './components/ProfileNotification';
import { config } from './config';

function App() {
  return (
    <Auth0Provider
      domain={config.auth0.domain}
      clientId={config.auth0.clientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      cacheLocation="localstorage"
    >
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <NavBar />
            <ProfileNotification />
            <Routes>
              <Route path="/" element={<ProductSelection />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile/setup" element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              } />
              
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
    </Auth0Provider>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProductSelection } from './pages/ProductSelection';
import { LetterBuilder } from './pages/LetterBuilder';
import { Preview } from './pages/Preview';
import { NavBar } from './components/NavBar';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <NavBar />
        <Routes>
          <Route path="/" element={<ProductSelection />} />
          <Route
            path="/letter/:productId"
            element={
              <Layout>
                <LetterBuilder />
              </Layout>
            }
          />
          <Route path="/preview" element={<Preview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
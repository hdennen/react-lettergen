import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProductSelection } from './pages/ProductSelection';
import { LetterBuilder } from './pages/LetterBuilder';
import { Preview } from './pages/Preview';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import TokenGenerator from './pages/TokenGenerator';
import HashText from './pages/HashText';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/token-generator" element={<TokenGenerator />} />
          <Route path="/hash-text" element={<HashText />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';

import { toolCategories } from './utils/constants/toolCategories';
import Home from './pages/Home';
import Admin from './pages/admin/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          {/* map over toolCategories to create routes */}
          {toolCategories.map((category) =>
            category.items.map((item) => (
              <Route
                key={item.path}
                path={item.path}
                element={<item.component />}
              />
            ))
          )}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';

import { toolCategories } from './utils/constants/toolCategories';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
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

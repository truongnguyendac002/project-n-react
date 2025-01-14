import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './pages/adminpanel';
import Home from './pages/home';
import NotFound from './pages/notfound';
import DailyQuest from './pages/quest';
import DailyReward from './pages/reward';
import Shop from './pages/shop';
import Dashboard from './pages/dashboard';


function App() {
  const user = { role: 'user' };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />}>
          <Route path="" element={<Dashboard />} />
          <Route path="daily-quest" element={<DailyQuest />} />
          <Route path="today-reward" element={<DailyReward />} />
          <Route path="shop" element={<Shop />} />
        </Route>
 
        <Route
          path="/admin"
          element={user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" />}
        />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

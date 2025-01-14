import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './pages/adminpanel';
import Home from './pages/home';
import NotFound from './pages/notfound';
import DailyQuest from './pages/quest';
import DailyReward from './pages/reward';
import Shop from './pages/shop';
import Dashboard from './pages/dashboard';
import { useAppDispatch, useAppSelector } from './redux/reduxHook';
import { useEffect } from 'react';
import { fetchUserInfo } from './services/authService';
import { removeUserProfile, setUserProfile } from './redux/slices/authSlice';
import { IUserProfile } from './models/user';

function App() {
  const user = useAppSelector<IUserProfile | null>((state) => state.auth.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('access-token');
      if (token) {
        try {
          const response = await fetchUserInfo();
          if (response.respCode === '000') {
            dispatch(setUserProfile(response.data));
          }
          else {
            console.log('Token failed:', response.respDesc);
            dispatch(removeUserProfile());
          }
        } catch (error) {
          console.error('Authentication failed:', error);
          dispatch(removeUserProfile());
        }
      }
    };

    validateToken();
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="" element={<Dashboard />} />
          <Route path="daily-quest" element={<DailyQuest />} />
          <Route path="today-reward" element={<DailyReward />} />
          <Route path="shop" element={<Shop />} />
        </Route>
        <Route
          path="/admin"
          element={user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;

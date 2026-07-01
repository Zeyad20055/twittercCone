// ============================================================
// APP ROUTES - جميع مسارات التطبيق
// ============================================================

import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guards
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';

// User Pages
import Profile from '../pages/user/Profile';
import EditProfile from '../pages/user/EditProfile';
import ChangePassword from '../pages/user/ChangePassword';

// Tweet Pages
import Home from '../pages/tweets/Home';
import CreateTweet from '../pages/tweets/CreateTweet';
import EditTweet from '../pages/tweets/EditTweet';
import TweetDetails from '../pages/tweets/TweetDetails';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import UsersManagement from '../pages/admin/UsersManagement';
import TweetsManagement from '../pages/admin/TweetsManagement';

// Error Pages
import NotFound from '../pages/errors/NotFound';
import Unauthorized from '../pages/errors/Unauthorized';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ===== AUTH ROUTES (لا تحتاج تسجيل دخول) ===== */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* ===== PROTECTED ROUTES (تحتاج تسجيل دخول) ===== */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          {/* Home Feed */}
          <Route path="/" element={<Home />} />

          {/* Tweet Routes — static segments before dynamic :id */}
          <Route path="/tweets/create" element={<CreateTweet />} />
          <Route path="/tweets/edit/:id" element={<EditTweet />} />
          <Route path="/tweets/:id" element={<TweetDetails />} />

          {/* User Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      {/* ===== ADMIN ROUTES (تحتاج صلاحية Admin) ===== */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/tweets" element={<TweetsManagement />} />
        </Route>
      </Route>

      {/* ===== ERROR ROUTES ===== */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;

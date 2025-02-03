import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Auth from '../pages/Auth';
import ProtectedRoute from '../components/routing/ProtectedRoute';
import GuestRoute from '../components/routing/GuestRoute';
// import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/', element: <Dashboard /> },
        ]
      },
      {
        element: <GuestRoute />,
        children: [
          { path: '/auth', element: <Auth /> },
        ]
      }
    ]
  }
]); 
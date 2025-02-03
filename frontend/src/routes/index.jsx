import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';
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
          { path: '/login', element: <Login /> },
          { path: '/register', element: <Register /> },
        ]
      }
    ]
  }
]); 
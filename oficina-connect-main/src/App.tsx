import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import GlobalLoading from '@/components/GlobalLoading';
import PrivateRoute from '@/components/PrivateRoute';
import AppLayout from '@/components/AppLayout';
import Login from '@/pages/Login';
import Oficinas from '@/pages/Oficinas';
import Calendario from '@/pages/Calendario';
import Usuarios from '@/pages/Usuarios';
import NotFound from '@/pages/NotFound';

const App = () => (
  <AuthProvider>
    <GlobalLoading />
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/oficinas" element={<Oficinas />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route element={<PrivateRoute allowedRoles={['ROOT']} />}>
              <Route path="/usuarios" element={<Usuarios />} />
            </Route>
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/oficinas" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;

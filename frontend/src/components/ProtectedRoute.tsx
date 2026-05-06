import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Si no hay token, lo mandamos de una al login
        return <Navigate to="/login" replace />;
    }

    // Si hay token, dejamos que pase a las rutas "hijas"
    return <Outlet />;
};

export default ProtectedRoute;
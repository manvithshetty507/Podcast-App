import React from 'react';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, Outlet } from 'react-router';
import Loader from '../common/Loader'

const PrivateRoute = () => {
    const [user, loading, error] = useAuthState(auth);
    
    if (loading) {
        return <Loader />;
    } else if (!user || error) {
        console.error('Authentication error:', error); 
        return <Navigate to="/" replace />;
    } else {
        return <Outlet />;
    }
};

export default PrivateRoute;


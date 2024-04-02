import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const PrivateRoute = ({ element, role, ...rest }) => {
  const { user } = useUser();

  if (!user || user.role !== role) {
    return <Navigate to='/login' />;
  }

  return <Route {...rest} element={element} />;
};

export default PrivateRoute;

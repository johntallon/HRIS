// src/components/ProtectedRoute.tsx

import React from 'react';
import { RouteProps } from 'wouter';
import { useIsAuthenticated } from "@azure/msal-react";
import { Redirect } from 'wouter';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const isAuthenticated = useIsAuthenticated();

  return isAuthenticated ? (
    <Component />
  ) : (
    <Redirect to="/login" />
  );
};

export default ProtectedRoute;

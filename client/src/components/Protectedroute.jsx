import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) =>
  localStorage.getItem('token') ? children : <Navigate to="/auth" />;

export default PrivateRoute;

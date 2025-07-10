import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ className = "", children = "Logout" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/auth');
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default LogoutButton; 
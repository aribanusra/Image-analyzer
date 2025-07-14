import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Profile = () => {
  const [user, setUser] = useState({ username: '', email: '', mobile: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/auth');
      return;
    }
    const parsed = JSON.parse(userData);
    setUser(parsed);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-400 to-red-500">
      <Header />
      <main className="flex-1 px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-lg bg-white/90 rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full mb-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-pink-600">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
              My Profile
            </h1>
            <p className="text-gray-600 text-base">
              View your account information
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <div className="w-full px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-xl">
                {user.email}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Username</label>
              <div className="w-full px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-xl">
                {user.username}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Mobile</label>
              <div className="w-full px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-xl">
                {user.mobile}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState({ username: '', email: '', mobile: '' });
  const [editData, setEditData] = useState({ username: '', mobile: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/auth');
      return;
    }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    setEditData({ username: parsed.username, mobile: parsed.mobile });
  }, [navigate]);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:2222/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: editData.username, mobile: editData.mobile })
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Profile updated');
        setUser({ ...user, username: editData.username, mobile: editData.mobile });
        localStorage.setItem('user', JSON.stringify({ ...user, username: editData.username, mobile: editData.mobile }));
      } else {
        toast.error(result.error || 'Update failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:2222/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ current: passwords.current, new: passwords.new })
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Password changed');
        setPasswords({ current: '', new: '' });
      } else {
        toast.error(result.error || 'Password change failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
              Profile Settings
            </h1>
            <p className="text-gray-600 text-base">
              Update your account information and password
            </p>
          </div>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={editData.username}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Mobile</label>
              <input
                type="text"
                name="mobile"
                value={editData.mobile}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors duration-200"
                required
              />
            </div>
            <div className="border-t border-gray-200 pt-6 mt-6">
              <label className="block text-gray-700 font-semibold mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="new"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters with numbers and symbols</p>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile & Password'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile; 
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState({ username: '', email: '', mobile: '' });
  const [editData, setEditData] = useState({ username: '', mobile: '' });
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
              Update your account information
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
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile; 
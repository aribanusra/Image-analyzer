import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Analyze = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [img, setImg] = useState(location.state?.img || null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!img && id) {
      setLoading(true);
      const token = localStorage.getItem('token');
      axios.get(`http://localhost:2222/api/upload/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          setImg({
            imageUrl: res.data.imageUrl,
            name: res.data.image_name,
            id: res.data.id,
            labels: res.data.labels
          });
        })
        .catch(() => setImg(null))
        .finally(() => setLoading(false));
    }
  }, [img, id]);

  const handleDelete = async () => {
    if (!img || !img.id) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this image? This action cannot be undone.');
    if (!confirmed) return;
    
    setDeleting(true);
    const token = localStorage.getItem('token');
    
    try {
      await axios.delete(`http://localhost:2222/api/upload/${img.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      alert('Image deleted successfully!');
      navigate('/home'); // Redirect to home page after deletion
    } catch (error) {
      console.error('Delete failed:', error.response?.data || error.message);
      alert('Failed to delete image: ' + (error.response?.data?.error || 'Something went wrong'));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-pink-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-pink-600 font-semibold text-lg">Loading...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!img) {
    return <div className="min-h-screen flex flex-col"><Header /><main className="flex-1 flex items-center justify-center">No image data.</main><Footer /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8">
        {/* Heading with back button, image name, and delete button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 bg-gradient-to-r from-pink-600 to-red-600 text-white px-4 py-1 rounded font-semibold hover:from-pink-700 hover:to-red-700 transition"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-gray-800">{img.name}</h2>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? 'Deleting...' : 'Delete Image'}
          </button>
        </div>
        {/* Two columns: image and analysis result */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image column */}
          <div className="bg-white rounded shadow flex items-center justify-center p-4">
            <img src={img.imageUrl || img.url} alt={img.name} className="object-contain max-h-96 w-full" />
          </div>
          {/* Analysis result column */}
          <div className="bg-white rounded shadow p-6 flex flex-col items-center justify-center min-h-[24rem]">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Analysis Result</h3>
            <div className="text-gray-500">{img.labels || '(Result will appear here)'}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analyze; 
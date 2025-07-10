import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRef, useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';

// Memoized image component for better performance
const ImageCard = memo(({ img, onAnalyze }) => (
  <div className="bg-white rounded shadow flex flex-col items-center justify-between h-44 overflow-hidden p-2">
    <img 
      src={img.imageUrl || img.image_path || img.url} 
      alt="uploaded" 
      className="object-cover w-full h-28 rounded"
      loading="lazy" // Lazy load images for better performance
    />
    <button
      className="mt-2 bg-gradient-to-r from-pink-600 to-red-600 text-white px-3 py-1 rounded text-sm font-semibold hover:from-pink-700 hover:to-red-700 transition"
      onClick={() => onAnalyze(img)}
    >
      Analyze Image
    </button>
  </div>
));

const Home = () => {
  const fileInputRef = useRef();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Memoized fetch function
  const fetchImages = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:2222/api/upload', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(response.data.images || []);
    } catch (error) {
      console.error('Failed to fetch images:', error.response?.data || error.message);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Memoized file change handler
  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:2222/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const uploadedImage = {
        image_name: response.data.filename,
        image_path: `/uploads/${response.data.filename}`,
        imageUrl: response.data.imageUrl,
        labels: response.data.labels,
      };
      setImages((prev) => [uploadedImage, ...prev]); // Add to beginning for better UX
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      setError('Upload failed: ' + (error.response?.data?.error || 'Something went wrong'));
    } finally {
      setUploading(false);
    }
  }, []);

  // Memoized analyze handler
  const handleAnalyze = useCallback((img) => {
    navigate(`/analyze/${encodeURIComponent(img.image_name)}`);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col items-center pt-8">
        <button
          className="bg-gradient-to-r from-pink-600 to-red-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-pink-700 hover:to-red-700 transition mb-4"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
        
        {error && (
          <div className="text-red-600 mb-4 p-2 bg-red-100 rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 w-full max-w-4xl min-h-[200px]">
          {(loading || uploading) ? (
            <div className="col-span-4 flex flex-col items-center justify-center py-12">
              <svg className="animate-spin h-10 w-10 text-pink-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span className="text-pink-600 font-semibold text-lg">
                {uploading ? 'Uploading...' : 'Loading images...'}
              </span>
            </div>
          ) : images.length === 0 ? (
            <div className="col-span-4 flex flex-col items-center justify-center py-12">
              <span className="text-gray-500 text-lg">No images uploaded yet</span>
            </div>
          ) : (
            images.map((img, index) => (
              <ImageCard key={img.id || index} img={img} onAnalyze={handleAnalyze} />
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

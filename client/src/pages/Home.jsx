import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRef, useState, useEffect, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import ImageCard from '@/components/Imagecard';



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
        id: response.data.imageId, // Use the real imageId from backend
        image_name: response.data.filename,
        image_path: `/uploads/${response.data.filename}`,
        imageUrl: response.data.imageUrl,
        labels: null,
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
  const handleAnalyze = useCallback(async (img) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in');
      return;
    }

    try {
      // Show loading state
      const button = event.target;
      button.textContent = 'Analyzing...';
      button.disabled = true;

      // Trigger analysis
      const response = await axios.post(`http://localhost:2222/api/analyze/${img.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the image in the list with new labels
      setImages(prev => prev.map(image => 
        image.id === img.id 
          ? { ...image, labels: response.data.labels }
          : image
      ));

      // Navigate to analyze page with the updated image data
      navigate(`/analyze/${encodeURIComponent(img.image_name)}`, {
        state: { 
          img: { 
            ...img, 
            labels: response.data.labels 
          } 
        }
      });
    } catch (error) {
      console.error('Analysis failed:', error.response?.data || error.message);
      alert('Failed to analyze image: ' + (error.response?.data?.error || 'Something went wrong'));
      
      // Reset button state
      const button = event.target;
      button.textContent = 'Analyze Image';
      button.disabled = false;
    }
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

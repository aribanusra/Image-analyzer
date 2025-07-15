import { memo } from "react"
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

export default ImageCard
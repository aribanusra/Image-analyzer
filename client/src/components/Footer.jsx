const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Project Info */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-800">Imagico</h3>
            <p className="text-gray-600 text-sm">
              Advanced Image Analysis Platform
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Imagico. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Built with React & Express.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
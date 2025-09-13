import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Or try one of these links:</p>
            <div className="mt-2 space-x-4">
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
              <Link to="/alumni" className="text-blue-600 hover:underline">
                Alumni Directory
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

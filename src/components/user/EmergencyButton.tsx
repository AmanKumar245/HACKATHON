import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import useUserStore from '../../store/userStore';
import useReportStore from '../../store/reportStore';

const EmergencyButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { user, isAuthenticated } = useUserStore();
  const { submitReport } = useReportStore();
  
  const handleEmergencyReport = async () => {
    if (!isAuthenticated || !user) {
      alert('Please sign in to report an emergency');
      return;
    }
    
    setIsSubmitting(true);
    
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        await submitReport({
          reporterId: user.id,
          reporterEmail: user.email,
          crimeType: 'emergency',
          description: 'Emergency button pressed - immediate assistance required',
          location: { lat: latitude, lng: longitude },
          address: 'Current location (GPS coordinates)',
          date: new Date(),
          images: [],
        });
        
        setIsSubmitting(false);
        setHasSubmitted(true);
        
        // Reset after 5 seconds
        setTimeout(() => {
          setHasSubmitted(false);
          setIsExpanded(false);
        }, 5000);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsSubmitting(false);
        alert('Unable to get your location. Please try again or report manually.');
      }
    );
  };
  
  return (
    <div className={`fixed bottom-6 right-6 z-30 transition-all duration-300 ease-in-out ${isExpanded ? 'scale-110' : ''}`}>
      {isExpanded && !hasSubmitted && (
        <div className="absolute bottom-full mb-4 right-0 bg-white p-4 rounded-lg shadow-lg w-64">
          <h3 className="font-bold text-gray-900 mb-2">Emergency Alert</h3>
          <p className="text-sm text-gray-600 mb-4">
            Press the button to send your current location to emergency services.
          </p>
          <button
            onClick={handleEmergencyReport}
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending Alert...' : 'Confirm Emergency'}
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className="w-full mt-2 py-2 px-4 bg-gray-100 text-gray-900 rounded-md font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      )}
      
      {hasSubmitted && (
        <div className="absolute bottom-full mb-4 right-0 bg-green-50 border border-green-200 p-4 rounded-lg shadow-lg w-64">
          <h3 className="font-bold text-green-800 mb-2">Alert Sent!</h3>
          <p className="text-sm text-green-700">
            Your emergency has been reported. Emergency services have been notified.
          </p>
        </div>
      )}
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`h-16 w-16 flex items-center justify-center rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
          hasSubmitted 
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        <AlertTriangle className="h-8 w-8 text-white" />
      </button>
    </div>
  );
};

export default EmergencyButton;
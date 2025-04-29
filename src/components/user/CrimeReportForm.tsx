import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Clock, Calendar, MapPin, Camera, FileText, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import MapComponent from '../common/MapComponent';
import { Coordinates, CrimeType } from '../../types';
import useUserStore from '../../store/userStore';
import useReportStore from '../../store/reportStore';

interface ReportFormData {
  crimeType: CrimeType;
  description: string;
  date: string;
  time: string;
  email: string;
}

const CrimeReportForm: React.FC = () => {
  const { user, isAuthenticated } = useUserStore();
  const { submitReport, isLoading } = useReportStore();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ReportFormData>({
    defaultValues: {
      crimeType: 'theft',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      email: user?.email || '',
    }
  });
  
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Mock image upload to simulate file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImage(true);
    setImageError(null);
    
    // Validation
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size must be less than 5MB');
      setUploadingImage(false);
      return;
    }
    
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setImageError('Only JPEG, PNG, and GIF images are allowed');
      setUploadingImage(false);
      return;
    }
    
    // Mock uploading delay
    setTimeout(() => {
      // Create a placeholder URL (in a real app, this would be an uploaded image URL)
      const placeholderUrls = [
        'https://images.pexels.com/photos/365067/pexels-photo-365067.jpeg',
        'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg',
        'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg'
      ];
      
      const randomIndex = Math.floor(Math.random() * placeholderUrls.length);
      setImages(prev => [...prev, placeholderUrls[randomIndex]]);
      setUploadingImage(false);
    }, 1500);
    
    // Reset input
    e.target.value = '';
  };
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleLocationSelect = (coords: Coordinates) => {
    setLocation(coords);
    // In a real app, we would do reverse geocoding here
    setAddress(`Latitude: ${coords.lat.toFixed(6)}, Longitude: ${coords.lng.toFixed(6)}`);
  };
  
  const onSubmit = async (data: ReportFormData) => {
    if (!location) {
      alert('Please select a location on the map');
      return;
    }
    
    // Combine date and time
    const dateTime = new Date(`${data.date}T${data.time}`);
    
    await submitReport({
      reporterId: user?.id || 'anonymous',
      reporterEmail: data.email,
      crimeType: data.crimeType,
      description: data.description,
      location,
      address,
      date: dateTime,
      images,
    });
    
    setSubmitted(true);
  };
  
  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-3 text-lg font-medium text-green-800">Report Submitted Successfully</h3>
        <p className="mt-2 text-sm text-green-700">
          Thank you for your report. Local authorities have been notified and will review your submission.
        </p>
        <div className="mt-6">
          <Button
            onClick={() => window.location.reload()}
            variant="success"
          >
            Submit Another Report
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Report a Crime or Emergency</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <MapPin className="h-5 w-5 mr-2 text-blue-900" />
            Location
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Click on the map to select the location of the incident.
          </p>
          
          <MapComponent
            height="400px"
            onLocationSelect={handleLocationSelect}
            selectable={true}
          />
          
          {location && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm font-medium text-gray-700">Selected Location:</p>
              <p className="text-sm text-gray-600">{address}</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                <AlertCircle className="h-5 w-5 mr-2 text-blue-900" />
                Incident Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="crimeType" className="block text-sm font-medium text-gray-700">
                    Type of Incident
                  </label>
                  <select
                    id="crimeType"
                    {...register('crimeType', { required: 'This field is required' })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="theft">Theft</option>
                    <option value="assault">Assault</option>
                    <option value="vandalism">Vandalism</option>
                    <option value="burglary">Burglary</option>
                    <option value="robbery">Robbery</option>
                    <option value="emergency">Emergency</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    {...register('description')}
                    placeholder="Please provide any details that might help authorities..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                <Calendar className="h-5 w-5 mr-2 text-blue-900" />
                <Clock className="h-5 w-5 mr-2 text-blue-900" />
                Date & Time
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    {...register('date', { required: 'Date is required' })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    {...register('time', { required: 'Time is required' })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                <FileText className="h-5 w-5 mr-2 text-blue-900" />
                Contact Information
              </h3>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                <Camera className="h-5 w-5 mr-2 text-blue-900" />
                Photo Evidence (Optional)
              </h3>
              
              <div className="space-y-4">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-900 hover:text-blue-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only"
                          onChange={handleImageUpload}
                          accept="image/*"
                          disabled={uploadingImage} 
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
                
                {imageError && (
                  <p className="text-sm text-red-600">{imageError}</p>
                )}
                
                {uploadingImage && (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading image...</span>
                  </div>
                )}
                
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={img} 
                          alt={`Evidence ${index + 1}`} 
                          className="h-24 w-full object-cover rounded-md" 
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={!location}
          >
            Submit Report
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CrimeReportForm;
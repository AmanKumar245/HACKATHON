import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import CrimeReportForm from '../components/user/CrimeReportForm';
import useUserStore from '../store/userStore';
import Button from '../components/common/Button';
import EmergencyButton from '../components/user/EmergencyButton';

const ReportPage: React.FC = () => {
  const { isAuthenticated } = useUserStore();
  const navigate = useNavigate();
  
  // If user is not authenticated, show a prompt to sign in
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-lg text-gray-600 mb-8">
              You need to sign in to report a crime or emergency. Creating an account helps us track your reports and keep you updated on progress.
            </p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/auth')}
            >
              Sign In or Register
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report a Crime or Emergency</h1>
          <p className="text-lg text-gray-600">
            Provide as much information as possible to help authorities respond effectively.
          </p>
        </div>
        
        <CrimeReportForm />
      </div>
      
      <EmergencyButton />
    </MainLayout>
  );
};

export default ReportPage;
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import CrimeReportDetail from '../../components/department/CrimeReportDetail';

const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CrimeReportDetail />
      </div>
    </MainLayout>
  );
};

export default ReportDetail;
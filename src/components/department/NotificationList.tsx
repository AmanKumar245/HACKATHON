import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { CrimeReport } from '../../types';
import { Link } from 'react-router-dom';
import useReportStore from '../../store/reportStore';

const NotificationList: React.FC = () => {
  const { reports } = useReportStore();
  const [showAll, setShowAll] = useState(false);
  
  // Filter for pending reports that need attention
  const pendingReports = reports.filter(report => report.status === 'pending');
  
  // Filter for in-progress reports
  const inProgressReports = reports.filter(report => report.status === 'in-progress');
  
  // Display all or just a limited number
  const displayReports = showAll ? pendingReports : pendingReports.slice(0, 3);
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-blue-900 px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-white">
          Incident Notifications
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {displayReports.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500">No pending reports at this time.</p>
          </div>
        ) : (
          displayReports.map((report) => (
            <NotificationItem key={report.id} report={report} />
          ))
        )}
      </div>
      
      {pendingReports.length > 3 && (
        <div className="px-4 py-4 bg-gray-50 text-right">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-blue-900 hover:text-blue-800"
          >
            {showAll ? 'Show Less' : `View ${pendingReports.length - 3} More`}
          </button>
        </div>
      )}
      
      {inProgressReports.length > 0 && (
        <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-2">In Progress</h4>
          <div className="space-y-1">
            {inProgressReports.slice(0, 3).map((report) => (
              <div key={report.id} className="flex items-center justify-between py-1">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  <span className="capitalize">{report.crimeType}</span>
                </div>
                <Link
                  to={`/department/report/${report.id}`}
                  className="text-xs text-blue-900 hover:text-blue-800 font-medium"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface NotificationItemProps {
  report: CrimeReport;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ report }) => {
  const [isNew, setIsNew] = useState(
    new Date().getTime() - new Date(report.createdAt).getTime() < 1000 * 60 * 60
  );
  
  useEffect(() => {
    // Remove "new" indicator after 5 seconds
    if (isNew) {
      const timer = setTimeout(() => setIsNew(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);
  
  return (
    <div className={`px-4 py-4 sm:px-6 transition-colors duration-300 ${
      isNew ? 'bg-blue-50' : 'hover:bg-gray-50'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {report.crimeType === 'emergency' ? (
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          ) : (
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          )}
          
          <div className="ml-4">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <span className="capitalize">{report.crimeType}</span>
              {isNew && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-900">
                  New
                </span>
              )}
            </h4>
            <div className="text-sm text-gray-500 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {report.address}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-xs text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {format(new Date(report.createdAt), 'MMM d, p')}
          </div>
          <Link
            to={`/department/report/${report.id}`}
            className="mt-1 text-sm font-medium text-blue-900 hover:text-blue-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
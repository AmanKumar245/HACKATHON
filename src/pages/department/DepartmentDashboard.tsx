import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import MapComponent from '../../components/common/MapComponent';
import NotificationList from '../../components/department/NotificationList';
import useReportStore from '../../store/reportStore';

const DepartmentDashboard: React.FC = () => {
  const { reports } = useReportStore();
  
  // Get counts for dashboard
  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const inProgressCount = reports.filter(r => r.status === 'in-progress').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;
  const emergencyCount = reports.filter(r => r.crimeType === 'emergency').length;
  
  return (
    <MainLayout>
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Department Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600">
              Monitor and manage crime reports and dispatch response teams.
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Pending Reports</p>
                  <h3 className="text-2xl font-semibold text-gray-900">{pendingCount}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-full p-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <h3 className="text-2xl font-semibold text-gray-900">{inProgressCount}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Resolved</p>
                  <h3 className="text-2xl font-semibold text-gray-900">{resolvedCount}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Emergencies</p>
                  <h3 className="text-2xl font-semibold text-gray-900">{emergencyCount}</h3>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Incident Map */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Incident Map</h2>
                </div>
                <div className="p-4">
                  <MapComponent reports={reports} height="500px" />
                </div>
              </div>
            </div>
            
            {/* Notifications */}
            <div className="lg:col-span-1">
              <NotificationList />
            </div>
          </div>
          
          {/* Recent Reports */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Reports</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reporter
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.slice(0, 5).map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                              report.crimeType === 'emergency' ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                              {report.crimeType === 'emergency' ? (
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                              ) : (
                                <MapPin className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 capitalize">
                                {report.crimeType}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(report.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            report.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : report.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.reporterEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/department/report/${report.id}`}
                            className="text-blue-900 hover:text-blue-800"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-right">
                <Link
                  to="/department/reports"
                  className="text-sm font-medium text-blue-900 hover:text-blue-800"
                >
                  View All Reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DepartmentDashboard;
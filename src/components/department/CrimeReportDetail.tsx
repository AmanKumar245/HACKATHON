import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, User, FileText, Camera, FileDown, Printer, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import MapComponent from '../common/MapComponent';
import useReportStore from '../../store/reportStore';
import { CrimeReport, ReportStatus } from '../../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const StatusBadge: React.FC<{ status: ReportStatus }> = ({ status }) => {
  const colors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'resolved': 'bg-green-100 text-green-800',
  };
  
  const icons = {
    'pending': <AlertTriangle className="h-4 w-4 mr-1" />,
    'in-progress': <Clock className="h-4 w-4 mr-1" />,
    'resolved': <CheckCircle className="h-4 w-4 mr-1" />,
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {icons[status]}
      <span className="capitalize">{status.replace('-', ' ')}</span>
    </span>
  );
};

const CrimeReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReportById, updateReportStatus, teams } = useReportStore();
  
  const report = getReportById(id || '');
  const [selectedTeam, setSelectedTeam] = useState(report?.assignedTeam || '');
  const [isUpdating, setIsUpdating] = useState(false);
  
  if (!report) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Report not found</h3>
        <div className="mt-4">
          <Button 
            onClick={() => navigate('/department')} 
            variant="primary"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  const handleStatusChange = (newStatus: ReportStatus) => {
    setIsUpdating(true);
    setTimeout(() => {
      updateReportStatus(report.id, newStatus, selectedTeam);
      setIsUpdating(false);
    }, 600);
  };
  
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Crime Report Details', 20, 20);
    
    // Add report ID and date
    doc.setFontSize(10);
    doc.text(`Report ID: ${report.id}`, 20, 30);
    doc.text(`Generated on: ${format(new Date(), 'PPp')}`, 20, 35);
    
    // Add status
    doc.setFontSize(12);
    doc.text(`Status: ${report.status.toUpperCase()}`, 20, 45);
    
    // Add crime details
    doc.autoTable({
      startY: 50,
      head: [['Crime Information']],
      body: [
        ['Type', report.crimeType],
        ['Date/Time', format(new Date(report.date), 'PPp')],
        ['Location', report.address],
        ['Coordinates', `Lat: ${report.location.lat}, Lng: ${report.location.lng}`],
        ['Description', report.description || 'N/A'],
      ],
      theme: 'grid',
    });
    
    // Add reporter information
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Reporter Information']],
      body: [
        ['Email', report.reporterEmail],
        ['Report Submitted', format(new Date(report.createdAt), 'PPp')],
      ],
      theme: 'grid',
    });
    
    // Add department information
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Department Information']],
      body: [
        ['Assigned Team', report.assignedTeam ? teams.find(t => t.id === report.assignedTeam)?.name || 'N/A' : 'Not assigned'],
        ['Last Updated', format(new Date(report.updatedAt), 'PPp')],
        ['Resolution Date', report.resolvedAt ? format(new Date(report.resolvedAt), 'PPp') : 'Not resolved'],
      ],
      theme: 'grid',
    });
    
    // Save PDF
    doc.save(`crime-report-${report.id}.pdf`);
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-blue-900 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-white">
            Crime Report Details
          </h3>
          <p className="mt-1 text-sm text-blue-100">
            {format(new Date(report.date), 'PPPP')}
          </p>
        </div>
        
        <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
          <StatusBadge status={report.status} />
          
          <Button
            variant="outline"
            size="sm"
            onClick={generatePDF}
            className="bg-white"
            icon={<FileDown className="h-4 w-4" />}
          >
            Download PDF
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="bg-white"
            icon={<Printer className="h-4 w-4" />}
          >
            Print
          </Button>
        </div>
      </div>
      
      <div className="border-b border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Incident Details</h4>
            
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-gray-400" />
                  Type
                </dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{report.crimeType}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(report.date), 'PP')}
                </dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  Time
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(report.date), 'p')}
                </dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <User className="h-4 w-4 mr-1 text-gray-400" />
                  Reported By
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{report.reporterEmail}</dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  Location
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{report.address}</dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-gray-400" />
                  Description
                </dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {report.description || 'No description provided.'}
                </dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Location</h4>
            <MapComponent
              height="300px"
              initialPosition={report.location}
              reports={[report]}
              zoom={15}
            />
          </div>
        </div>
      </div>
      
      {report.images.length > 0 && (
        <div className="border-b border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-gray-500" />
            Evidence Photos
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {report.images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Evidence ${index + 1}`}
                  className="h-40 w-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                  <a
                    href={img}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <svg className="h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Department Action</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-700">
              Assign Team
            </label>
            <select
              id="team"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              disabled={report.status === 'resolved'}
            >
              <option value="">-- Select Team --</option>
              {teams.filter(t => t.available).map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} ({team.members.join(', ')})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end gap-4">
            {report.status === 'pending' && (
              <Button
                variant="primary"
                isLoading={isUpdating}
                onClick={() => handleStatusChange('in-progress')}
                disabled={!selectedTeam}
              >
                Start Investigation
              </Button>
            )}
            
            {report.status === 'in-progress' && (
              <Button
                variant="success"
                isLoading={isUpdating}
                onClick={() => handleStatusChange('resolved')}
              >
                Mark as Resolved
              </Button>
            )}
            
            {report.status !== 'pending' && (
              <Button
                variant="outline"
                isLoading={isUpdating}
                onClick={() => handleStatusChange('pending')}
              >
                Reset Status
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Activity Timeline</h4>
          
          <div className="flow-root">
            <ul className="-mb-8">
              <li>
                <div className="relative pb-8">
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Report submitted by <span className="font-medium text-gray-900">{report.reporterEmail}</span>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {format(new Date(report.createdAt), 'PPp')}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              
              {report.status !== 'pending' && report.assignedTeam && (
                <li>
                  <div className="relative pb-8">
                    {report.status === 'resolved' && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white">
                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Investigation started by <span className="font-medium text-gray-900">
                              {teams.find(t => t.id === report.assignedTeam)?.name}
                            </span>
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {format(new Date(report.updatedAt), 'PPp')}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              )}
              
              {report.status === 'resolved' && report.resolvedAt && (
                <li>
                  <div className="relative">
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Case resolved
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {format(new Date(report.resolvedAt), 'PPp')}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrimeReportDetail;
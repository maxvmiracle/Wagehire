import React from 'react';
import { UserCheck } from 'lucide-react';

const CandidateDetail = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Candidate Details</h1>
        <p className="text-gray-600">View and manage candidate information</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="card-body">
          <div className="text-center py-12">
            <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Candidate Detail page</h3>
            <p className="mt-1 text-sm text-gray-500">
              This page will show detailed candidate information, interview history, and management options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail; 
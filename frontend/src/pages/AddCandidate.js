import React from 'react';
import { UserCheck, Plus } from 'lucide-react';

const AddCandidate = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <UserCheck className="w-6 h-6 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Candidate</h1>
          <p className="text-gray-600">Create a new candidate profile</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="card-body">
          <div className="text-center py-12">
            <Plus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Add Candidate page</h3>
            <p className="mt-1 text-sm text-gray-500">
              This page will contain a form to add new candidates with personal information, contact details, and resume upload.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCandidate; 
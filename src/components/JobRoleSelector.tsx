
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface JobRoleSelectorProps {
  selectedRole: string;
  onRoleSelect: (role: string) => void;
}

const jobRoles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'UI/UX Designer',
  'DevOps Engineer',
  'Product Manager',
  'Software Engineer',
  'Mobile Developer',
  'Machine Learning Engineer',
  'Quality Assurance Engineer'
];

export const JobRoleSelector: React.FC<JobRoleSelectorProps> = ({
  selectedRole,
  onRoleSelect
}) => {
  return (
    <div className="w-full">
      <Select onValueChange={onRoleSelect} value={selectedRole}>
        <SelectTrigger className="w-full h-12 text-left bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
          <SelectValue placeholder="Select your target job role" />
        </SelectTrigger>
        <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg">
          {jobRoles.map((role) => (
            <SelectItem 
              key={role} 
              value={role}
              className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
            >
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedRole && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Selected:</span> {selectedRole}
          </p>
        </div>
      )}
    </div>
  );
};

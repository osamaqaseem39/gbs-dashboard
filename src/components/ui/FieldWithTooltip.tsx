import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Tooltip from './Tooltip';

interface FieldWithTooltipProps {
  label: string;
  required?: boolean;
  tooltip?: string;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
  className?: string;
}

const FieldWithTooltip: React.FC<FieldWithTooltipProps> = ({
  label,
  required = false,
  tooltip,
  error,
  helpText,
  children,
  className = '',
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <span className="flex items-center gap-2">
          {label}
          {required && <span className="text-red-500">*</span>}
          {tooltip && (
            <Tooltip content={tooltip} position="right">
              <InformationCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          )}
        </span>
      </label>
      {children}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FieldWithTooltip;


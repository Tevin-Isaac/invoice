import React from 'react';
import { CurrencyDollarIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';

const Overview: React.FC = () => {
  const stats = [
    { name: 'Total Revenue', value: '$45,231', icon: CurrencyDollarIcon },
    { name: 'Pending Invoices', value: '12', icon: DocumentTextIcon },
    { name: 'Active Tasks', value: '8', icon: ClockIcon },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {item.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 bg-white shadow rounded-lg">
          <div className="p-6">
            <p className="text-gray-500">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

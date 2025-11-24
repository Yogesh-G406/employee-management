import React, { useState } from 'react';
import EmployeeTable from './EmployeeTable';

const EmployeeList = ({ searchQuery }) => {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
                <p className="text-gray-600 mt-1">Manage your organization's workforce</p>
            </div>

            {/* Employee Table */}
            <EmployeeTable searchQuery={searchQuery} />
        </div>
    );
};

export default EmployeeList;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, BarChart3, Building2 } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Employees', path: '/employees' },
        { icon: Building2, label: 'Departments', path: '/departments' },
        { icon: BarChart3, label: 'Reports', path: '/reports' },
        { icon: FileText, label: 'Documents', path: '/documents' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="sidebar">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                        <Building2 className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">ERP System</h1>
                        <p className="text-xs text-gray-400">Employee Management</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="py-6">
                {menuItems.map((item) => (
                    <div
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;

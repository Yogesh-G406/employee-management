import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Building2, UserPlus, BarChart3 } from 'lucide-react';
import { listEmployees } from '../services/EmployeeService';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        departments: 0,
        newThisMonth: 0,
        activeProjects: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await listEmployees();
            const employees = response.data;
            const uniqueDepartments = [...new Set(employees.map(e => e.department).filter(d => d))];

            setStats({
                totalEmployees: employees.length,
                departments: uniqueDepartments.length,
                newThisMonth: employees.length, // Simplified
                activeProjects: 12 // Mock data
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const statCards = [
        {
            title: 'Total Employees',
            value: stats.totalEmployees,
            icon: Users,
            color: 'from-indigo-500 to-purple-600',
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Departments',
            value: stats.departments,
            icon: Building2,
            color: 'from-emerald-500 to-teal-600',
            change: '+3',
            changeType: 'positive'
        },
        {
            title: 'New This Month',
            value: stats.newThisMonth,
            icon: TrendingUp,
            color: 'from-amber-500 to-orange-600',
            change: '+8%',
            changeType: 'positive'
        },
        {
            title: 'Active Projects',
            value: stats.activeProjects,
            icon: BarChart3,
            color: 'from-blue-500 to-cyan-600',
            change: '2 pending',
            changeType: 'neutral'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                                <stat.icon className="text-white" size={24} />
                            </div>
                            <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-emerald-600' : 'text-gray-600'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/employees')}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-lg transition-all border border-indigo-200"
                    >
                        <Users className="text-indigo-600" size={24} />
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">View Employees</p>
                            <p className="text-sm text-gray-600">Manage employee records</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/add-employee')}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-lg transition-all border border-emerald-200"
                    >
                        <UserPlus className="text-emerald-600" size={24} />
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">Add Employee</p>
                            <p className="text-sm text-gray-600">Register new employee</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/reports')}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 rounded-lg transition-all border border-amber-200"
                    >
                        <BarChart3 className="text-amber-600" size={24} />
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">View Reports</p>
                            <p className="text-sm text-gray-600">Analytics & insights</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <UserPlus className="text-indigo-600" size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">New employee added</p>
                            <p className="text-xs text-gray-500">John Doe joined the IT department</p>
                        </div>
                        <span className="text-xs text-gray-400">2 hours ago</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Users className="text-emerald-600" size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Department updated</p>
                            <p className="text-xs text-gray-500">Engineering team expanded</p>
                        </div>
                        <span className="text-xs text-gray-400">5 hours ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

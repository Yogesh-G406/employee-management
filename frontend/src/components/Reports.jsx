import React, { useEffect, useState } from 'react';
import { BarChart3, Download, TrendingUp, Users, Building2, Briefcase, FileText } from 'lucide-react';
import { listEmployees } from '../services/EmployeeService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
    const [employees, setEmployees] = useState([]);
    const [analytics, setAnalytics] = useState({
        totalEmployees: 0,
        departments: 0,
        positions: 0,
        avgPerDept: 0
    });

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const response = await listEmployees();
            const emps = response.data;
            setEmployees(emps);

            const uniqueDepts = [...new Set(emps.map(e => e.department).filter(d => d))];
            const uniquePos = [...new Set(emps.map(e => e.position).filter(p => p))];

            setAnalytics({
                totalEmployees: emps.length,
                departments: uniqueDepts.length,
                positions: uniquePos.length,
                avgPerDept: uniqueDepts.length > 0 ? Math.round(emps.length / uniqueDepts.length) : 0
            });
        } catch (error) {
            console.error('Error loading reports:', error);
        }
    };

    // Department distribution data
    const deptData = () => {
        const deptMap = {};
        employees.forEach(emp => {
            const dept = emp.department || 'Unassigned';
            deptMap[dept] = (deptMap[dept] || 0) + 1;
        });
        return Object.entries(deptMap).map(([name, count]) => ({ name, count }));
    };

    // Position distribution data
    const positionData = () => {
        const posMap = {};
        employees.forEach(emp => {
            const pos = emp.position || 'Unassigned';
            posMap[pos] = (posMap[pos] || 0) + 1;
        });
        return Object.entries(posMap).map(([name, count]) => ({ name, count }));
    };

    // Mock growth data
    const growthData = [
        { month: 'Jan', employees: Math.max(1, employees.length - 5) },
        { month: 'Feb', employees: Math.max(1, employees.length - 4) },
        { month: 'Mar', employees: Math.max(1, employees.length - 3) },
        { month: 'Apr', employees: Math.max(1, employees.length - 2) },
        { month: 'May', employees: Math.max(1, employees.length - 1) },
        { month: 'Jun', employees: employees.length },
    ];

    const exportCSV = (type) => {
        const data = type === 'Department' ? deptData() : positionData();
        const headers = [type, 'Employee Count', 'Percentage'];
        const rows = data.map(d => [
            d.name,
            d.count,
            `${((d.count / analytics.totalEmployees) * 100).toFixed(1)}%`
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success(`${type} CSV report exported`);
    };

    const exportPDF = () => {
        const doc = new jsPDF();

        // Title Page
        doc.setFontSize(24);
        doc.setTextColor(79, 70, 229);
        doc.text('Employee Report', 105, 40, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 50, { align: 'center' });
        doc.text(`Total Employees: ${employees.length}`, 105, 58, { align: 'center' });

        // Complete Employee List with All Details
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text('Employee Directory', 14, 75);

        const empTableData = employees.map(emp => [
            `#${emp.id}`,
            `${emp.firstName} ${emp.lastName}`,
            emp.email,
            emp.position || 'N/A',
            emp.department || 'N/A'
        ]);

        doc.autoTable({
            startY: 82,
            head: [['ID', 'Name', 'Email', 'Position', 'Department']],
            body: empTableData,
            theme: 'grid',
            headStyles: {
                fillColor: [79, 70, 229],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 9
            },
            styles: {
                fontSize: 8,
                cellPadding: 3
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250]
            },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 40 },
                2: { cellWidth: 50 },
                3: { cellWidth: 35 },
                4: { cellWidth: 35 }
            }
        });

        // Add page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Page ${i} of ${pageCount} | Generated: ${new Date().toLocaleDateString()}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        doc.save(`employee-report-${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success('PDF report with all employee details generated');
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-600 mt-1">Comprehensive insights into your workforce</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => exportCSV('Department')} className="btn btn-secondary">
                        <Download size={18} />
                        Export CSV
                    </button>
                    <button onClick={exportPDF} className="btn btn-primary">
                        <FileText size={18} />
                        Generate PDF Report
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="stat-card">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg mb-4">
                        <Users className="text-white" size={24} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Total Employees</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.totalEmployees}</p>
                    <p className="text-sm text-emerald-600 mt-2">↑ 12% from last month</p>
                </div>

                <div className="stat-card">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg mb-4">
                        <Building2 className="text-white" size={24} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Departments</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.departments}</p>
                    <p className="text-sm text-gray-500 mt-2">Active departments</p>
                </div>

                <div className="stat-card">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg mb-4">
                        <Briefcase className="text-white" size={24} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Positions</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.positions}</p>
                    <p className="text-sm text-gray-500 mt-2">Unique roles</p>
                </div>

                <div className="stat-card">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg mb-4">
                        <TrendingUp className="text-white" size={24} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Avg per Dept</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.avgPerDept}</p>
                    <p className="text-sm text-gray-500 mt-2">Employees per department</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Trend */}
                <div className="card p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Employee Growth Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={growthData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="employees" stroke="#4F46E5" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Department Distribution */}
                <div className="card p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Employees by Department</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={deptData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#10B981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Position Distribution */}
            <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Employees by Position</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={positionData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#F59E0B" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Summary Table */}
            <div className="card">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Department Summary</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Employee Count</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Percentage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {deptData().map((dept, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{dept.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{dept.count}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {((dept.count / analytics.totalEmployees) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;

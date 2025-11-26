import React, { useEffect, useState } from 'react';
import { Building2, Users, TrendingUp, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { listEmployees } from '../services/EmployeeService';
import { listDepartments, createDepartment, updateDepartment, deleteDepartment } from '../services/DepartmentService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog';

const Departments = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        manager: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [empsRes, deptsRes] = await Promise.all([
                listEmployees(),
                listDepartments()
            ]);
            setEmployees(empsRes.data);
            setDepartments(deptsRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load data');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDept) {
                await updateDepartment(editingDept.id, formData);
                toast.success('Department updated successfully');
            } else {
                await createDepartment(formData);
                toast.success('Department created successfully');
            }
            setShowModal(false);
            setEditingDept(null);
            setFormData({ name: '', description: '', manager: '' });
            loadData();
        } catch (error) {
            toast.error(error.response?.data || 'Failed to save department');
        }
    };

    const handleEdit = (dept) => {
        setEditingDept(dept);
        setFormData({
            name: dept.name,
            description: dept.description || '',
            manager: dept.manager || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDepartment(id);
            toast.success('Department deleted successfully');
            setShowDeleteConfirm(false);
            setDeleteTarget(null);
            loadData();
        } catch (error) {
            toast.error('Failed to delete department');
        }
    };

    // Calculate department statistics
    const deptStats = departments.map(dept => {
        const empCount = employees.filter(e => e.departmentName === dept.name).length;
        return { ...dept, employeeCount: dept.employeeCount || empCount };
    });

    const totalEmployees = employees.length;
    const totalDepartments = departments.length;

    const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

    const chartData = deptStats.map(dept => ({
        name: dept.name,
        employees: dept.employeeCount
    }));

    const pieData = deptStats.filter(d => d.employeeCount > 0).map(dept => ({
        name: dept.name,
        value: dept.employeeCount
    }));

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
                    <p className="text-gray-600 mt-1">Manage organizational departments and teams</p>
                </div>
                <button onClick={() => { setEditingDept(null); setFormData({ name: '', description: '', manager: '' }); setShowModal(true); }} className="btn btn-primary">
                    <Plus size={18} />
                    Add Department
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="stat-card">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Building2 className="text-white" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Total Departments</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalDepartments}</p>
                </div>

                <div className="stat-card">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Users className="text-white" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Total Employees</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalEmployees}</p>
                </div>

                <div className="stat-card">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Avg per Department</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        {totalDepartments > 0 ? Math.round(totalEmployees / totalDepartments) : 0}
                    </p>
                </div>
            </div>

            {/* Charts */}
            {chartData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart */}
                    <div className="card p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Employee Distribution</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="employees" fill="#4F46E5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart */}
                    {pieData.length > 0 && (
                        <div className="card p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Department Breakdown</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}

            {/* Department List */}
            <div className="card">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">All Departments</h2>
                </div>
                {deptStats.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {deptStats.map((dept, index) => {
                            const deptEmployees = employees.filter(e => e.departmentName === dept.name);
                            return (
                                <div key={dept.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg"
                                                style={{ background: `linear-gradient(to bottom right, ${COLORS[index % COLORS.length]}, ${COLORS[(index + 1) % COLORS.length]})` }}
                                            >
                                                {dept.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                                                <p className="text-sm text-gray-600">{dept.employeeCount} employees</p>
                                                {dept.manager && <p className="text-sm text-gray-500">Manager: {dept.manager}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(dept)} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => { setDeleteTarget(dept.id); setShowDeleteConfirm(true); }} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Employee List */}
                                    {deptEmployees.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {deptEmployees.slice(0, 5).map(emp => (
                                                <span key={emp.id} className="badge badge-primary">
                                                    {emp.firstName} {emp.lastName}
                                                </span>
                                            ))}
                                            {deptEmployees.length > 5 && (
                                                <span className="badge badge-secondary">
                                                    +{deptEmployees.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No departments yet</h3>
                        <p className="text-gray-600 mb-4">Get started by creating your first department</p>
                        <button onClick={() => setShowModal(true)} className="btn btn-primary">
                            <Plus size={18} />
                            Add Department
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingDept ? 'Edit Department' : 'Add New Department'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Department Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        required
                                        placeholder="e.g., Engineering, Sales, HR"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="input-field"
                                        rows="3"
                                        placeholder="Brief description of the department"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Manager
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.manager}
                                        onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                                        className="input-field"
                                        placeholder="Department manager name"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <Save size={18} />
                                    {editingDept ? 'Update' : 'Create'} Department
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <ConfirmDialog
                    title="Delete Department"
                    message="Are you sure you want to delete this department? This action cannot be undone."
                    onConfirm={() => handleDelete(deleteTarget)}
                    onCancel={() => { setShowDeleteConfirm(false); setDeleteTarget(null); }}
                />
            )}
        </div>
    );
};

export default Departments;

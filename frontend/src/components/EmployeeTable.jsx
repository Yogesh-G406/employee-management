import React, { useEffect, useState } from 'react';
import { listEmployees, deleteEmployee } from '../services/EmployeeService';
import { Edit2, Trash2, Download, Filter, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import EmployeeModal from './EmployeeModal';
import ConfirmDialog from './ConfirmDialog';

const EmployeeTable = ({ searchQuery }) => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [positionFilter, setPositionFilter] = useState('');

    useEffect(() => {
        loadEmployees();
    }, []);

    useEffect(() => {
        filterAndSortEmployees();
    }, [employees, searchQuery, departmentFilter, positionFilter, sortConfig]);

    const loadEmployees = async () => {
        try {
            const response = await listEmployees();
            setEmployees(response.data);
        } catch (error) {
            toast.error('Failed to load employees');
            console.error(error);
        }
    };

    const filterAndSortEmployees = () => {
        let filtered = [...employees];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(emp =>
                emp.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (emp.department?.name || emp.department || '')?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Department filter
        if (departmentFilter) {
            filtered = filtered.filter(emp => (emp.department?.name || emp.department) === departmentFilter);
        }

        // Position filter
        if (positionFilter) {
            filtered = filtered.filter(emp => emp.position === positionFilter);
        }

        // Sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aVal = a[sortConfig.key] || '';
                const bVal = b[sortConfig.key] || '';
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setFilteredEmployees(filtered);
        setCurrentPage(1);
    };

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteEmployee(id);
            toast.success('Employee deleted successfully');
            loadEmployees();
            setShowDeleteConfirm(false);
            setDeleteTarget(null);
        } catch (error) {
            toast.error('Failed to delete employee');
            console.error(error);
        }
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectedEmployees.map(id => deleteEmployee(id)));
            toast.success(`${selectedEmployees.length} employees deleted`);
            setSelectedEmployees([]);
            loadEmployees();
        } catch (error) {
            toast.error('Failed to delete employees');
        }
    };

    const exportToCSV = () => {
        const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Position', 'Department'];
        const data = filteredEmployees.map(emp => [
            emp.id, emp.firstName, emp.lastName, emp.email, emp.position, emp.department?.name || emp.department || ''
        ]);

        const csv = [headers, ...data].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employees.csv';
        a.click();
        toast.success('Exported to CSV');
    };

    const toggleSelectAll = () => {
        if (selectedEmployees.length === paginatedEmployees.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(paginatedEmployees.map(emp => emp.id));
        }
    };

    const toggleSelect = (id) => {
        setSelectedEmployees(prev =>
            prev.includes(id) ? prev.filter(empId => empId !== id) : [...prev, id]
        );
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    const uniqueDepartments = [...new Set(employees.map(e => e.department?.name || e.department).filter(d => d))];
    const uniquePositions = [...new Set(employees.map(e => e.position).filter(p => p))];

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return null;
        return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => { setEditingEmployee(null); setShowModal(true); }} className="btn btn-primary">
                        <Plus size={18} />
                        Add Employee
                    </button>
                    {selectedEmployees.length > 0 && (
                        <button onClick={handleBulkDelete} className="btn btn-danger">
                            <Trash2 size={18} />
                            Delete ({selectedEmployees.length})
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="input-field w-40"
                    >
                        <option value="">All Departments</option>
                        {uniqueDepartments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>

                    <select
                        value={positionFilter}
                        onChange={(e) => setPositionFilter(e.target.value)}
                        className="input-field w-40"
                    >
                        <option value="">All Positions</option>
                        {uniquePositions.map(pos => (
                            <option key={pos} value={pos}>{pos}</option>
                        ))}
                    </select>

                    <button onClick={exportToCSV} className="btn btn-secondary">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="data-table">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="w-12">
                                <input
                                    type="checkbox"
                                    checked={selectedEmployees.length === paginatedEmployees.length && paginatedEmployees.length > 0}
                                    onChange={toggleSelectAll}
                                    className="rounded"
                                />
                            </th>
                            <th onClick={() => handleSort('id')} className="cursor-pointer">
                                <div className="flex items-center gap-1">ID <SortIcon column="id" /></div>
                            </th>
                            <th onClick={() => handleSort('firstName')} className="cursor-pointer">
                                <div className="flex items-center gap-1">Name <SortIcon column="firstName" /></div>
                            </th>
                            <th onClick={() => handleSort('email')} className="cursor-pointer">
                                <div className="flex items-center gap-1">Email <SortIcon column="email" /></div>
                            </th>
                            <th onClick={() => handleSort('position')} className="cursor-pointer">
                                <div className="flex items-center gap-1">Position <SortIcon column="position" /></div>
                            </th>
                            <th onClick={() => handleSort('department')} className="cursor-pointer">
                                <div className="flex items-center gap-1">Department <SortIcon column="department" /></div>
                            </th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {paginatedEmployees.map((employee) => (
                                <motion.tr
                                    key={employee.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={selectedEmployees.includes(employee.id) ? 'selected' : ''}
                                >
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedEmployees.includes(employee.id)}
                                            onChange={() => toggleSelect(employee.id)}
                                            className="rounded"
                                        />
                                    </td>
                                    <td className="font-medium">#{employee.id}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                {employee.firstName?.charAt(0)}
                                            </div>
                                            <span className="font-medium">{employee.firstName} {employee.lastName}</span>
                                        </div>
                                    </td>
                                    <td className="text-gray-600">{employee.email}</td>
                                    <td>
                                        <span className="badge badge-primary">{employee.position}</span>
                                    </td>
                                    <td>
                                        <span className="badge badge-success">{employee.department?.name || employee.department || 'N/A'}</span>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => { setEditingEmployee(employee); setShowModal(true); }}
                                                className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => { setDeleteTarget(employee.id); setShowDeleteConfirm(true); }}
                                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEmployees.length)} of {filteredEmployees.length} employees
                    </p>
                    <div className="pagination">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="pagination-btn"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="pagination-btn"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <EmployeeModal
                    employee={editingEmployee}
                    onClose={() => { setShowModal(false); setEditingEmployee(null); }}
                    onSuccess={() => { loadEmployees(); setShowModal(false); setEditingEmployee(null); }}
                />
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <ConfirmDialog
                    title="Delete Employee"
                    message="Are you sure you want to delete this employee? This action cannot be undone."
                    onConfirm={() => handleDelete(deleteTarget)}
                    onCancel={() => { setShowDeleteConfirm(false); setDeleteTarget(null); }}
                />
            )}
        </div>
    );
};

export default EmployeeTable;

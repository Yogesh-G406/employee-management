import React, { useState, useEffect } from 'react';
import { FileText, Download, Search, Filter } from 'lucide-react';
import { listEmployees } from '../services/EmployeeService';
import toast from 'react-hot-toast';

const Documents = () => {
    const [employees, setEmployees] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await listEmployees();
            const emps = response.data;
            setEmployees(emps);

            // Generate documents dynamically based on employee data
            const generatedDocs = [];

            // Employee roster by department
            const departments = [...new Set(emps.map(e => e.department).filter(d => d))];
            departments.forEach((dept, index) => {
                generatedDocs.push({
                    id: `dept-${index}`,
                    name: `${dept} - Employee Roster.pdf`,
                    category: 'HR',
                    size: '245 KB',
                    uploadedBy: 'System',
                    uploadedDate: new Date().toISOString().split('T')[0],
                    downloads: Math.floor(Math.random() * 50) + 10,
                    employees: emps.filter(e => e.department === dept).length
                });
            });

            // Position-based documents
            const positions = [...new Set(emps.map(e => e.position).filter(p => p))];
            positions.forEach((pos, index) => {
                generatedDocs.push({
                    id: `pos-${index}`,
                    name: `${pos} - Job Description.docx`,
                    category: 'HR',
                    size: '128 KB',
                    uploadedBy: 'HR Manager',
                    uploadedDate: new Date().toISOString().split('T')[0],
                    downloads: Math.floor(Math.random() * 30) + 5,
                    employees: emps.filter(e => e.position === pos).length
                });
            });

            // Company-wide documents
            if (emps.length > 0) {
                generatedDocs.push({
                    id: 'company-handbook',
                    name: 'Employee Handbook 2025.pdf',
                    category: 'Policy',
                    size: '2.4 MB',
                    uploadedBy: 'Admin',
                    uploadedDate: '2025-01-15',
                    downloads: emps.length * 2
                });

                generatedDocs.push({
                    id: 'org-chart',
                    name: 'Organization Chart.pdf',
                    category: 'General',
                    size: '890 KB',
                    uploadedBy: 'Admin',
                    uploadedDate: new Date().toISOString().split('T')[0],
                    downloads: Math.floor(emps.length * 1.5)
                });
            }

            setDocuments(generatedDocs);
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load documents');
        }
    };

    const categories = ['All', 'Policy', 'HR', 'General'];

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !categoryFilter || categoryFilter === 'All' || doc.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleDownload = (doc) => {
        toast.success(`Downloading ${doc.name}`);
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Policy': 'bg-indigo-100 text-indigo-800',
            'HR': 'bg-emerald-100 text-emerald-800',
            'General': 'bg-gray-100 text-gray-800'
        };
        return colors[category] || colors['General'];
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
                    <p className="text-gray-600 mt-1">Company documents and employee rosters</p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="stat-card">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg mb-4">
                        <FileText className="text-white" size={24} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Total Documents</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{documents.length}</p>
                </div>

                <div className="stat-card">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg mb-4">
                        <Download className="text-white" size={24} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Total Downloads</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        {documents.reduce((sum, doc) => sum + doc.downloads, 0)}
                    </p>
                </div>

                <div className="stat-card">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg mb-4">
                        <Filter className="text-white" size={24} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Categories</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{categories.length - 1}</p>
                </div>

                <div className="stat-card">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg mb-4">
                        <FileText className="text-white" size={24} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium">Employees</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{employees.length}</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="card p-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[300px]">
                        <div className="search-bar">
                            <Search size={20} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat === 'All' ? '' : cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${(categoryFilter === cat || (cat === 'All' && !categoryFilter))
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Documents Grid */}
            {filteredDocuments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocuments.map(doc => (
                        <div key={doc.id} className="card p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <FileText className="text-white" size={24} />
                                </div>
                                <span className={`badge ${getCategoryColor(doc.category)}`}>
                                    {doc.category}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={doc.name}>
                                {doc.name}
                            </h3>

                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <p>Size: {doc.size}</p>
                                <p>Uploaded by: {doc.uploadedBy}</p>
                                <p>Date: {doc.uploadedDate}</p>
                                <p>Downloads: {doc.downloads}</p>
                            </div>

                            <button
                                onClick={() => handleDownload(doc)}
                                className="w-full btn btn-primary btn-sm"
                            >
                                <Download size={16} />
                                Download
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card p-12 text-center">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No documents found</h3>
                    <p className="text-gray-600">
                        {employees.length === 0
                            ? 'Add employees to generate documents automatically'
                            : 'Try adjusting your search or filter criteria'
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default Documents;

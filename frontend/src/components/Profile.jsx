import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Building2, Edit2, Save, X } from 'lucide-react';
import { updateEmployee } from '../services/EmployeeService';
import toast from 'react-hot-toast';

const Profile = ({ currentUser, onUpdateUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        department: ''
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                email: currentUser.email || '',
                position: currentUser.position || '',
                department: currentUser.department || ''
            });
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateEmployee(currentUser.id, formData);
            const updatedUser = { ...currentUser, ...formData };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            onUpdateUser(updatedUser);
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
            console.error(error);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: currentUser.firstName || '',
            lastName: currentUser.lastName || '',
            email: currentUser.email || '',
            position: currentUser.position || '',
            department: currentUser.department || ''
        });
        setIsEditing(false);
    };

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-600">No user logged in</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-1">View and manage your personal information</p>
                </div>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                        <Edit2 size={18} />
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Profile Card */}
            <div className="card">
                <div className="p-8">
                    {/* Avatar and Name */}
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                            {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                {currentUser.firstName} {currentUser.lastName}
                            </h2>
                            <p className="text-lg text-gray-600 mt-1">{currentUser.position || 'Employee'}</p>
                            <span className="inline-block mt-2 badge badge-success">
                                {currentUser.department || 'No Department'}
                            </span>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <User size={16} />
                                    First Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                ) : (
                                    <p className="text-lg text-gray-900 py-2">{currentUser.firstName}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <User size={16} />
                                    Last Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="input-field"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-900 py-2">{currentUser.lastName}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Mail size={16} />
                                    Email Address
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                ) : (
                                    <p className="text-lg text-gray-900 py-2">{currentUser.email}</p>
                                )}
                            </div>

                            {/* Position */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Briefcase size={16} />
                                    Position
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        className="input-field"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-900 py-2">{currentUser.position || 'Not specified'}</p>
                                )}
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Building2 size={16} />
                                    Department
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="input-field"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-900 py-2">{currentUser.department || 'Not specified'}</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                                    <X size={18} />
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600">Employee ID</p>
                            <p className="text-lg font-medium text-gray-900">#{currentUser.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Account Status</p>
                            <span className="badge badge-success">Active</span>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                            View My Documents
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                            View My Department
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

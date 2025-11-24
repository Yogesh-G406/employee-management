import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { listEmployees } from '../services/EmployeeService';
import toast from 'react-hot-toast';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Please enter your email');
            return;
        }

        setLoading(true);
        try {
            const response = await listEmployees();
            const employee = response.data.find(emp => emp.email.toLowerCase() === email.toLowerCase());

            if (employee) {
                localStorage.setItem('currentUser', JSON.stringify(employee));
                onLogin(employee);
                toast.success(`Welcome back, ${employee.firstName}!`);
                navigate('/dashboard');
            } else {
                toast.error('Employee not found. Please check your email.');
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-xl mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Employee Portal</h1>
                    <p className="text-indigo-100">Sign in to access your dashboard</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-10"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Info Message */}
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                            <p className="text-sm text-indigo-800">
                                <strong>Note:</strong> Enter your registered employee email to login.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary py-3 text-lg"
                        >
                            <LogIn size={20} />
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account? Contact HR to register.
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-indigo-100">
                        © 2025 Employee Management System. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

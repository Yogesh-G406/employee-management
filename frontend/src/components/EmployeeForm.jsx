import React, { useState, useEffect } from 'react';
import { createEmployee, getEmployee, updateEmployee } from '../services/EmployeeService';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, User, Briefcase, Mail, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const EmployeeForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [position, setPosition] = useState('');
    const [department, setDepartment] = useState('');

    const { id } = useParams();
    const navigator = useNavigate();

    useEffect(() => {
        if (id) {
            getEmployee(id).then((response) => {
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setEmail(response.data.email);
                setPosition(response.data.position);
                setDepartment(response.data.department);
            }).catch(error => {
                console.error(error);
            })
        }
    }, [id]);

    const saveOrUpdateEmployee = (e) => {
        e.preventDefault();

        const employee = { firstName, lastName, email, position, department };

        if (id) {
            updateEmployee(id, employee).then((response) => {
                console.log(response.data);
                navigator('/employees');
            }).catch(error => {
                console.error(error);
            })
        } else {
            createEmployee(employee).then((response) => {
                console.log(response.data);
                navigator('/employees');
            }).catch(error => {
                console.error(error);
            })
        }
    }

    const pageTitle = () => {
        if (id) {
            return <h2 className="text-3xl font-bold text-gray-800 mb-6">Update Employee</h2>
        } else {
            return <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Employee</h2>
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <button
                onClick={() => navigator('/employees')}
                className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Back to List
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="card p-8"
            >
                {pageTitle()}
                <form onSubmit={saveOrUpdateEmployee} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <User size={16} /> First Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter First Name"
                                name="firstName"
                                value={firstName}
                                className="input-field"
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <User size={16} /> Last Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Last Name"
                                name="lastName"
                                value={lastName}
                                className="input-field"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Mail size={16} /> Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            value={email}
                            className="input-field"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Briefcase size={16} /> Position
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Position"
                                name="position"
                                value={position}
                                className="input-field"
                                onChange={(e) => setPosition(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Building size={16} /> Department
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Department"
                                name="department"
                                value={department}
                                className="input-field"
                                onChange={(e) => setDepartment(e.target.value)}
                            />
                        </div>
                    </div>

                    <button className="btn btn-primary w-full flex items-center justify-center gap-2 mt-8" type="submit">
                        <Save size={20} />
                        <span>Submit</span>
                    </button>
                </form>
            </motion.div>
        </div>
    )
}

export default EmployeeForm

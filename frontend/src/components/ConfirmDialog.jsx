import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="text-red-600" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                        <p className="text-gray-600 text-sm">{message}</p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                    <button onClick={onCancel} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="btn btn-danger">
                        Delete
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ConfirmDialog;

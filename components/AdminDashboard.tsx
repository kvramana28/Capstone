import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import * as db from '../services/databaseService';
import Spinner from './Spinner';

const AdminDashboard: React.FC = () => {
    const [farmers, setFarmers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFarmers = async () => {
            setLoading(true);
            const farmerData = await db.getFarmers();
            setFarmers(farmerData);
            setLoading(false);
        };
        fetchFarmers();
    }, []);

    return (
        <main className="flex-grow container mx-auto p-4 md:p-8">
            <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-green-800 mb-6 border-b pb-4">Admin Dashboard</h2>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Registered Farmers</h3>
                <div className="overflow-x-auto">
                    {loading ? <Spinner /> : (
                        farmers.length > 0 ? (
                            <table className="min-w-full bg-white border">
                                <thead className="bg-green-50">
                                    <tr>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">User ID</th>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Email</th>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Mobile Number</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700">
                                    {farmers.map((farmer, index) => (
                                        <tr key={farmer.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="text-left py-3 px-4">{farmer.id}</td>
                                            <td className="text-left py-3 px-4">{farmer.email}</td>
                                            <td className="text-left py-3 px-4">{farmer.mobile}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No farmers have registered yet.</p>
                        )
                    )}
                </div>
            </div>
        </main>
    );
};

export default AdminDashboard;

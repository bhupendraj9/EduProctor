import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Temp = () => {
    const [statusCounts, setStatusCounts] = useState({ ongoing: 0, terminated: 0, completed: 0 });
    const [distinctRecords, setDistinctRecords] = useState([]);
    const { testId, coursename } = useParams();

    useEffect(() => {
   
        const fetchDistinctRecords = async () => {
            try {
                const response = await fetch(`http://localhost:5000/get-distinct-records/${testId}/${coursename}`);
                const data = await response.json();
                console.log(data);
                setDistinctRecords(data.data);

            
                const counts = {
                    ongoing: 0,
                    terminated: 0,
                    completed: 0,
                };
                data.data.forEach(record => {
                    counts[record.status]++;
                });
                setStatusCounts(counts);
            } catch (error) {
                console.error('Error fetching distinct records:', error);
            }
        };

        fetchDistinctRecords();
    }, [testId, coursename]);

    const getStatusTextColor = (status) => {
        switch (status) {
            case 'ongoing':
                return 'text-blue-500';
            case 'terminated':
                return 'text-red-500';
            case 'completed':
                return 'text-green-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-semibold text-center mb-8">Exam Dashboard</h1>
            <div className="grid grid-cols-3 gap-6">
              
                {Object.entries(statusCounts).map(([status, count]) => (
                    <div key={status} className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-lg font-semibold mb-2">{status}</h2>
                        <p className={`text-3xl font-bold ${getStatusTextColor(status)}`}>{count}</p>
                    </div>
                ))}
            </div>
            {/* Display list of distinct records */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Students</h2>
                <ul className="divide-y divide-gray-200">
                    {distinctRecords.map((record, index) => (
                        <li key={index} className="py-4 flex justify-between items-center">
                            <span className="text-lg font-semibold">{record.student_id}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusTextColor(record.status)}`}>
                                {record.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Temp;

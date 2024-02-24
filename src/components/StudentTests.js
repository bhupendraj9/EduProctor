import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

function StudentTests() {
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:5000/get-tests?department=${decodedToken.department}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Failed to fetch tests');
            }
            setTests(data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch tests');
            setIsLoading(false);
        }
    };

    const startTest = async (testId, testcourse, studentId) => {
        try {
            const response = await fetch('http://localhost:5000/start-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ testId, testcourse, studentId })
            });
            const dta = await response.json();
            toast.success(dta.message);
            if (!response.ok) {
                throw new Error(dta.message);
            }
            const data = await response.json();
            const { recordId, message } = data;
            return recordId;
        } catch (error) {
            console.error('Error starting test:', error.message);
        }
    };

    const handleAttemptTest = async (testId, testCourse) => {
        try {
            const recordId = await startTest(testId, testCourse, decodedToken.id);
            navigate(`/attempt-test/${testId}/${testCourse}`);
        } catch (error) {
            console.error('Error attempting test:', error.message);
        }
    };

    return (
        <div className='flex'>
            <Sidebar decodedtoken={decodedToken} />
            <div className="flex flex-col justify-center items-center mt-8 w-full">
                <div className="max-w-lg w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-2xl mb-4">Available Tests</h2>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : tests.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {tests.map(test => (
                                <div key={test.test_id} className="border border-gray-300 rounded p-4">
                                    <p>Test ID: {test.test_id}</p>
                                    <p>Course Name: {test.course_name}</p>
                                    <p>Duration: {test.duration} minutes</p>
                                    <button 
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                                        onClick={() => handleAttemptTest(test.test_id, test.course_name)}
                                        disabled={isLoading} // Disable button while loading
                                    >
                                        Attempt Test
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No tests available in your department</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentTests;

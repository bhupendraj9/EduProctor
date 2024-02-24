import React, { useState, useEffect } from 'react';

import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import { jwtDecode } from 'jwt-decode';
import { NavLink, useNavigate } from 'react-router-dom';

function FacultyTests() {
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
  
    const navigate = useNavigate();
    useEffect(() => {
        fetchFacultyTests();
    }, []);

    const fetchFacultyTests = async () => {
        try {
        console.log(decodedToken.id);
            setIsLoading(true);
            const response = await fetch(`http://localhost:5000/faculty/tests?created_by_id=${decodedToken.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch faculty tests');
            }
            const data = await response.json();
            setTests(data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch faculty tests');
            setIsLoading(false);
        }
    };

    const handleOpenTest = (testId) => {
       navigate(`/mytests/${testId}`)
    };

    return (
        <div className='flex'>
            <Sidebar decodedtoken={decodedToken} />
            <div className="flex flex-col justify-center items-center mt-8 w-full ">
                <div className=" w-full flex flex-col items-center bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 lg:w-[700px]">
                    <h2 className="text-2xl mb-4">Your Tests</h2>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : tests.length > 0 ? (
                        <div className="flex flex-col bg-blue-50 lg:w-[600px] ">
                            {tests.map(test => (
                                <div key={test.test_id} className="border border-gray-300 rounded p-4 flex gap-3 items-center justify-between px-4 w-full">
                                    <p className="font-bold">Test ID: {test.test_id}</p>
                                    <p className="mt-2 flex flex-col"><span className='font-bold'>Subject:</span> <div>{test.course_name}</div> </p>
                                    <p className="mt-2 flex flex-col"><span className='font-bold'>Duration:</span> <div>{test.duration} minutes</div></p>
                                    <button 
                                        className="bg-blue-500 hover:bg-blue-700  text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none focus:shadow-outline"
                                        onClick={() => handleOpenTest(test.test_id)}
                                    > 
                                        Open
                                    </button>
                                    <NavLink to={`/records/${test.test_id}/${test.course_name}`}  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none focus:shadow-outline">View Records</NavLink>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No tests created by you</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FacultyTests;

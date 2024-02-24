import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import { jwtDecode } from 'jwt-decode';

function TestDetails() {
    const { testId } = useParams();
    const [testDetails, setTestDetails] = useState(null);
    const [testQuestions, setTestQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

    useEffect(() => {
        fetchTestDetails(testId);
        fetchTestQuestions(testId);
    }, [testId]);

    const fetchTestDetails = async (testId) => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:5000/test/details?test_id=${testId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch test details');
            }
            const data = await response.json();
            setTestDetails(data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch test details');
            setIsLoading(false);
        }
    };

    const fetchTestQuestions = async (testId) => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:5000/test/questions?test_id=${testId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch test questions');
            }
            const data = await response.json();
            setTestQuestions(data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch test questions');
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className='flex'>
            <Sidebar decodedtoken={decodedToken} />
            <div className="flex flex-col justify-center items-center mt-8 w-full">
                <div className="max-w-lg w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-2xl mb-4">Test Details</h2>
                    {testDetails ? (
                        <div>
                            <p>Test ID: {testDetails.test_id}</p>
                            <p>Subject: {testDetails.course_name}</p>
                            <p>Duration: {testDetails.duration} minutes</p>
                            {/* Add more details here as needed */}
                        </div>
                    ) : (
                        <p>No test details available</p>
                    )}
                </div>
                <div className="max-w-lg w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-2xl mb-4">Test Questions</h2>
                    {testQuestions.length > 0 ? (
                        <div>
                            {testQuestions.map((question,index) => (
                                <div key={question.question_id} className="mb-4">
                                <div className='flex gap-1 items-start'>
                                 <b>({index+1})</b>
                                    <p>{question.question_text}</p>
                                    {question.image_url && (
                                        <img src={question.image_url} alt="Question" className="mt-2" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                    )}
                                </div>
                                  
                                    <ul className='flex flex-col items-start'>
                                        <li><b>1)</b>{question.option_1}</li>
                                        <li><b>2)</b>{question.option_2}</li>
                                        <li><b>3)</b>{question.option_3}</li>
                                        <li><b>4)</b>{question.option_4}</li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No questions available for this test</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TestDetails;

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import { jwtDecode } from 'jwt-decode';

function CreateTest() {
    const [subjects] = useState(['advance_database', 'cloud_computing', 'soft_computing', 'machine_learning']);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [duration, setDuration] = useState(60); 
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

    useEffect(() => {
        if (selectedSubject) {
            fetchQuestionsBySubject();
        }
    }, [selectedSubject]);

    const fetchQuestionsBySubject = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:5000/getquestions?department=${decodedToken.department}&subject=${selectedSubject}`);
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            const data = await response.json();
            setQuestions(data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch questions');
            setIsLoading(false);
        }
    };

    const handleSubjectChange = (e) => {
        const subject = e.target.value;
        setSelectedSubject(subject);
    };

    const handleCheckboxChange = (questionId) => {
        const isSelected = selectedQuestions.includes(questionId);
        if (isSelected) {
            setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
        } else {
            setSelectedQuestions([...selectedQuestions, questionId]);
        }
    };

    const handleCreateTest = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:5000/create-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    department: decodedToken.department,
                    coursename: selectedSubject,
                    duration: duration,
                    created_by_id: decodedToken.id,
                    questions: selectedQuestions
                })
            });
            if (!response.ok) {
                throw new Error('Failed to create test');
            }
            setSelectedQuestions([]);
            toast.success('Test created successfully');
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to create test');
            setIsLoading(false);
        }
    };

 if(decodedToken.role !=='admin')
   {
    return <div>Unauthorized</div>
   }
    return (
        <div className='flex flex-grow w-full'>
            <Sidebar decodedtoken={decodedToken} />
            <div className="flex flex-col justify-center items-center mt-8 w-full">
                <div className="max-w-lg w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-2xl mb-4">Create Test</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                            Select Subject:
                        </label>
                        <select 
                            id="subject" 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={selectedSubject} 
                            onChange={handleSubjectChange}
                        >
                            <option value="">Select Subject</option>
                            {subjects.map((sub, index) => (
                                <option key={index} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                            Duration (in minutes):
                        </label>
                        <input 
                            id="duration" 
                            type="number" 
                            min="1" 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </div>
                    {selectedSubject && (
                        <div>
                            <h3 className="text-xl mb-2">Select Questions:</h3>
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : questions.length === 0 ? (
                                <p>No questions found for the selected subject.</p>
                            ) : (
                                <div>
                                    {questions.map(question => (
                                        <div key={question.question_id} className="mb-4">
                                            <div className="flex items-start">
                                                <input 
                                                    type="checkbox" 
                                                    id={question.question_id} 
                                                    checked={selectedQuestions.includes(question.question_id)}
                                                    onChange={() => handleCheckboxChange(question.question_id)}
                                                />
                                                <label htmlFor={question.question_id} className="ml-2">{question.question_text}</label>
                                            </div>
                                            {question.image_url && (
                                                <img src={question.image_url} alt="Question" className="mt-2" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                            )}
                                            <div className="ml-6">
                                                <ol type="a" className="pl-4 questions-list flex flex-col items-start">
                                                    <li>{question.option_1}</li>
                                                    <li>{question.option_2}</li>
                                                    <li>{question.option_3}</li>
                                                    <li>{question.option_4}</li>
                                                </ol>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4" 
                        onClick={handleCreateTest}
                        disabled={!selectedSubject || selectedQuestions.length === 0}
                    >
                        Create Test
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateTest;

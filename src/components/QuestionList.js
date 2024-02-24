import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import { jwtDecode } from 'jwt-decode';
import storage from '../firebase';

function QuestionList() {
    const [questions, setQuestions] = useState([]);
    const [department, setDepartment] = useState(''); 
    const [subjects, setSubjects] = useState(['advance_database', 'cloud_computing', 'soft_computing', 'machine_learning']); // Dummy subjects
    const [subject, setSubject] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('token');
    const decodedtoken = jwtDecode(token);
    const [formVisible, setFormVisible] = useState(true);
    const [backButtonVisible, setBackButtonVisible] = useState(false);

    const [departments, setDepartments] = useState([decodedtoken.department]);
    useEffect(() => {
        if (department && subject) {
            fetchQuestions();
        }
    }, [department, subject]);

    const fetchQuestions = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const decodedtoken = jwtDecode(token);
            const response = await fetch(`http://localhost:5000/getquestions?department=${department}&subject=${subject}`);
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            const data = await response.json();
            setQuestions(data);
            setIsLoading(false);
            setFormVisible(false);
            setBackButtonVisible(true);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch questions');
            setIsLoading(false);
        }
    };

    const handleBackButtonClick = () => {
        setQuestions([]);
        setFormVisible(true);
        setBackButtonVisible(false);
    };

    return (
        <div className='flex'>
            <Sidebar decodedtoken={decodedtoken} />
            <div className="flex flex-col justify-center items-center mt-8 w-full">
                <div className="max-w-4xl w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-2xl mb-4">Questions</h2>
                    {backButtonVisible && (
                        <button
                            onClick={handleBackButtonClick}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                        >
                            Back
                        </button>
                    )}
                    {formVisible ? (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                                    Department:
                                </label>
                                <select 
                                    id="department" 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={department} 
                                    onChange={(e) => setDepartment(e.target.value)}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept, index) => (
                                        <option key={index} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                                    Subject:
                                </label>
                                <select 
                                    id="subject" 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={subject} 
                                    onChange={(e) => setSubject(e.target.value)}
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map((sub, index) => (
                                        <option key={index} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                            <button 
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                onClick={fetchQuestions}
                            >
                                Fetch Questions
                            </button>
                        </>
                    ) : (
                        <>
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    {questions.length === 0 ? (
                                        <p>No questions available.</p>
                                    ) : (
                                        <div>
                                            {questions.map((question, index) => (
                                                <div key={question.question_id} className="question-container bg-gray-100 rounded-lg p-4 shadow-md mb-4 w-full">
                                                    <div className="flex">
                                                        <div className="question-number mr-2">{index + 1}.</div>
                                                        {question.image_url ? (
                                                            <img src={question.image_url} alt="Question" className="question-image" />
                                                        ) : (
                                                            <div className="question-text">
                                                                <p>{question.question_text}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <ul className="options-list ml-8 flex flex-col items-start">
                                                        <li><label><strong>a) </strong> {question.option_1}</label></li>
                                                        <li><label><strong>b)</strong> {question.option_2}</label></li>
                                                        <li><label><strong>c)</strong> {question.option_3}</label></li>
                                                        <li><label><strong>d)</strong> {question.option_4}</label></li>
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuestionList;

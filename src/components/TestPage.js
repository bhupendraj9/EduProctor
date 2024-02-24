import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

function TestPage() {
    const [testData, setTestData] = useState({
        questions: [],
        selectedOptions: {},
        remainingTime: 0,
        testStatus: 'not-started',
        testDuration: 30,
        submitted: false,
        totalMarks: 0,
        terminated: false,
        instructions: 'Changing tabs will lead to termination from test'
    });
    const [start,setstart]=useState(false);


    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const { testId, testcourse } = useParams();

    const studentId = decodedToken.id;
    const duration = 30;
    const interval = 1000; 
    
    const updateTestStatus = async (testId, studentId, status, marks,coursename) => {
    try {
    console.log(coursename,studentId)
        const response = await fetch(`http://localhost:5000/update-test-status/${testId}/${studentId}/${coursename}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status, marks })
        });
     
        if (!response.ok) {
            throw new Error('Failed to update test status');
        }

        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Error updating test status:', error);
        throw error;
    }
};

      

    useEffect(() => {
        // Fetch test duration from the server
        const fetchTestDuration = async () => {
            try {
                const response = await fetch(`http://localhost:5000/test/duration?test_id=${testId}&department=${decodedToken.department}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch test duration');
                }
                const data = await response.json();
                console.log(data)
                setTestData(prevState => ({
                    ...prevState,
                    testDuration: data.duration
                }));
                setTimeout(()=>{setstart(true)})
            } catch (error) {
                console.error('Error fetching test duration:', error);
            }
        };

        fetchTestDuration();
    }, [testId, decodedToken.department]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/test/questions/student?test_id=${testId}&department=${decodedToken.department}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch test questions');
                }
                const data = await response.json();
                
                setTestData(prevState => ({
                    ...prevState,
                    questions: data
                }));
            } catch (error) {
                console.error('Error fetching test questions:', error);
            }
        };

        fetchData();

        setTestData(prevState => ({
            ...prevState,
            testDuration: duration,
            testStatus: 'not-started'
        }));
    }, [testId, decodedToken.department]);

    useEffect(() => {
     if(start){
      const startTest = () => {
            setTestData(prevState => ({
                ...prevState,
                remainingTime: prevState.testDuration * 60, // Initialize remaining time to the duration of the test in seconds
                testStatus: 'ongoing' // Set status to ongoing when the test starts
            }));

            // Start timer
            const timer = setInterval(() => {
                setTestData(prevState => {
                    const newRemainingTime = Math.max(0, prevState.remainingTime - 1); // Decrement remaining time by 1 second

                    // Set status to completed when the timer runs out
                    if (newRemainingTime <= 0) {
                        clearInterval(timer);
                        
                        return {
                            ...prevState,
                            remainingTime: 0,
                            testStatus: 'completed'
                        };
                        
                    }

                    return {
                        ...prevState,
                        remainingTime: newRemainingTime
                    };
                });
            }, interval);

            return () => {
                clearInterval(timer);
            };
        };

        let timer;
        if (testData.testStatus === 'not-started') {
            timer = startTest();
        }

        // Detect tab change
        const handleVisibilityChange = () => {
            if (testData.testStatus === 'ongoing' && document.visibilityState === 'hidden') {
               
                setTestData(prevState => ({
                    ...prevState,
                    testStatus: 'terminated',
                    terminated: true
                }));
                console.log("called")
                 updateTestStatus(testId,decodedToken.id,'terminated',0,testcourse);                
                clearInterval(timer);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
     }
       
    }, [testData]);

    const handleOptionSelect = (questionId, selectedOption) => {
        setTestData(prevState => ({
            ...prevState,
            selectedOptions: {
                ...prevState.selectedOptions,
                [questionId]: selectedOption
            }
        }));
    };

    const handleSubmitTest = () => {
        let totalMarks = 0;
        testData.questions.forEach(question => {
            const selectedOption = testData.selectedOptions[question.question_id];
            if (selectedOption === question.correct_option) {
                totalMarks += 1;
            }
        });
        setTestData(prevState => ({
            ...prevState,
            totalMarks: totalMarks,
            submitted: true
        }));
        
        setTimeout(()=>{ updateTestStatus(testId,decodedToken.id,'completed',totalMarks,testcourse)},500)
       
    };

    useEffect(() => {
        if (testData.testStatus === 'completed' && !testData.submitted) {
            handleSubmitTest();
        }
    }, [testData]);
    
    // useEffect(()=>{startTest()},[])

    const handleStartButtonClick = () => {
        setTestData(prevState => ({
            ...prevState,
            testStatus: 'ongoing'
        }));
    };

    if (testData.questions.length === 0) {
        return <div className="text-center mt-8">Loading...</div>;
    }
 else if(testData.testStatus==='not-started')
    {
     return <div>loading</div>
    }
    return (
        <div className="flex flex-col items-center mt-8">
            <div className="text-center mb-8">
                <p className="text-lg font-semibold mb-4">{testData.instructions}</p>
                {testData.testStatus === 'not-started' && (
                    <button onClick={handleStartButtonClick} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                        Start Test
                    </button>
                )}
                {testData.terminated && (
                    <div>
                        <p className="text-red-600 font-semibold mb-5">You have been terminated from the test.</p>
                        <NavLink to="/dashboard" className="text-white font-bold bg-blue-600 rounded-md p-2 mt-5" >Return home</NavLink>
                    </div>
                )}
            </div>

            {testData.testStatus !== 'not-started' && (
                <div className="text-center mb-4">
                    {testData.testStatus!=='terminated' &&<div className="text-lg font-semibold">Time remaining: {Math.floor(testData.remainingTime / 60)} minutes {testData.remainingTime % 60} seconds</div>}
                    <div className="text-sm">Status: {testData.testStatus}</div>
                </div>
            )}

            {testData.testStatus === 'ongoing' && (
                <div className="w-full max-w-2xl">
                    <h2 className="text-2xl mb-4">Test Questions</h2>
                    {testData.questions.map((question,index) => (
                        <div key={question.question_id} className="mb-8 flex flex-col items-start">
                            <h3 className="text-lg font-semibold mb-2">Question {index+1}</h3>
                            <p className="mb-2">{question.question_text}</p>
                            {question.image_url && <img src={question.image_url} alt="Question" className="mb-2" />}
                            <ul className="flex flex-col items-start">
                                {['option_1', 'option_2', 'option_3', 'option_4'].map((optionKey, index) => (
                                    <li key={index}>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name={`option-${question.question_id}`}
                                                value={question[optionKey]}
                                                checked={testData.selectedOptions[question.question_id] === question[optionKey]}
                                                onChange={() => handleOptionSelect(question.question_id, question[optionKey])}
                                                className="form-radio"
                                            />
                                            <span className="ml-2">{question[optionKey]}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {testData.testStatus === 'ongoing' && !testData.terminated && (
                <button onClick={() => setTestData(prevState => ({ ...prevState, testStatus: 'completed' }))} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                    Submit Test
                </button>
            )}

            {testData.submitted && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <p className="text-lg font-semibold mb-4">Your test has been submitted successfully.</p>
                        <p className="font-semibold">Your total marks: {testData.totalMarks}/{testData.questions.length}</p>
                        <button onClick={() => navigate('/dashboard')} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-4">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TestPage;

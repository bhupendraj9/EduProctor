import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { jwtDecode } from 'jwt-decode';
import storage from '../firebase'; 
import { toast } from 'react-hot-toast'; 

function QuestionForm() {
    const token = localStorage.getItem('token');
    const decodedtoken = jwtDecode(token);
    const [questionType, setQuestionType] = useState('text');
    const [questionText, setQuestionText] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [correctOption, setCorrectOption] = useState('');
    const [options, setOptions] = useState({
        option1: '',
        option2: '',
        option3: '',
        option4: ''
    });
   const [subject, setSubject] = useState('advance_database');
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setImageUrl(URL.createObjectURL(e.target.files[0])); // Set image preview
        }
    };

    const handleUpload = () => {
        if (image) {
            const storageRef = storage.ref(`images/${image.name}`);
            const uploadTask = storageRef.put(image);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.error(error);
                    toast.error('Error uploading image'); 
                },
                async () => {
                    try {
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                        console.log('File available at', downloadURL);
                        setImageUrl(downloadURL); 
                        toast.success('Image uploaded successfully');
                    } catch (error) {
                        console.error(error);
                        toast.error('Error uploading image'); 
                    }
                }
            );
        } else {
            console.error('No image selected');
            toast.error('No image selected'); 
        }
    };

     const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const decodedtoken = jwtDecode(token);

            const formData = {
                department: decodedtoken.department,
                question_text: questionText,
                image_url: imageUrl,
                correct_option: correctOption,
                option_1: options.option1,
                option_2: options.option2,
                option_3: options.option3,
                option_4: options.option4,
                created_by_id: decodedtoken.id,
                subject:subject
            };

            const response = await fetch('http://localhost:5000/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(data);
             setQuestionText('');
            setImage(null);
            setImageUrl('');
            setCorrectOption('');
            setOptions({
                option1: '',
                option2: '',
                option3: '',
                option4: ''
            });
            setSubject('advance_database');
            if (!response.ok) {
                throw new Error('Failed to add question');
            }
            toast.success('Question added successfully!');
            // Clear form fields if needed
        } catch (error) {
            console.error(error);
            toast.error('Failed to add question');
        }
    };
   if(decodedtoken.role !=='admin')
   {
    return <div>Unauthorized</div>
   }
   else
    return (
        <div className='flex'>
            <Sidebar decodedtoken={decodedtoken} />
            <div className="flex justify-center items-center mt-8 w-full">
                <form className="max-w-lg w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                    <h2 className="text-2xl mb-4">Add New Question</h2>
                     <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                            Subject:
                        </label>
                        <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
                            <option value="advance_database">Advance Database</option>
                            <option value="cloud_computing">Cloud Computing</option>
                            <option value="soft_computing">Soft Computing</option>
                            <option value="machine_learning">Machine Learning</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="questionType">
                            Question Type:
                        </label>
                        <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="questionType" value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                            <option value="text">Text</option>
                            <option value="image">Image</option>
                        </select>
                    </div>
                    {questionType === 'text' ? (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="questionText">
                                Question Text:
                            </label>
                            <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="questionText" value={questionText} onChange={(e) => setQuestionText(e.target.value)} required />
                        </div>
                    ) : (
                        <div className="mb-4">
                            <label htmlFor="imageUpload" className="cursor-pointer">
                                <div className="border border-dashed border-gray-400 rounded px-3 py-16 text-center">
                                    {imageUrl ? (
                                        <img className="mx-auto h-32" src={imageUrl} alt="Uploaded" />
                                    ) : (
                                        <p className="text-gray-600">Drag & Drop your image here or click to select</p>
                                    )}
                                </div>
                            </label>
                            <input type="file" className="hidden" id="imageUpload" accept="image/*" onChange={handleChange} />
                            <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={handleUpload}>Upload Image</button>
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="correctOption">
                            Correct Option:
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="correctOption" value={correctOption} onChange={(e) => setCorrectOption(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="option1">
                            Option 1:
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="option1" name="option1" value={options.option1} onChange={(e) => setOptions({ ...options, option1: e.target.value })} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="option2">
                            Option 2:
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="option2" name="option2" value={options.option2} onChange={(e) => setOptions({ ...options, option2: e.target.value })} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="option3">
                            Option 3:
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="option3" name="option3" value={options.option3} onChange={(e) => setOptions({ ...options, option3: e.target.value })} required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="option4">
                            Option 4:
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" id="option4" name="option4" value={options.option4} onChange={(e) => setOptions({ ...options, option4: e.target.value })} required />
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default QuestionForm;

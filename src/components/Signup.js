import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';

const Signup = () => {
const navigate = useNavigate();
  
  const [userType, setUserType] = useState('student'); // Default to student
  const [formData, setFormData] = useState({
    id:'',
    fullName: '',
    password: '',
    role: '',
    department: '', 
  });

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if( !formData.fullName || !formData.id || !formData.password || formData.role || !formData.department)
    { 
      toast.error('Please fill all the required fields')
      return ;
    }
    
    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(formData.fullName)) {
     toast.error('Please enter a valid name');
    }
    
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
        {
         id: formData.id,
         name:formData.fullName,
         password:formData.password,
         department:formData.department,
         role:userType
        }
        ),
      });
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        console.log('User registered successfully');
        toast.success('Registration successful')
        navigate('/')
        
        
      } else {
        console.error('Failed to register user');
        
        toast.error(data.message);
      
      }
    } catch (error) {
      console.error('Error registering user:', error);
    
    }
  };

  return (
    <div>
      <div className="h-screen md:flex ">
        <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-blue-500 to-blue-800 justify-around items-center hidden">
          <div>
            <h1 className="text-white font-bold text-4xl font-sans">EduProctor</h1>
            <p className="text-white mt-1 mb-5">A seamless online examination portal</p>
            <NavLink to="/" className="w-28 bg-white text-blue-800 mt-4 p-4 py-2 rounded-2xl font-bold mb-2">Login</NavLink>
          </div>
          <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div> 
          <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        </div>
        <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
          <form className="bg-white" onSubmit={handleSubmit}>
            <h1 className="text-gray-800 font-bold text-2xl mb-1">Hello Again!</h1>
            <p className="text-sm font-normal text-gray-600 mb-7">Welcome Back</p>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Select User Type</label>
              <select
                className="block w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-indigo-500"
                value={userType}
                onChange={handleUserTypeChange}
              >
                <option value="admin">Admin</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input className="pl-2 outline-none border-none" type="text" name="fullName" id="fullName" placeholder="Full name" value={formData.fullName} onChange={handleInputChange} />
            </div>
           
               <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
              {userType === 'student' && <input className="pl-2 outline-none border-none" type="text" name="id" id="id" placeholder="Please enter PRN" value={formData.id} onChange={handleInputChange} />}
              {userType === 'faculty' && <input className="pl-2 outline-none border-none" type="text" name="id" id="id" placeholder="Please enter Faculty ID" value={formData.id} onChange={handleInputChange} />}
              {userType === 'admin' && <input className="pl-2 outline-none border-none" type="text" name="id" id="id" placeholder="Please enter Admin ID" value={formData.id} onChange={handleInputChange} />}
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input className="pl-2 outline-none border-none" type="password" name="password" id="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Select Department</label>
              <select
                className="block w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="IT">IT</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Civil">Civil</option>
              </select>
            </div>
            <button type="submit" className="block w-full bg-blue-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

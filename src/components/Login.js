import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';



const Login = () => {

const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    password: '',
  });
 
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
  if(!formData.id || !formData.password)
  {
   toast.error('Please fill all details');
   return;
   }
  try {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: formData.id,
        password: formData.password
      })
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('Login Successful !');
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      toast.error(
         data.message
      );
    }

    console.log(formData);
  } catch (error) {
    
    console.error('Error during login:', error);
    toast.error('An error occurred during login');
  }
};


  return (
    <div>
      <div>
        <style dangerouslySetInnerHTML={{__html: "\n  .login_img_section {\n  background: linear-gradient(rgba(2,2,2,.7),rgba(0,0,0,.7)),url(https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D) center center;\n}\n" }} />
        <div className="h-screen flex">
          <div className="hidden lg:flex w-full lg:w-1/2 login_img_section justify-around items-center">
            <div className="bg-black opacity-20 inset-0 z-0"></div>
            <div className="w-full mx-auto px-20 flex-col items-center space-y-6">
              <h1 className="text-white font-bold text-4xl font-sans">EduProctor</h1>
              <p className="text-white mt-1">A seamless online examination portal</p>
              <div className="flex justify-center lg:justify-start mt-6">
                <NavLink to="/signup" className="hover:bg-blue-700 hover:text-white hover:-translate-y-1 transition-all duration-500 bg-white text-blue-800 mt-4 px-4 py-2 rounded-2xl font-bold mb-2 ml-44">Get Started</NavLink>
              </div>
            </div>
          </div>
          <div className="flex w-full lg:w-1/2 justify-center items-center bg-white space-y-8">
            <div className="w-full px-8 md:px-32 lg:px-24">
              <form className="bg-white rounded-md shadow-2xl p-5" onSubmit={handleSubmit}>
                <h1 className="text-gray-800 font-bold text-2xl mb-1">Hello Again!</h1>
                <p className="text-sm font-normal text-gray-600 mb-8">Welcome Back</p>
                <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input id="email" className="pl-2 w-full outline-none border-none" type="text" name="id" placeholder="Enter PRN / faculty id / admin id" value={formData.email} onChange={handleInputChange} />
                </div>
                <div className="flex items-center border-2 mb-12 py-2 px-3 rounded-2xl ">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <input className="pl-2 w-full outline-none border-none" type="password" name="password" id="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
                </div>
                <button type="submit" className="block w-full bg-blue-600 mt-5 py-2 rounded-2xl hover:bg-blue-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Login</button>
                <div className="flex justify-end mt-4">
                  <NavLink to="/signup" className="text-sm ml-2 hover:text-blue-500 cursor-pointer hover:-translate-y-1 duration-500 transition-all">Don't have an account yet?</NavLink>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

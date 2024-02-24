import React from 'react'
import Sidebar from './Sidebar'
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
   const token = localStorage.getItem('token');
    const decodedtoken = jwtDecode(token); 
    
  return (
    <div className='flex'>
    <Sidebar decodedtoken={decodedtoken}></Sidebar>
    <div> </div> 
    </div>
  )
}

export default Dashboard
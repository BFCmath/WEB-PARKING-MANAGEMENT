// export default Home
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css'; // Assuming you have a CSS file for styling

function Home() {
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [student_id, setStudent_id] = useState('');
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const parkingRecords = [
        { 
            timeParking: '10:40:34 2/2/2023', 
            timeUnparking: '15:04:12 2/2/2023', 
            totalTime: '4 hours, 23 minutes, 38 seconds', // This should be calculated
            moneyToPay: '4,000' // This should be calculated based on total time
        }
    ]
    useEffect(() => {
        axios.get('http://localhost:3000')
            .then(res => {
                if (res.data.Status === 'Success') {
                    setAuth(true);
                    setName(res.data.name);
                    setEmail(res.data.email);
                    setStudent_id(res.data.student_id);
                } else {
                    setAuth(false);
                    setMessage(res.data.Error);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleLogout = () => {
        axios.get('http://localhost:3000/logout')
            .then(() => {
                navigate('/login');
            })
            .catch(err => console.log(err));
    }

    return (
        <div className='home-container'>
          {!auth ? (
            <div className='welcome-panel'>
              <h3>Welcome to the Parking Management System</h3>
              <p className='welcome-message'>Manage your parking with ease.</p>
              <Link to='/login' className='btn btn-primary'>Sign In</Link>
              <Link to='/register' className='btn btn-secondary'>Sign Up</Link>
            </div>
          ) :(
            <div className='auth-container'>
                <div className='user-info'>
                    <p>Name: {name}</p>
                    <p>Email: {email}</p>
                    <p>Student ID: {student_id}</p>
                </div>
                <div className='logout-container'>
                    <button onClick={handleLogout}>Logout</button>
                </div>
                <table className='parking-table'>
                        <thead>
                            <tr>
                                <th>Time In</th>
                                <th>Time Out</th>
                                <th>Total Time Parking</th>
                                <th>Money to Pay</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parkingRecords.map((record, index) => (
                                <tr key={index}>
                                    <td>{record.timeParking}</td>
                                    <td>{record.timeUnparking}</td>
                                    <td>{record.totalTime}</td>
                                    <td>{record.moneyToPay} VND</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
          </div>
          )}
        </div>
      );
}

export default Home;

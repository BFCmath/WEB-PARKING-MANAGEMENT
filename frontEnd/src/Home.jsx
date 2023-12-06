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

    const [parkingData, setParkingData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000')
            .then(res => {
                if (res.data.Status === 'Success') {
                    setAuth(true);
                    setName(res.data.name);
                    setEmail(res.data.email);
                    setStudent_id(res.data.student_id);
                    axios.get(`http://localhost:3000/parking-data?student_id=${res.data.student_id}`, { withCredentials: true })
                        .then(parkingRes => {
                            console.log(parkingRes.data);
                            setParkingData(parkingRes.data); 
                        })
                        .catch(parkingErr => {
                            console.error(parkingErr);
                        });
                } else {
                    setAuth(false);
                    setMessage(res.data.Error);
                }
            })
            .catch(err => console.log(err));
    }, []);
    
    const handlePrintQR = () => {
        navigate(`/print-qr?student_id=${student_id}`); 
    };

    const handleLogout = () => {
        axios.get('http://localhost:3000/logout')
            .then(() => {
                navigate('/login');
            })
            .catch(err => console.log(err));
    };

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
                    <div style={{float: "left"}}>
                    <p>Name: {name}</p>
                    <p>Email: {email}</p>
                    <p>Student ID: {student_id}</p>
                    </div>
                    
                    <button onClick={handleLogout} style={{float: "right"}} className='rounded'>Logout</button>
                </div>
                <div className='logout-container'>
                    <button onClick={handlePrintQR}>Print QR</button> {/* Add this button */}
                </div>
                <table className='parking-table'>
                    <thead>
                        <tr>
                            <th>Time In</th>
                            <th>Time Out</th>
                            <th>Price (VND)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parkingData.map((record, index) => (
                            <tr key={index} className={record.is_paid === 1 ? 'paid-row' : 'unpaid-row'}>
                                <td>{record.time_in}</td>
                                <td>{record.time_out}</td>
                                <td>{record.price}</td>
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

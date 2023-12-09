// export default Home
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css'; // Assuming you have a CSS file for styling

function Home() {
    axios.defaults.withCredentials = true;
    const navigate = useNavigate();

    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [student_id, setStudent_id] = useState('');
    const [total_money,setTotal_money] = useState(0);
    const [statusFilter, setStatusFilter] = useState('all');
    const [parkingData, setParkingData] = useState([]);



    const fetchParkingData = () => {
        axios.get(`http://localhost:3000/parking-data?student_id=${student_id}`, { withCredentials: true })
            .then(parkingRes => {
                console.log('Parking data: ' + student_id);
                console.log(parkingRes.data);
                setParkingData(parkingRes.data); 
                var totalPaid = parkingRes.data.reduce((total, record) => {
                    return record.is_paid === 0 ? total + Number(record.price) : total;
                }, 0);
                if(statusFilter === 'paid') totalPaid = 0;
                setTotal_money(totalPaid);
            })
            .catch(parkingErr => {
                console.error(parkingErr);
            });
        };
    function formatDateTime(isoString) {
        if(!isoString) return 'N/A';
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear().toString().slice(2); // Get last two digits of year
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
    
        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;
    
        return `${formattedTime} ${formattedDate}`;
    }
    function formatAndAppendZeros(str) {
        if(str===0) return 0;
        if(!str) return 'N/A';
        const newStr = str + '000';
        let reversedStr = newStr.split('').reverse().join('');
        reversedStr = reversedStr.replace(/(\d{3})(?=\d)/g, '$1.');
        return reversedStr.split('').reverse().join('');
    }
    const filteredParkingData = parkingData.filter(record => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'paid') return record.is_paid === 1;
        if (statusFilter === 'unpaid') return record.is_paid === 0;
    });
    const handlePrintQR = () => {
        navigate('/print-qr', { state: { studentId: student_id } });
    };
    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };
    const handlePay = () =>{
        navigate('/payment',{state: {studentId: student_id}});
    }
    const handleLogout = () => {
        axios.get('http://localhost:3000/logout')
            .then(() => {
                navigate('/login');
            })
            .catch(err => console.log(err));
    };
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
    useEffect(() => {
        if(!student_id){
            console.log("no student_id yet");    
            return;
        }
        fetchParkingData();
        const intervalId = setInterval(fetchParkingData, 30000);
        return () => clearInterval(intervalId);
      },[statusFilter,student_id]);
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
                <div >
                    <button onClick={handlePrintQR} className='printQR-container' >Print QR</button> 
                </div>
                <div className='filter-container'>
                    <label htmlFor="statusFilter">Filter by status:  </label>
                    <select id="statusFilter" onChange={handleStatusFilterChange}>
                        <option value="all">All</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                    </select>
                </div>
                <table className='parking-table' style={{wordBreak: 'break-word', maxWidth: '100%'}}>
                    <thead>
                        <tr>
                            <th>Time In</th>
                            <th>Time Out</th>
                            <th className='status-column'><span>Status</span></th>
                            <th>Price (VND)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredParkingData.map((record, index) => (
                            <tr key={index} className={record.is_paid === 1 ? 'paid-row' : 'unpaid-row'}>
                                <td>{formatDateTime(record.time_in)}</td>
                                <td>{formatDateTime(record.time_out)}</td>
                                <td>{record.is_paid === 1 ? 'Paid' : 'Unpaid'}</td>
                                <td>{formatAndAppendZeros(record.price)}</td>
                            </tr>
                        ))}
                        <tr className='total-row'>
                            <td colSpan="3" style={{textAlign: "right"}}>Total Money:</td>
                            <td>{formatAndAppendZeros(total_money)}</td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <button onClick={handlePay} className="pay-button">PAY</button> 
                </div>   
            </div>
          )}
        </div>
      );
}

export default Home;

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
    const [dayFilter, setDayFilter] = useState('all');
    const [parkingData, setParkingData] = useState([]);



    const fetchParkingData = () => {
        axios.get(`https://userserver.parkingmanage.online/parking-data?student_id=${student_id}`, { withCredentials: true })
            .then(parkingRes => {
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
    const compareDates = (parkingDate, daysDifference) => {
        const currentDate = new Date(); // Current date and time
        const parkingDateObj = new Date(parkingDate); // Convert parking date to Date object
    
        // Calculate the time difference in milliseconds
        const timeDiff = currentDate.getTime() - parkingDateObj.getTime();
    
        // Convert time difference from milliseconds to days
        const dayDiff = timeDiff / (1000 * 3600 * 24);
    
        // Compare the absolute day difference with the specified days difference
        return Math.abs(dayDiff) <= daysDifference;
    };    
    const filteredParkingData = parkingData.filter(record => {
        var check = true;
        if (statusFilter === 'paid') check &=  record.is_paid === 1;
        else if (statusFilter === 'unpaid') check &= record.is_paid === 0;
        check &= (dayFilter === 'all' || (dayFilter === 'month' && compareDates(record.time_in, 30)) || (dayFilter === 'week' && compareDates(record.time_in, 7)) || (dayFilter === 'today' && compareDates(record.time_in, 1)));
        return check;
    });
    const handlePrintQR = () => {
        navigate('/print-qr', { state: { studentId: student_id } });
    };
    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };
    const handleDayFilterChange = (event) => {
        setDayFilter(event.target.value);
    }
    const handlePay = () =>{
        navigate('/payment',{state: {studentId: student_id}});
    }
    const handleLogout = () => {
        axios.get('https://userserver.parkingmanage.online/logout')
            .then(() => {
                navigate('/login');
            })  
            .catch(err => console.log(err));
    };
    useEffect(() => {
        axios.get('https://userserver.parkingmanage.online')
            .then(res => {
                if (res.data.Status === 'Success') {
                    setAuth(true);
                    setName(res.data.name);
                    setEmail(res.data.email);
                    setStudent_id(res.data.student_id);
                    
                } else {
                    setAuth(false);
                    setMessage(res.data.Error);
                    console.log(res.data.Status);
                    console.log(res.data.Error);
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
      },[statusFilter,dayFilter,student_id]);
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
                <div className='filter-container my-border'>
                    <div className='filter-item my-border'>
                        <label htmlFor="statusFilter">Filter by status:</label>
                        <select id="statusFilter" onChange={handleStatusFilterChange}>
                            <option value="all">All</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                        </select>
                    </div>
                    <div className='filter-item my-border'>
                        <label htmlFor="dayFilter">Filter by day:</label>
                        <select id="dayFilter" onChange={handleDayFilterChange}>
                            <option value="all">All</option>
                            <option value="month">Last month</option>
                            <option value="week">Last week</option>
                            <option value="today">Today</option>
                        </select>
                    </div>
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

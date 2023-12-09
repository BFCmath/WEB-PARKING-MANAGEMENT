import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// toast.configure()

function Register() {   
    const [values, setValues] = useState({
        name: '',
        student_id: '',
        email: '',
        password: '',

    });
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://server-parking-web.onrender.com/register', values)
        .then(res => {
            console.log(res);
            toast.success('Successfully registered!', {
                position: toast.POSITION.TOP_CENTER
            });
        })
        .catch(err => {
            console.log(err);
            // Use toast here instead of alert
            toast.error(err.response.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        });
    };


  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
        <ToastContainer position="top-center" />
          <div className='bg-white p-3 rounded'>
            <h2>Sign-Up</h2>
            <form onSubmit = {handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor='name'><strong>Username</strong></label>
                    <input type='text' placeholder='Enter Name' name ='name' className='form-control rounded-0'
                    onChange={e => setValues({...values,name:e.target.value})}/>
                    
                </div>
                <div className='mb-3'>
                    <label htmlFor='student_id'><strong>Student ID</strong> (11 numbers)</label>
                    <input type='text' placeholder='Enter Student ID' name='student_id' className='form-control rounded-0' pattern="\d{11}" required // This makes sure the field is filled out
                        onChange={e => setValues({...values, student_id: e.target.value})}/>
                </div>
                <div className='mb-3'>
                    <label htmlFor='email'><strong>Email</strong></label>
                    <input type='email' placeholder='Enter Email' name = 'email'  className='form-control rounded-0'
                    onChange={e => setValues({...values,email:e.target.value})}/>

                </div>
                <div className='mb-3'>
                    <label htmlFor='password'><strong>Password</strong></label>
                    <input type='password' placeholder='Enter Password' name = 'password' className='form-control rounded-0'
                    onChange={e => setValues({...values, password :e.target.value})}/>
                </div>
                {/* <div className='mb-3'>
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <input type='password' className='form-control' id='confirmPassword' placeholder='Confirm Password' />
                </div> */}
                <button type='submit' className='form-control rounded-0 btn btn-success w-100 mx-0'>Sign up</button>
                <p>You are agree to our terms and policies.</p>
                <Link to="/login" className='form-control rounded-0 btn btn-secondary border w-100 rounded-0 text-decoration-none mx-0'>Login</Link>
                
            </form>
        </div>
    </div>
  )
}

export default Register
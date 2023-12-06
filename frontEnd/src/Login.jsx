import React, {useState} from 'react'
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Login() {
const [values, setValues] = useState({
    email: '',
    password: '',
});

const navigate = useNavigate();
axios.defaults.withCredentials = true;
const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/login', values)
    .then(res => {
    if(res.data.Status === "Success")
        navigate('/');
    else{
        toast.error(res.data.message,{
            position: toast.POSITION.BOTTOM_RIGHT
        });
    }
    })
    .catch(err => {console.log(err)})

}
    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <ToastContainer position="bottom-left" />
            <div className='bg-white p-3 rounded'>
                <h2>Sign-In</h2>
                <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="email"><strong>Email</strong></label>
                    <input type="email" placeholder='Enter Email' name='email' className='form-control rounded-0'
                    onChange={e => setValues({...values,email:e.target.value})}/>
                </div>
                <div className='mb-3'>
                    <label htmlFor="password"><strong>Password</strong></label>
                    <input type="password" placeholder='Enter Password' name='password' className='form-control rounded-0'
                    onChange={e => setValues({...values,password:e.target.value})}/>
                </div>

                <button type='submit' className='form-control rounded-0 btn btn-success w-100 mx-0'>Log in</button>
                <p>You are agree to our terms and policies</p>
                <Link to = "/register" className='form-control rounded-0 btn btn-secondary border w-100 rounded-0 text-decoration-none mx-0'>Create Account</Link>
                </form>
            </div>
        </div>
    );
}

export default Login
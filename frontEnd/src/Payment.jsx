import React from "react";
import { useNavigate } from 'react-router-dom';
import './Payment.css'; // Make sure to create and import this CSS file

function Payment() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    };
    return (
        <div> 
            
            <div className="payment-container">
                <h1>Payment Options</h1>
                <div className="payment-button" id="e-wallet">
                    <span>Electronic Wallet</span>
                </div>
                <div className="payment-button" id="banking">
                    <span>Banking</span>
                </div>
                <div className="payment-button" id="tuition">
                    <span>School Year Tuition</span>
                </div>
                <div className="payment-button" id="in-app">
                    <span>Payment in App</span>
                    </div>
                <div>
                    <button className="back-button"  onClick={handleBack}>Back</button>
                    
                </div>
            </div>
        </div>

    )
}

export default Payment;

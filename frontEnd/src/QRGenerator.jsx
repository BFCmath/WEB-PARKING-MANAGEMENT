import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

function QRGenerator() {
    const [studentId, setStudentId] = useState('');
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/'); // Navigate back to home page
    };

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        setStudentId(urlParams.get('student_id'));
    }, []);

    const handlePrintQR = () => {
        // Implement print functionality
        console.log('Print QR functionality to be implemented');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px', backgroundColor: '#f5f5f5', padding: '20px' }}>
            <h2 style={{ marginBottom: '40px' }}>Parking code for student</h2>
            {studentId ? (
                <QRCodeCanvas value={studentId.toString()} size={256} />
            ) : (
                <p>Loading...</p>
            )}
            <div style={{ marginTop: '40px' }}>
                <button onClick={handlePrintQR} style={{ marginRight: '10px', backgroundColor: 'gray', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>Print QR</button>
                <button onClick={handleBack} style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>Back</button>
            </div>
        </div>
    );
}

export default QRGenerator;

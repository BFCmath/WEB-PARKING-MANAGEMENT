import React,{useEffect, useState} from "react";
import { useNavigate,useLocation, useFetcher } from 'react-router-dom';
import './Payment.css'; // Make sure to create and import this CSS file
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Payment() {
    const location = useLocation(); 

    const student_id = (location.state?.studentId);
    const navigate = useNavigate();
    const [showPanel,setShowPanel] = useState(false);  
    const [walletBalance,setWalletBalance] = useState(0); // Assume this is the wallet balance
    const [moneyNeedToPay,setMoneyNeedToPay] = useState(0); // Assume this is the money need to pay
    const [remainingBalance,setRemainingBalance] = useState(0); // Assume this is the remaining balance
    const [changeMoneyStatus,setChangeMoneyStatus] = useState(false); // Assume this is the remaining balance
    const [parkingData, setParkingData] = useState([]); // Assume this is the parking data
    const handleBack = () => {
        navigate('/');
    };
    const handlePaymentInAppClick= ()=>{
        setShowPanel(true);
    };
    const handleClosePanelClick = ()=>{
        setShowPanel(false);
    };
    const handleClickBluePlusSign = ()=>{
        axios.post('http://localhost:3000/user-information/add-money', { 
            student_id: student_id,
            money_add: 10
        }, {withCredentials: true})
        .then(res => {
            console.log(res);
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000 
            });
            setChangeMoneyStatus(!changeMoneyStatus);
          })
        .catch(err => {
            console.log(err);
            toast.error(err.response.data.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000 
            });
          });
    };

      
    const handlePressPay = ()=>{
        console.log(parkingData);
        if(remainingBalance<0){
            toast.error("Not enough money", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000 
            });
            return;
        }
        axios.post('http://localhost:3000/parking-data/pay', {
            student_id: student_id,
            remainingBalance: remainingBalance
        }, {withCredentials: true})
        .then(res => {
            console.log(res);
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000 
            });
            setShowPanel(false);
          })
    }

    function formatAndAppendZeros(str) {
        if(str===0) return '0 VND';
        if(!str) return 'N/A';
        const newStr = str + '000';
        let reversedStr = newStr.split('').reverse().join('');
        reversedStr = reversedStr.replace(/(\d{3})(?=\d)/g, '$1.');
        return reversedStr.split('').reverse().join('') + ' VND';
    }
    useEffect(() => {
        if (!student_id) {
            console.log("no student_id yet");
            return;
        }
        const fetchData = () => {
            // Start both requests simultaneously
            const moneyPromise = axios.get(`http://localhost:3000/parking-data?student_id=${student_id}`, { withCredentials: true });
            const walletPromise = axios.get(`http://localhost:3000/user-information?student_id=${student_id}`, { withCredentials: true });
            
            // Use Promise.all to wait for both requests to finish
            Promise.all([moneyPromise, walletPromise]).then(responses => {
                const parkingRes = responses[0];
                const walletRes = responses[1];
                setParkingData(parkingRes.data);
                var totalPaid = parkingRes.data.reduce((total, record) => {
                    return record.is_paid === 0 ? total + Number(record.price) : total;
                }, 0);
                setMoneyNeedToPay(totalPaid);
                setWalletBalance(walletRes.data[0].saving);
            }).catch(error => {
                console.error(error);
            });
        };
        fetchData();
        const intervalId = setInterval(fetchData, 30000);
        return () => clearInterval(intervalId);
    }, [showPanel,changeMoneyStatus]);
    useEffect(() => {
        let money = walletBalance-moneyNeedToPay;
        setRemainingBalance(money);
    }, [moneyNeedToPay,walletBalance]);
    
    return (
        <div> 
            <ToastContainer position="bottom-left"/>
            {showPanel && <div className="overlay" onClick={handleClosePanelClick}></div>}
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
                <div className="payment-button" id="in-app" onClick={handlePaymentInAppClick}>
                    <span>Payment in App</span>
                    </div>
                <div>
                    <button className="back-button"  onClick={handleBack}>Back</button>
                    
                </div>
                    {showPanel && (
                    <div className="panel-container">
                        <table className="panel-table">
                            <tbody>
                                <tr className="panel-row">
                                    <td className="panel-label">
                                        Wallet balance
                                        <button className="green-plus-button" onClick={handleClickBluePlusSign}>+</button>
                                    </td>
                                    <td className="panel-value">
                                        {formatAndAppendZeros(walletBalance)}
                                    </td>

                                </tr>
                                <tr className="panel-row">
                                    <td className="panel-label">Money need to pay</td>
                                    <td className="panel-value">{formatAndAppendZeros(moneyNeedToPay)}</td>
                                </tr>
                                <tr className="panel-row">
                                    <td className="panel-label">Remain</td>
                                    <td className="panel-value">{remainingBalance>=0? formatAndAppendZeros(remainingBalance):"Not enough"}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="panel-actions">
                        <button className="close-button" onClick={handleClosePanelClick}>Close</button>
                        <button className="pay-button" onClick={handlePressPay}>Pay</button>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
}

export default Payment;

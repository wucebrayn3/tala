import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const Register = () => {
    const navigate = useNavigate(); 

    const handleRegisterClick = (e) => {
        e.preventDefault(); 
        navigate('/'); 
    };

    const styles = {
        body: {
            backgroundColor: '#ECDEFA',
            margin: 0,
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        logo: {
            display: 'block',
            margin: '0 auto',
            marginTop: '-70px',
            width: '300px',
            height: '300px',
            marginBottom: '-25px',
        },
        container: {
            width: '500px',
            height: '600px',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        input: {
            display: 'block',
            width: '100%',
            padding: '10px',
            margin: '10px 0',
            border: '1px solid #a1a1a1',
            borderRadius: '29px',
            fontSize: '12px',
            paddingLeft: '15px',
            boxSizing: 'border-box',
        },
        check: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '10px 0',
        },
        checkLabel: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
            color: '#000000',
            whiteSpace: 'nowrap',
            marginLeft: '40px',
        },
        checkInput: {
            marginRight: '5px',
            verticalAlign: 'middle',
            display: 'inline-block',
        },
        dobSection: {
            marginBottom: '15px',
        },
        dobLabel: {
            fontSize: '14px',
            color: '#333',
            fontWeight: 400,
            marginBottom: '5px',
            display: 'block',
        },
        dobInputs: {
            display: 'flex',
            gap: '17px',
        },
        dobSelect: {
            width: '30%',
            padding: '8px',
            border: '1px solid #a1a1a1',
            borderRadius: '29px',
            fontSize: '12px',
            boxSizing: 'border-box',
        },
    };

    return (
        <div style={styles.body}>
            <div style={styles.container}>
                <form>
                    <img src="/Images/logo.png" alt="Logo" style={styles.logo} />
                    <input type="email" placeholder='Enter email' style={styles.input} required />
                    <input type="text" placeholder='Enter username' style={styles.input} required /> 
                    <input type="password" placeholder='Enter password' style={styles.input} required /> 
                    <div style={styles.dobSection}>
                        <label style={styles.dobLabel}>Date of Birth</label>
                        <div style={styles.dobInputs}>
                            <select style={styles.dobSelect} required>
                                <option value="" disabled selected>Day</option>
                                {[...Array(31)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                            <select style={styles.dobSelect} required>
                                <option value="" disabled selected>Month</option>
                                {[
                                    'January', 'February', 'March', 'April', 'May', 'June',
                                    'July', 'August', 'September', 'October', 'November', 'December'
                                ].map((month, i) => (
                                    <option key={i + 1} value={i + 1}>{month}</option>
                                ))}
                            </select>
                            <select style={styles.dobSelect} required>
                                <option value="" disabled selected>Year</option>
                                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={styles.check}>
                        <label style={styles.checkLabel}>
                            <input type="checkbox" style={styles.checkInput} required />
                            I accept Terms, Services, and Policy
                        </label>
                    </div>
                    <button type="submit" style={styles.input} onClick={handleRegisterClick}>Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
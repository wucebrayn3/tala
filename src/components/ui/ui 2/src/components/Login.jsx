import React from 'react';
import { useNavigate } from 'react-router-dom'; 

function Login({ setIsAuthenticated }) { 
    const navigate = useNavigate(); 

    const handleLoginClick = (e) => {
        e.preventDefault(); 
        setIsAuthenticated(true); 
        navigate('/dashboard'); 
    };

    const handleSignUpClick = (e) => {
        e.preventDefault(); 
        navigate('/register'); 
    };

    const styles = {
        main: {
            backgroundColor: '#ECDEFA',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        logo: {
            display: 'block',
            margin: '0 auto',
            marginTop: '-90px',
            width: '300px',
            height: '300px',
            marginBottom: '-10px',
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
        options: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '10px 0',
        },
        label: {
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
            color: '#000000',
            whiteSpace: 'nowrap',
            marginLeft: '5px',
        },
        checkbox: {
            marginRight: '5px',
            verticalAlign: 'middle',
            display: 'inline-block',
        },
        forgetPassword: {
            background: 'none',
            border: 'none',
            color: '#007BFF',
            fontSize: '12px',
            cursor: 'pointer',
            textDecoration: 'underline',
        },
        forgetPasswordHover: {
            color: '#0056b3',
        },
        submitButton: {
            backgroundColor: '#6C21DC',
            color: 'white',
            border: 'none',
            borderRadius: '29px',
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            width: '100%',
        },
        submitButtonHover: {
            backgroundColor: '#5a1ab8',
        },
        signupSection: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '5px',
            fontWeight: '500',
            fontSize: '12px',
            color: '#000000',
        },
        signupButton: {
            background: 'none',
            border: 'none',
            color: '#000000',
            fontSize: '12px',
            marginTop: '2px',
            cursor: 'pointer',
            textDecoration: 'underline',
        },
    };

    return (
        <div style={styles.main}>
            <div style={styles.container}>
                <div className='login-form'>
                    <img src="/Images/logo.png" alt="Logo" style={styles.logo} /> 
                    <form>
                        <input type="text" placeholder='Enter username' required style={styles.input} />
                        <input type="password" placeholder='Enter password' required style={styles.input} />
                        
                        <div style={styles.options}>
                            <label style={styles.label}>
                                <input type="checkbox" style={styles.checkbox} />
                                Remember me?
                            </label>
                            <button type="button" style={styles.forgetPassword}>Forget password?</button>
                        </div>
                        
                        <button type="submit" onClick={handleLoginClick} style={styles.submitButton}>Login</button>
                        
                        <div style={styles.signupSection}>
                            <p>New to TALA?</p>
                            <button type="button" style={styles.signupButton} onClick={handleSignUpClick}>Sign up here</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
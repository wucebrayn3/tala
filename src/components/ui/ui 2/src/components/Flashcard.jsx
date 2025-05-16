import React from 'react';
import { useNavigate } from 'react-router-dom';

const Flashcard = () => {
  const navigate = useNavigate();

  const styles = {
    flashcard: {
      backgroundColor: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '20px',
      minHeight: '100vh',
      width: '100vw',
      boxSizing: 'border-box',
    },
    flashcardContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      width: '100%',
      fontSize: '40px',
      color: '#6C21DC',
      marginTop: '-300px',
    },
    flashcardContainerH2: {
      fontSize: '60px',
      color: '#6C21DC',
      marginBottom: '50px',
      marginTop: '250px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '50px',
      marginTop: '20px',
    },
    button: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '10px',
      width: '300px',
      height: '170px',
      border: '1px solid #ccc',
      backgroundColor: 'white',
      borderRadius: '8px',
      transition: 'transform 0.2s ease',
    },
    buttonHover: {
      transform: 'scale(1.05)',
      border: '2px solid #6C21DC',
    },
    buttonImg: {
      width: '60px',
      height: '60px',
      marginTop: '40px',
    },
    buttonP: {
      margin: 0,
      fontSize: '20px',
      color: 'black',
      paddingTop: '20px',
    },
  };

  return (
    <div style={styles.flashcard}>
      <div style={styles.flashcardContainer}>
        <h2 style={styles.flashcardContainerH2}>
          How do you want to create <br /> your flashcard set?
        </h2>
        <div style={styles.buttonContainer}>
          <div
            style={styles.button}
            onMouseEnter={(e) => (e.currentTarget.style.transform = styles.buttonHover.transform)}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            onClick={() => navigate('/upload')}
          >
            <img src="/Images/flashcard.png" alt="Profile" style={styles.buttonImg} />
            <p style={styles.buttonP}>Generate from Upload</p>
          </div>
          <div
            style={styles.button}
            onMouseEnter={(e) => (e.currentTarget.style.transform = styles.buttonHover.transform)}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            onClick={() => navigate('/create-flashcard')} 
          >
            <img src="/Images/design.png" alt="Profile" style={styles.buttonImg} />
            <p style={styles.buttonP}>Create Them Yourself</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
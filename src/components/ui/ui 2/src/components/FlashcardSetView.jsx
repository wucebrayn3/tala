
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const FlashcardSetView = () => {
    const { setId } = useParams();
    const navigate = useNavigate();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const allSets = JSON.parse(localStorage.getItem('createdFlashcardSets')) || [];
            const foundSet = allSets.find(set => set.id.toString() === setId);
            if (foundSet) {
                setFlashcardSet(foundSet);
            } else {
                console.error("Flashcard set not found with ID:", setId);
                // Optionally navigate to a 'not found' page or back to dashboard
                // navigate('/dashboard', { replace: true }); 
            }
        } catch (error) {
            console.error("Error loading flashcard set from localStorage:", error);
        } finally {
            setIsLoading(false);
        }
    }, [setId, navigate]);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        if (flashcardSet && currentCardIndex < flashcardSet.cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false); // Show term first for new card
        }
    };

    const handlePrevious = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(false); // Show term first for new card
        }
    };

    const styles = {
        container: {
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            color: '#333',
            maxWidth: '800px',
            margin: '90px auto 20px auto', // Adjusted top margin for navbar
            textAlign: 'center',
        },
        title: {
            fontSize: '2.5rem',
            color: '#6C21DC',
            marginBottom: '30px',
        },
        loadingText: {
            fontSize: '1.2rem',
            color: '#555',
        },
        notFoundText: {
            fontSize: '1.2rem',
            color: 'red',
            marginTop: '20px',
        },
        flashcardDisplay: {
            perspective: '1000px', // For 3D flip effect
            width: '100%',
            maxWidth: '500px',
            height: '300px',
            margin: '20px auto',
            cursor: 'pointer',
        },
        flashcardInner: {
            position: 'relative',
            width: '100%',
            height: '100%',
            textAlign: 'center',
            transition: 'transform 0.6s',
            transformStyle: 'preserve-3d',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            borderRadius: '10px',
        },
        flashcardFrontBack: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box',
            borderRadius: '10px',
            fontSize: '1.5rem',
        },
        flashcardFront: {
            backgroundColor: '#f0e6ff', // Light purple
            color: '#4A00E0',
        },
        flashcardBack: {
            backgroundColor: '#e6fff0', // Light green
            color: '#004d00',
            transform: 'rotateY(180deg)',
        },
        flipped: {
            transform: 'rotateY(180deg)',
        },
        cardProgress: {
            fontSize: '1rem',
            color: '#555',
            marginBottom: '20px',
        },
        navigationButtons: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '20px',
            maxWidth: '500px',
            margin: '20px auto',
        },
        button: {
            backgroundColor: '#6C21DC',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '10px 20px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            minWidth: '120px',
        },
        buttonDisabled: {
            backgroundColor: '#ccc',
            cursor: 'not-allowed',
        },
        backButton: {
            display: 'inline-block',
            marginTop: '30px',
            backgroundColor: '#555',
        }
    };

    if (isLoading) {
        return <div style={styles.container}><p style={styles.loadingText}>Loading flashcard set...</p></div>;
    }

    if (!flashcardSet) {
        return (
            <div style={styles.container}>
                <p style={styles.notFoundText}>Flashcard set not found.</p>
                <button style={{...styles.button, ...styles.backButton}} onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>
        );
    }
    
    const currentCard = flashcardSet.cards[currentCardIndex];

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{flashcardSet.title}</h1>
            
            <div style={styles.flashcardDisplay} onClick={handleFlip}>
                <div style={{ ...styles.flashcardInner, ...(isFlipped ? styles.flipped : {}) }}>
                    <div style={{ ...styles.flashcardFrontBack, ...styles.flashcardFront }}>
                        {currentCard.term}
                    </div>
                    <div style={{ ...styles.flashcardFrontBack, ...styles.flashcardBack }}>
                        {currentCard.description}
                    </div>
                </div>
            </div>

            <p style={styles.cardProgress}>
                Card {currentCardIndex + 1} of {flashcardSet.cards.length}
            </p>

            <div style={styles.navigationButtons}>
                <button 
                    style={{...styles.button, ...(currentCardIndex === 0 ? styles.buttonDisabled : {})}} 
                    onClick={handlePrevious} 
                    disabled={currentCardIndex === 0}
                >
                    Previous
                </button>
                <button 
                    style={{...styles.button, ...(currentCardIndex === flashcardSet.cards.length - 1 ? styles.buttonDisabled : {})}} 
                    onClick={handleNext} 
                    disabled={currentCardIndex === flashcardSet.cards.length - 1}
                >
                    Next
                </button>
            </div>

            <button style={{...styles.button, ...styles.backButton}} onClick={() => navigate('/dashboard')}>
                Back to Dashboard
            </button>
        </div>
    );
};

export default FlashcardSetView;

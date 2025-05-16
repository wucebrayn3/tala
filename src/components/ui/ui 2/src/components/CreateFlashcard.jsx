
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateFlashcard = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [flashcards, setFlashcards] = useState([{ term: '', description: '' }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title for the flashcard set.');
      return;
    }
    if (flashcards.some(fc => !fc.term.trim() || !fc.description.trim())) {
      alert('Please ensure all flashcards have both a term and a description.');
      return;
    }

    const newSet = {
      id: Date.now().toString(), // Ensure ID is a string for consistency with URL params
      title: title,
      cardCount: flashcards.length,
      dateCreated: new Date().toLocaleDateString(),
      cards: flashcards, // Save the actual flashcard term/description pairs
    };

    try {
      const existingSets = JSON.parse(localStorage.getItem('createdFlashcardSets')) || [];
      const updatedSets = [...existingSets, newSet];
      localStorage.setItem('createdFlashcardSets', JSON.stringify(updatedSets));
      
      setTitle('');
      setFlashcards([{ term: '', description: '' }]);
      alert('Flashcard set created successfully!');
      navigate('/dashboard');

    } catch (error) {
      console.error("Error saving flashcard set to localStorage:", error);
      alert('Failed to save flashcard set. Please try again.');
    }
  };

  const handleFlashcardChange = (index, field, value) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[index][field] = value;
    setFlashcards(updatedFlashcards);
  };

  const addFlashcard = () => {
    if (flashcards.length < 20) {
      setFlashcards([...flashcards, { term: '', description: '' }]);
    } else {
      alert('You can only add up to 20 flashcards per set.');
    }
  };

  const removeFlashcard = (index) => {
    if (flashcards.length > 1) {
        const updatedFlashcards = flashcards.filter((_, i) => i !== index);
        setFlashcards(updatedFlashcards);
    } else {
        alert('Each set must have at least one flashcard.');
    }
  };

  return (
    <div className="create-flashcard-container">
      <style>
        {`

        h1 {
          text-align: center;   
            font-size: 36px;
            color: #6C21DC;
            margin-top: 100px;
            margin-bottom: 80px;
        }
        
          .create-flashcard-container {
            text-align: center;
            padding: 50px;
            min-height: calc(100vh - 70px); /* Adjust for navbar */
            box-sizing: border-box;
          }

          .flashcard-form {
            width: 600px;
            max-width: 1000px;
            margin: 0 auto;
            text-align: left;
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }

          .form-group {
            margin-bottom: 20px;
            width: 100%; /* Adjusted from 550px to be responsive within form */
          }

          .form-label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
          }

          .form-input, .form-textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
            box-sizing: border-box;
          }

          .form-textarea {
            resize: vertical; /* Allow vertical resize */
            min-height: 60px; /* Minimum height */
            height: 80px; /* Default height */
          }

          .flashcard-item {
            margin-bottom: 20px;
            border: 1px solid #e0e0e0;
            padding: 15px;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          
          .flashcard-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }

          .flashcard-item-header h3 {
            font-size: 18px;
            color: #6C21DC;
            margin: 0;
          }

          .remove-button {
            padding: 6px 12px;
            background-color: #ff4d4d;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }

          .remove-button:hover {
            background-color: #e60000;
          }
          
          .form-actions {
            display: flex;
            justify-content: space-between; /* Align buttons */
            align-items: center;
            margin-top: 30px;
          }

          .add-button, .submit-button {
            padding: 12px 25px;
            color: white;
            border: none;
            border-radius: 29px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          
          .add-button {
            background-color: #21DC6C; /* Green for add */
          }
          .add-button:hover {
            background-color: #1aa854;
          }

          .submit-button {
            background-color: #6C21DC; /* Purple for submit */
          }
          .submit-button:hover {
            background-color: #5a1ab8;
          }
        `}
      </style>
      <h1>Create Your Flashcards</h1>
      <form onSubmit={handleSubmit} className="flashcard-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title of the Flashcard Set
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Chapter 1: Biology Basics"
            className="form-input"
            required
          />
        </div>

        {flashcards.map((flashcard, index) => (
          <div key={index} className="flashcard-item">
            <div className="flashcard-item-header">
              <h3>Flashcard {index + 1}</h3>
              {flashcards.length > 1 && (
                 <button
                  type="button"
                  onClick={() => removeFlashcard(index)}
                  className="remove-button"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="form-group">
              <label htmlFor={`term-${index}`} className="form-label">
                Term
              </label>
              <input
                id={`term-${index}`}
                type="text"
                value={flashcard.term}
                onChange={(e) => handleFlashcardChange(index, 'term', e.target.value)}
                placeholder="Enter term (e.g., Mitochondria)"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor={`description-${index}`} className="form-label">
                Definition/Description
              </label>
              <textarea
                id={`description-${index}`}
                value={flashcard.description}
                onChange={(e) => handleFlashcardChange(index, 'description', e.target.value)}
                placeholder="Enter definition or description (e.g., The powerhouse of the cell)"
                className="form-textarea"
                required
              />
            </div>
          </div>
        ))}
        
        <div className="form-actions">
          <button
            type="button"
            onClick={addFlashcard}
            className="add-button"
            disabled={flashcards.length >= 20}
          >
            Add Another Card
          </button>

          <button
            type="submit"
            className="submit-button"
          >
            Create Flashcard Set
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFlashcard;

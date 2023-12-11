import React, { useState } from 'react';
import {isValidHyperlink} from "./commonHelper.js";
import axios from 'axios';
import { makeUrl } from './utils/makeUrl.js';

function AddAnswer({ questionID, addNewAnswer }) {
    const [answerText, setAnswerText] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        let error = validateAnswer(answerText);

        if (!error) {
            try {
                const newAns = {text: answerText, qid: questionID}
                const response = await axios.post(makeUrl('answers'), newAns, {withCredentials: true});
                addNewAnswer(response.data, questionID);
    
                setAnswerText('');
            } catch (error) {
                console.error('Error adding answers:', error);
            }
            

            // displayAnswers(questionId);
        }
    };



    const validateAnswer = (answerText, username) => {
        setError('');

        let error = '';

        if (answerText === '' && username === '') {
            error = 'Answer text and username cannot be empty.';
        } else if (answerText === '') {
            error = 'Answer text cannot be empty';
        } else if (!isValidHyperlink(answerText)) {
            error = 'Invalid hyperlink';
        }
        setError(error);
        return error;
    };

    return (
        <form id="answer-form" onSubmit={handleSubmit}>

            <label htmlFor="ansTextInput" className="ansTextInput">
                Answer Text*
            </label>
            <input
                id="answerTextInput"
                type="text"
                placeholder="Your Answer"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
            />

            <button id="post-answer" type="submit">
                Post Answer
            </button>

            <div className="mandatory-field">* indicates mandatory fields</div>
            {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
        </form>
    );
}

export default AddAnswer;

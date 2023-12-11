import React, { useState } from 'react';
import {isValidHyperlink} from "./commonHelper";
import axios from 'axios';
import { makeUrl } from './utils/makeUrl.js';

function AddQuestion({ onAddQuestion }) {
    console.log('add question page pressed');

  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionTags, setNewQuestionTags] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newQuestionSummary, setNewQuestionSummary] = useState('');

  const handlePostQuestion = async () => {
    if (!newQuestionTitle) {
      setErrorMessage('Title cannot be empty. ');
      return;
    }
    if (newQuestionTitle.length > 100) {
        setErrorMessage('Title cannot be more than 100 characters. ');
        return;
    }
    if (!newQuestionSummary) {
      setErrorMessage('Summary cannot be empty. ');
      return;
    }
    if (!newQuestionText) {
        setErrorMessage('Question text cannot be empty. ');
        return;
    }
    if(!isValidHyperlink(newQuestionText)) {
      setErrorMessage('Invalid hyperlink');
    }

    const enteredTags = newQuestionTags.split(' ');
    if (enteredTags.length > 5) {
      setErrorMessage('Cannot have more than 5 tags. ');
      return;
    }
    if (enteredTags.some(tag => tag.length > 20)) {
      setErrorMessage('New tag length cannot be more than 20. ');
      return;
    }
    if(!isValidHyperlink(newQuestionText)) {
        setErrorMessage('Invalid hyperlink');
    }

    else {
      try {
        const newQues = {title: newQuestionTitle, text: newQuestionText, summary: newQuestionSummary, tags: enteredTags}
        const response = await axios.post(makeUrl('questions'), newQues, {withCredentials: true});
        console.log(response.data);
        onAddQuestion(response.data);

          setNewQuestionTitle('');
          setNewQuestionText('');
          setNewQuestionSummary('');
          setNewQuestionTags('');
          setErrorMessage('');
      } catch(error) {
        setErrorMessage(error.response ? error.response.data.error : 'An error occurred while adding the question.');
      }
      
    }
  };

  return (
    <div className="new-question-form">
      {/* <h3 id="formTitle">Add a New Question</h3> */}
      <label htmlFor="formTitleInput" className="formTitleInput">
        Question Title*
      </label>
      <input
        type="text"
        placeholder="Question Title"
        id="formTitleInput"
        value={newQuestionTitle}
        onChange={(e) => setNewQuestionTitle(e.target.value)}
      />
      <label htmlFor="formSummaryInput" className="formSummaryInput">
        Question Summary*
      </label>
      <input
        type="text"
        placeholder="Summary"
        id="formSummaryInput"
        value={newQuestionSummary}
        onChange={(e) => setNewQuestionSummary(e.target.value)}
      />
      <label htmlFor="formTextInput" className="formTextInput">
        Question Text*
      </label>
      <textarea
        placeholder="Question Text"
        id="formTextInput"
        value={newQuestionText}
        onChange={(e) => setNewQuestionText(e.target.value)}
      />
      <label htmlFor="formTagInput" className="formTagInput">
        Tags* (max 5, separated by spaces)
      </label>
      <input
        type="text"
        placeholder="Tags (separated by spaces)"
        id="formTagInput"
        value={newQuestionTags}
        onChange={(e) => setNewQuestionTags(e.target.value)}
      />
      <button id="post-question" onClick={handlePostQuestion}>
        Post Question
      </button>
      {errorMessage && <span className="error-message">{errorMessage}</span>}
      <div className="mandatory-field">* indicates mandatory fields</div>
    </div>
  );
}

export {AddQuestion};

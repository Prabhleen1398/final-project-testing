import React, { useState } from "react";
import axios from "axios";
import { makeUrlId } from "./utils/makeUrl";

const UserAnswers = ({ userAnswers, onEditAnswer, onDeleteAnswer }) => {
  const [editedAnswerText, setEditedAnswerText] = useState("");

  const handleEditInput = (e) => {
    setEditedAnswerText(e.target.value);
  };

  const handleEditSubmit = async (answerId) => {

    try {
      await axios.put(makeUrlId("answers", answerId), { text: editedAnswerText }, { withCredentials: true });
      console.log(`Successfully edited answer with ID ${answerId}`);
      const updatedUserAnswers = userAnswers.map((answer) => (answer._id === answerId ? { ...answer, text: editedAnswerText } : answer));
      onEditAnswer(updatedUserAnswers); // Update state with edited answers
      setEditedAnswerText(""); // Clear edit input after successful update
    } catch (error) {
      console.error("Error editing answer:", error);
    }
  };

  const handleDelete = async (answerId) => {
    try {
      await axios.delete(makeUrlId("answers", answerId), { withCredentials: true });
      const updatedUserAnswers = userAnswers.filter((answer) => answer._id !== answerId);
      onDeleteAnswer(updatedUserAnswers);
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  return (
    <div>
      <h2>Your Answers ({userAnswers.length})</h2>
      <ul>
        {userAnswers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((answer) => (
          <li key={answer._id}>
            <span id="my-answer-text">{answer.text.substring(0, 50)}</span>
            <input
              id="answerTextInput"
              type="text"
              value={editedAnswerText || answer.text}
              onChange={ (e) => handleEditInput(e)}
            />
            <button onClick={() => handleEditSubmit(answer._id)} disabled={!editedAnswerText || editedAnswerText === answer.text}>
              Re-post
            </button>
            <button onClick={() => handleDelete(answer._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { UserAnswers };

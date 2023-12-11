import React, { useState } from "react";
import { NewQuestionPage } from "./newUserQuestionPage";

const UserQuestions = ({ userQuestions, onEditQuestion, onDeleteQuestion }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
  };

  const editQuestion = (updatedQuestions) => {
    onEditQuestion(updatedQuestions);
  };
  

  const deleteQuestion = (updatedQuestions) => {
    onDeleteQuestion(updatedQuestions);
  };
  
  // Check if userQuestions is an array before sorting
  const sortedQuestions = Array.isArray(userQuestions)
    ? userQuestions.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time))
    : [];

  return (
    <div>
      <h2>Your Questions ({userQuestions.length})</h2>
      <ul>
        {sortedQuestions.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time)).map((question) => (
          <li key={question._id}>
            <a onClick={() => handleQuestionClick(question._id)}>
              {question.title}
            </a>
          </li>
        ))}
      </ul>
      {selectedQuestion && <NewQuestionPage questionId={selectedQuestion} onEditQuestion={editQuestion} onDeleteQuestion={deleteQuestion} />}
    </div>
  );
};

export { UserQuestions };

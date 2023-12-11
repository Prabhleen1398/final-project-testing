import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeUrlId } from "./utils/makeUrl";

const NewQuestionPage = ({ questionId, onEditQuestion, onDeleteQuestion }) => {
  const [question, setQuestion] = useState({ title: "", text: "", summary: "", last_activity: ""});

  useEffect(() => {
    console.log("question id inside useEffect = " + questionId);
    if (questionId) {
      axios.get(makeUrlId("questions", questionId)).then((response) => {
        setQuestion(response.data);
      });
    }
  }, [questionId]);

  const handleEditInput = (event, field) => {
      setQuestion({ ...question, [field]: event.target.value });
  };

  const handleEditSubmit = async () => {
    //event.preventDefault();
    console.log("question id = " + questionId);
    try {
      await axios.put(makeUrlId("questions", questionId), { title: question.title, text: question.text, summary: question.summary, last_activity: new Date() }, { withCredentials: true });
      onEditQuestion(question); // Update state with edited question
      alert("Question updated successfully!");
    } catch (error) {
      console.error("Error editing question:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(makeUrlId("questions", questionId), { withCredentials: true });
      onDeleteQuestion(questionId); // Update state with deleted question
      alert("Question deleted successfully!");
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <div>
      <h3>{question.title}</h3>
      <form onSubmit={handleEditSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="questionTitle"
          value={question.title}
          onChange={(event) => handleEditInput(event, "title")}
        />
        <br />
        <label htmlFor="text">Question Text:</label>
        <textarea
          id="text"
          value={question.text}
          onChange={(event) => handleEditInput(event, "text")}
        />
        <br />
        <label htmlFor="summary">Summary:</label>
        <input
          type="text"
          id="summary"
          value={question.summary}
          onChange={(event) => handleEditInput(event, "summary")}
        />
        <br />
        <button type="submit">Save</button>
      </form>
      <button onClick={handleDelete}>Delete Question</button>
    </div>
  );
};

export { NewQuestionPage };

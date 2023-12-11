import React, { useState } from "react";
import { makeUrl } from "./utils/makeUrl.js";
import axios from "axios";
import { UserTags } from "./userTags.js";
import { UserAnswers } from "./userAnswers.js";
import { UserQuestions } from "./userQuestions.js";

const UserProfile = ({ userDetail }) => {
  const [questionsVisible, setQuestionsVisible] = useState(false);
  const [answersVisible, setAnswersVisible] = useState(false);
  const [tagsVisible, setTagsVisible] = useState(false);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [userTags, setUserTags] = useState([]);

  const [activeSection, setActiveSection] = useState(null);

  const handleViewQuestions = async () => {

    try {
      const response = await axios.get(makeUrl("users/userQuestions"), {withCredentials: true});
      const questions = response.data;
      setUserQuestions(questions);
      console.log(questions);
      setActiveSection('questions');
      setQuestionsVisible(true);
      setAnswersVisible(false);
      setTagsVisible(false);
    } catch (error) {
        console.error("Error fetching questions:", error);
      }
  };

  const handleViewAnswers = async () => {
    try {
      const response = await axios.get(makeUrl("users/userAnswers"), {withCredentials: true});
      const answers = response.data;
      setUserAnswers(answers);
      console.log(answers);
      setActiveSection('answers');
      setQuestionsVisible(false);
      setAnswersVisible(true);
      setTagsVisible(false);
    } catch (error) {
        console.error("Error fetching answers:", error);
    }  
  };

  const handleViewTags = async () => {
    try {
      const response = await axios.get(makeUrl("users/userTags"), {withCredentials: true});
      const tags = response.data;
      setUserTags(tags);
      console.log(tags);
      setActiveSection('tags');
      setQuestionsVisible(false);
      setAnswersVisible(false);
      setTagsVisible(true);
    } catch (error) {
      console.error("Error fetching tags:", error);
     }   
  };

  const calculateDaysSince = (joinDate) => {
    const currentDate = new Date();
    const formattedJoinDate = new Date(joinDate);

    const daysSince = Math.floor((currentDate - formattedJoinDate) / (24 * 60 * 60 * 1000));
    return daysSince;
  };

  const onEditTag = (tags) => {
    setUserTags(tags);
    setActiveSection("tags");
    setQuestionsVisible(false);
    setAnswersVisible(false);
    setTagsVisible(true);
  };

  const onDeleteTag = (tags) => {
    setUserTags(tags);
    setActiveSection("tags");
    setQuestionsVisible(false);
    setAnswersVisible(false);
    setTagsVisible(true);
  };

  const onEditAnswer = (answers) => {
    setUserAnswers(answers);
    setActiveSection("answers");
    setQuestionsVisible(false);
    setAnswersVisible(true);
    setTagsVisible(false);
  };

  const onDeleteAnswer = (answers) => {
    setUserAnswers(answers);
    setActiveSection("answers");
    setQuestionsVisible(false);
    setAnswersVisible(true);
    setTagsVisible(false);
  };

  const onEditQuestion = (questions) => {
    setUserQuestions(questions);
    setActiveSection("questions");
    setQuestionsVisible(true);
    setAnswersVisible(false);
    setTagsVisible(false);
  };

  const onDeleteQuestion = (questions) => {
    setUserQuestions(questions);
    setActiveSection("questions");
    setQuestionsVisible(true);
    setAnswersVisible(false);
    setTagsVisible(false);
  };


  return (
    <div className="user-profile">
      <h2>{userDetail.user} profile</h2>
      <p>Member since: {calculateDaysSince(userDetail.register_date)} days</p>
      <p>Reputation: {userDetail.reputation}</p>
      <hr />
      <h3>Menu</h3>
      <ul>
        <li onClick={handleViewQuestions}>My Questions</li>
        <li onClick={handleViewAnswers}>My Answers</li>
        <li onClick={handleViewTags}>My Tags</li>
      </ul>
      {/* {activeSection === 'questions' && questionsVisible && <Questions questions={userQuestions} />} */}
      {activeSection === "questions" && questionsVisible && <UserQuestions userQuestions={userQuestions} onEditQuestion={onEditQuestion} onDeleteQuestion={onDeleteQuestion} />}
      {/* {activeSection === 'answers' && answersVisible && <Answers answers={userAnswers} />} */}
      {activeSection === "answers" && answersVisible && <UserAnswers userAnswers={userAnswers} onEditAnswer={onEditAnswer} onDeleteAnswer={onDeleteAnswer} />}
      {/* {activeSection === 'tags' && tagsVisible && <Tags tags={userTags} />} */}
      {activeSection === 'tags' && tagsVisible && <UserTags userTags={userTags} onEditTag={onEditTag} onDeleteTag={onDeleteTag} />}
    </div>
  );
};

// const Questions = ({ questions }) => (
//   <div>
//     <h2>Questions ({questions.length})</h2>
//     <ul>
//       {questions.map((question) => (
//         <li key={question.id}>
//           <a href={`/questions/${question.id}`}>{question.title}</a>
//         </li>
//       ))}
//     </ul>
//   </div>
// );

export default UserProfile;

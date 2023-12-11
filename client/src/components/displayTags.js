import React, { useEffect, useState } from "react";
import axios from 'axios';
import {makeUrl, makeUrlId} from './utils/makeUrl.js';

function DisplayTags({handleShowNewQuestionForm, showQuestion, isGuest}) {
  const [tags, setTags] = useState([]);
  const [tagQuestions, setTagQuestions] = useState([]);

  useEffect(() => {
    const fetchDataTags = async () => {
      try {
        const tagsResponse = await axios.get(makeUrl('tags'));
        setTags(tagsResponse.data);

      } catch (error) {
        console.error('Error fetching tags or questions:', error);
      }
    };
  
    fetchDataTags();
}, []);  

useEffect(() => {
  const fetchQuestionsForTag = async (tagId) => {
    try {
      const questionsPerTag = await axios.get(makeUrlId('tags/getQuestionsForTag', tagId));
      console.log("Questions for this tag = ", questionsPerTag.data);
      setTagQuestions((prev) => ({ ...prev, [tagId]: questionsPerTag.data }));
    } catch (error) {
      console.error('Error fetching tags or questions:', error);
    }
  };

  tags.forEach((tag) => {
    fetchQuestionsForTag(tag._id);
  });
}, [tags]);


console.log(tags);       

  return (
    <div className="tags">
      {setTagsHeader(tags, handleShowNewQuestionForm, isGuest)}
      {setIndividualTags(tags, showQuestion, tagQuestions)}
    </div>
  );
}

function setTagsHeader(tags, handleShowNewQuestionForm, isGuest) {
  return (
    <div id="tag-page-heading">
      <div className="tags-header-text">
        <div className="num-tags-heading">
          <h1>{tags.length} Tags</h1>
        </div>
        <div className="text-tag-heading">
          <h1>All Tags</h1>
        </div>
      </div>
      {!isGuest && (
          <button id="ask-question" className="new-question-button" onClick={handleShowNewQuestionForm}>
            Ask a Question
          </button>
      )}
    </div>
  );
}

function setIndividualTags(tags, showQuestion, tagQuestions) {
  return (
    <div className="tag-questions-container" id="tag-questions-container">
      {tags.map((tag, index) => (
        <div key={index} className="tag-outer-box">
          <div id={index} className="tagNode">
            <a className="tag-name" onClick={() => showQuestion(tagQuestions[tag._id])}>
              {tag.name}
            </a>
            <div className="tag-count">
            {tagQuestions[tag._id] && tagQuestions[tag._id].length !== undefined
                ? `${tagQuestions[tag._id].length} question`
                : 'Loading...'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// async function getQuestionsForTag(id) {
//   try {
//     const questionsPerTag = await axios.get(makeUrlId('tags/getQuestionsForTag', id));
//     //  console.log(questionsPerTag.data);
//     return questionsPerTag.data; 
//   } catch (error) {
//     console.error('Error fetching tags or questions:', error);
//   }
// }
  
  // const fetchQue = async () => {
  //   try {
  //     const questionsPerTag = await axios.get(makeUrlId('tags/getQuestionsForTag', id));
  //     return questionsPerTag;
  //   } catch (error) {
  //     console.error('Error fetching tags or questions:', error);
  //   }
  // };

  
  // // console.log(questions);
  // fetchQue();
  // return questions.filter((question) => {
  //   const tagNames = question.tags.map(tag => tag.name);
  
  //   return tagNames.some(tagName => tagName.includes(name));
  
    // return questions.filter((question) => question.tags.id.includes(tagId));
    // return questions.filter((question) => 
    //     question.tags.some((tag) => tag.id === tagId)
    // );
// }
  

export {DisplayTags};

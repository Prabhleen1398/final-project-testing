import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeUrlSort } from './utils/makeUrl';


function DisplayQuestions({questions, handleShowNewQuestionForm, headerText, onQuestionClick, isGuest }) {

  const [sortedQuestions, setSortedQuestions] = useState([]);
  const questionsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(sortedQuestions.length / questionsPerPage);

  const handleNextPage = () => {
    // setCurrentPage((prevPage) => (prevPage === totalPages ? 1 : prevPage + 1));
    setCurrentPage((prevPage) => {
      const nextPage = prevPage === totalPages ? 1 : prevPage + 1;
      return nextPage;
    });
  };
  
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage === 1 ? totalPages : prevPage - 1));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const sortBy = {'sort': 'newest', 'questions': questions};
        const questionIds = questions.map(question => question._id);
        // console.log(questionIds);
        console.log(makeUrlSort('util', 'newest', questionIds));
        const response = await axios.get(makeUrlSort('util', 'newest', questionIds));
        setSortedQuestions(response.data);
      } catch (error) {
        console.error('Error fetching sorted questions:', error);
      }
    };

    fetchData();
    //setSortedQuestions(questions);
  }, [questions]);
  
  const sortQuestions = async (sort) => {
    try {
      // const sortBy = {'sort': sort, 'questions': questions};
      // const response = await axios.get(makeUrlSort('util', sortBy));
      // setSortedQuestions(response.data);

      const questionIds = questions.map(question => question._id);
      console.log(makeUrlSort('util', 'newest', questionIds));
      const response = await axios.get(makeUrlSort('util', sort, questionIds));
      setSortedQuestions(response.data);

      console.log("sort = " + `${sort}`);
      console.log(sortedQuestions);

    } catch (error) {
      console.error('Error fetching sorted questions:', error);
    }
  };

  const handleQuestionClick = (questionId) => {
    console.log(`${questionId} question pressed in questions`);
    onQuestionClick(questionId);
  };

  const setHeaderText = () => {
      if (sortedQuestions.length === 0) {
          headerText = 'No Questions Found';
      }
        return headerText
    }

    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;

    const displayQuestions = sortedQuestions.slice(startIndex, endIndex);
    

    console.log("Questions list:- ");
    console.log(sortedQuestions);

  return (
    <div className="questions">
      <div className="questions-header ">
        <div className='question-header-top'>
            <h3 className='questions-title-text'>{setHeaderText()}</h3>
            {!isGuest && (
            <button id="ask-question" className="new-question-button" onClick={handleShowNewQuestionForm}>
              Ask a Question
            </button>
          )}
        </div>
          <div className="question-header-bottom">
            <div className="num-questions">{sortedQuestions.length} questions</div>
            <div>
              <div className="sort-order">
                  <button className="button-sort" onClick={() => sortQuestions('newest')}>
                  Newest
                  </button>
                  <button className="button-sort" onClick={() => sortQuestions('active')}>
                    Active
                  </button>
                  <button className="button-sort" onClick={() => sortQuestions('unanswered')}>
                    Unanswered
                  </button>
              </div>
            </div>
          </div>
      </div>
      <div>
      <div className="questions-display" id="questions-to-display">
        {displayQuestions.map((question, index) => (
          <div
            key={question._id || index}
            className="question-individual"
            onClick={() => handleQuestionClick(question._id)}
          >
            <div className="postStats">
              <div className="que-count">{`${question.answers.length} answers`}</div>
              <div className="que-view">{`${question.views} views`}</div>
              <div className='que-votes'>{`${question.votes} votes`}</div>
            </div>
            <div className="postTitle">
              <div className="que-title">{question.title}</div>
              <div className='que-summary'>{question.summary}</div>
              <div className="que-tags">
                {question.tags.map((tag, index) => (
                  <div className="question-tag" key={tag._id || index}>
                    {/* {tags.find((tag) => tag.id === tagId)?.tagName} */}
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="lastActivity">
                <span className="que-author"> {question.asked_by.username} </span>
              <span className="que-asked-time">
                {formatQueAskTime(new Date(question.ask_date_time))}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination-buttons">
        <button id='que-prev' onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button id='que-next'
        onClick={handleNextPage} disabled={sortedQuestions.length <= questionsPerPage}>
          Next
        </button>
      </div>
      </div>
    </div>
  );
}

function formatQueAskTime(askDate) {
    const ONE_SECOND = 1000;
    const ONE_MINUTE = 60 * ONE_SECOND;
    const ONE_HOUR = 60 * ONE_MINUTE;
    const ONE_DAY = 24 * ONE_HOUR;
    const ONE_YEAR = 365 * ONE_DAY;

    const currTime = Date.now();
    const timeDifference = currTime - askDate.getTime();

    if (timeDifference < ONE_MINUTE) {
        const secondsAgo = Math.floor(timeDifference / ONE_SECOND);
        return `asked ${secondsAgo} second${secondsAgo === 1 ? '' : 's'} ago`;
    } else if (timeDifference < ONE_HOUR) {
        const minutesAgo = Math.floor(timeDifference / ONE_MINUTE);
        return `asked ${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
    } else if (timeDifference < ONE_DAY) {
        const hoursAgo = Math.floor(timeDifference / ONE_HOUR);
        return `asked ${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
    } else if (timeDifference < ONE_YEAR) {
        const postingDate = new Date(askDate.getTime());
        const month = postingDate.toLocaleString('default', { month: 'short' });
        const day = postingDate.getDate();
        const timeString = postingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const formattedDay = (day < 10 ? '0' : '') + day;
        return `asked ${month} ${formattedDay} at ${timeString}`;
    } else {
        const postingDate = new Date(askDate.getTime());
        const month = postingDate.toLocaleString('default', { month: 'short' });
        const day = postingDate.getDate();
        const year = postingDate.getFullYear();
        const timeString = postingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12 : false });
        const formattedDay = (day < 10 ? '0' : '') + day;
        return `asked ${month} ${formattedDay}, ${year} at ${timeString}`;
    }
}

export { DisplayQuestions, formatQueAskTime };

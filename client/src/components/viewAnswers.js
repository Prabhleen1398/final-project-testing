import React, { useState, useEffect } from 'react';
import {processTextWithHyperlinks, formatAnsAskedTime} from "./commonHelper.js";
import axios from 'axios';
import { makeUrlId, makeUrl } from './utils/makeUrl.js';
import { QuestionDetail } from './questionDetails.js';

function AnswersPage({questionID, showNewAnswersForm, handleShowNewQuestionForm, isGuest, currentUser }) {
    const [question, setQuestion] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [commentsPagination, setCommentsPagination] = useState({});
    const [isGuestLogin] = useState(isGuest);
    const [sortedAnswers, setSortedAnswers] = useState([]);
    const [userDetails] = useState(currentUser);
    const [ansError, setAnsError] = useState('');
    const [error, setMainError] = useState('');
    const request = axios.create({
      withCredentials : true
    });
    // question.increaseView();
    const fetchData = () => {
      setLoading(true);

      
      request
        .get(makeUrlId('questions', questionID))
        .then((response) => {
          setQuestion(response.data);
          const acceptedAnswer = response.data.accepted_ans
        ? response.data.answers.find((answer) => answer._id === response.data.accepted_ans)
        : null;

      if (acceptedAnswer) {
        // Remove the accepted answer from its current position
        const updatedAnswers = response.data.answers.filter((answer) => answer._id !== acceptedAnswer._id);

        // Insert the accepted answer at the beginning
        updatedAnswers.unshift(acceptedAnswer);

        setSortedAnswers(updatedAnswers);
      } else {
        // If no accepted answer, set the answers as they are
        setSortedAnswers(response.data.answers);
      }

      setLoading(false);
      console.log("question fetched:-");
      console.log(response.data);
        })
        .catch((error) => {
          setLoading(false);
          setMainError('Error fetching questions:');
          console.error('Error fetching questions:', error);
        });
    };

    //increment views
    const incrementViews = async () => {
        try {
          await axios.put(makeUrlId('util', questionID));
        } catch (error) {
          setAnsError('Error incrementing views:', error)
          console.error('Error incrementing views:', error);
        }
      };

    useEffect(() => {
        fetchData();
        incrementViews();
    }, [questionID]);

    useEffect(() => {
      // Set a timer to hide the error message after 5000 milliseconds (adjust the time as needed)
      const timer = setTimeout(() => {
        setAnsError(null);
      }, 5000);
  
      // Clear the timer if the component unmounts before the timer expires
      return () => clearTimeout(timer);
    }, [ansError]);

    useEffect(() => {
      // This code will run whenever 'question' state is updated
      const acceptedAnswer = question.accepted_ans
        ? question.answers.find((answer) => answer._id === question.accepted_ans)
        : null;
  
      if (acceptedAnswer) {
        const updatedAnswers = question.answers.filter((answer) => answer._id !== acceptedAnswer._id);
        updatedAnswers.unshift(acceptedAnswer);
        setSortedAnswers(updatedAnswers);
      }
    }, [question]); 

    const displayAnswers = () => {
        console.log('Answers page is pressed');
        console.log(question)

        
        const answersPerPage = 5;
        const totalPages = Math.ceil(question.answers.length / answersPerPage);

        const startIndex = (currentPage - 1) * answersPerPage;
        const endIndex = startIndex + answersPerPage;

        const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        };

        const handleNextPage = () => {
        // setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
        setCurrentPage((prevPage) => {
          const nextPage = prevPage === totalPages ? 1 : prevPage + 1;
          return nextPage;
        });
        };

        const commentsPerPage = 3;
        const handleCommentUpvoteAnswer = (answerId, commentId) => {
            // Implement your upvoting logic for comments here
            console.log(answerId, commentId);
            if(!isGuest) {
            request.put(makeUrlId('answers/comment/vote', commentId))
            .then((response) => {
              console.log(response.data);
              setQuestion(response.data);
            })
            .catch((error) => {
              // setLoading(false);
              setAnsError(error.response.data.error);
              console.error('Error fetching questions:', error);
            });
          }
          };

          const answersContainer = (
            <div id="answers">
                {sortedAnswers.slice(startIndex, endIndex).map((answer, index) => {
                const answerId = answer._id;
                const {
                    currentPageAns = 1,
                    totalPagesAns = Math.ceil(answer.comments.length / commentsPerPage),
                    slicedComments = answer.comments.slice(0, commentsPerPage), // Initialize slicedComments
                } = commentsPagination[answerId] || {};

                const handlePrevClickCommentAnswer = () => {
                    setCommentsPagination((prevPagination) => {
                    const currentPagination = prevPagination[answerId] || {};
                    const currentPageAns = currentPagination.currentPageAns || 1;
                    const prevPage = Math.max(currentPageAns - 1, 1);

                    const startIndexCommentAnswer = (prevPage - 1) * commentsPerPage;
                    const endIndexCommentAnswer = startIndexCommentAnswer + commentsPerPage;

                    const slicedComments = answer.comments.slice(startIndexCommentAnswer, endIndexCommentAnswer);

                    return {
                        ...prevPagination,
                        [answerId]: {
                        ...currentPagination,
                        currentPageAns: prevPage,
                        slicedComments,
                        },
                    };
                    });
                };
                
                const handleNextClickCommentAnswer = () => {
                  setCommentsPagination((prevPagination) => {
                    const currentPagination = prevPagination[answerId] || {};
                    const currentPageAns = currentPagination.currentPageAns || 1;
                
                    // Assuming totalPagesAns is correctly calculated based on the total number of comments and commentsPerPage
                    const totalPagesAns = Math.ceil(answer.comments.length / commentsPerPage);

                    // Calculate the next page
                    const nextPageAns = currentPageAns + 1;

                    // Check if it's the last page, then redirect to the first page
                    const redirectedPage = nextPageAns > totalPagesAns ? 1 : nextPageAns;

                    const startIndexCommentAnswer = (redirectedPage - 1) * commentsPerPage;
                    const endIndexCommentAnswer = Math.min(startIndexCommentAnswer + commentsPerPage, answer.comments.length);

                    // If it's the last page, show the first commentsPerPage comments
                    const slicedComments = answer.comments.slice(startIndexCommentAnswer, endIndexCommentAnswer);

                    return {
                      ...prevPagination,
                      [answerId]: {
                        ...currentPagination,
                        currentPageAns: redirectedPage,
                        slicedComments,
                      },
                    };
                  });
                };
                
                
                const handleAnswerComment = (answerId, commentText) => {
                  console.log(answerId, commentText);
                  try {
                
                    if (commentText.length > 140) {
                        console.error('Error: Comment exceeds 140 characters.');
                        setAnsError('Error: Comment exceeds 140 characters.')
                        return;
                      }
                      if(!isGuest) {
                    if(userDetails.reputation < 50) {
                      console.error('Error: Cannot comment, reputation < 50');
                      setAnsError('Error: Cannot comment, reputation < 50');
                      return;
                    }
                  
                    request.post(makeUrl('answers/addcomment'),
                    { answerId: answerId, text: commentText })
                    .then(response => {
                      // setQuestion(response.data);
                      const updatedQuestion = response.data;

                      // Update the question state with the new comments
                      setQuestion({ ...updatedQuestion });
              
                      // Update the sortedAnswers state with the new comments
                      const updatedSortedAnswers = sortedAnswers.map((answer) => {
                        // Find the corresponding updated answer from updatedQuestion.answers
                        const updatedAnswer = updatedQuestion.answers.find((a) => a._id === answer._id);
              
                        // If the updatedAnswer is found, update its comments, otherwise, keep the original answer
                        return updatedAnswer ? { ...answer, comments: updatedAnswer.comments } : answer;
                      });
              
                      // Set the updated sortedAnswers state
                      setSortedAnswers(updatedSortedAnswers);
                    })
                  }} catch(error) {
                    setAnsError(error.response.data.error)
                    console.error(error);
                  }
                
                  
                };
                
                const handleUpvoteAnswer = async (answerId) => {
                  // try {
                  // Make an API call to update the upvote on the server
                  if(!isGuestLogin) {
                    if(userDetails.reputation < 50) {
                      setAnsError('Cannot vote, reputation < 50');
                      return;
                    }
                      request.put(makeUrlId('answers/vote/upvote', answerId))
                .then(response => {
                  // setQuestion(response.data);
                  const updatedQuestion = response.data;

                  // Update the answer in sortedAnswers
                  const updatedSortedAnswers = sortedAnswers.map((answer) =>
                    answer._id === answerId ? { ...answer, votes: updatedQuestion.answers.find(a => a._id === answerId).votes } : answer
                  );

                  setSortedAnswers(updatedSortedAnswers);
                  setQuestion(updatedQuestion);
                })
                .catch(error => {
                  setAnsError(error.response.data.error);
                })
              }
              };
              
              const handleDownvoteAnswer = async (answerId) => {
                if(!isGuestLogin) {
                  if(userDetails.reputation < 50) {
                    setAnsError('Cannot vote, reputation < 50');
                    return;
                  }
                request.put(makeUrlId('answers/vote/downvote', answerId))
                .then(response => {
                  // setQuestion(response.data);
                  const updatedQuestion = response.data;

                  // Update the answer in sortedAnswers
                  const updatedSortedAnswers = sortedAnswers.map((answer) =>
                    answer._id === answerId ? { ...answer, votes: updatedQuestion.answers.find(a => a._id === answerId).votes } : answer
                  );

                  setSortedAnswers(updatedSortedAnswers);
                  setQuestion(updatedQuestion);
                })
                .catch(error => {
                  setAnsError(error.response.data.error);
                })
              }
              };  

              const handleAcceptAns = (answerId) => {
                const updateData = {questionID: questionID, answerId: answerId}
                request.put(makeUrl('questions/ansaccept') , updateData)
                .then(response => {
                  setQuestion(response.data);
                })
                .catch(error => {
                  setMainError(error.response.data.error);
                })
              }

              const checkUser = () => {
                if(!isGuestLogin) { 
                  return (userDetails.id === question.asked_by._id);
                }
              }

              const isAcceptedAns = (answerId) => {
                  return answerId === question.accepted_ans;
              }

              const isSameUser = (user) => {
                      if(!isGuestLogin) {
                      return userDetails.user === user;
                  }
                }
                
                return (
                    <div className="answer-individual" key={answer.id || index}>
                      <div className="vote-buttons">
                      {!isGuestLogin && (
                        <button onClick={() => handleUpvoteAnswer(answer._id)}
                        disabled={isSameUser(answer.ans_by.username)}>upvote</button>
                        )}
                        <div className='ans-votes'>{answer.votes} votes</div>
                        {!isGuestLogin && (
                        <button onClick={() => handleDownvoteAnswer(answer._id)}
                        disabled={isSameUser(answer.ans_by.username)}>downvote</button>
                        )}
                      </div>
                    <div className='answer-with-comments'>
                        <div className="answerText">
                        {processTextWithHyperlinks(answer.text)}
                        </div>

                        <div className="comments-section answer-comments-section">
                          <h4> Comments </h4>
                        {/* Display comments based on pagination */}
                        {slicedComments.map((comment, commentIndex) => (
                            <div className="comment" key={comment._id || commentIndex}>
                            <div className='comment-stats'>
                                <div className="comment-votes">{comment.votes} votes</div>
                                {!isGuestLogin && (
                                <button id="upvoteComment" onClick={() => handleCommentUpvoteAnswer(answerId, comment._id)}
                                disabled={isSameUser(comment.posted_by.username)}>Upvote</button>
                                )}
                            </div>
                            <div className="comment-text">{comment.text}</div>
                            <div className="comment-author">{comment.posted_by.username}</div>
                            </div>
                        ))}

                         {/* Add input field for new comment */}
                         {!isGuestLogin && (
                          <div className="new-comment">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              id="ansComment"
                              onKeyUp={(e) => {
                                if (e.key === 'Enter') {
                                  handleAnswerComment(answerId, e.target.value);
                                  e.target.value = ''; // Clear the input field after submitting
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>

                        <div className="pagination-buttons">
                        <button
                        id="ans-prev-comment"
                            onClick={handlePrevClickCommentAnswer}
                            disabled={currentPageAns === 1 || totalPagesAns === 0}
                        >
                            Prev
                        </button>
                        <button
                        id="ans-next-comment"
                            onClick={handleNextClickCommentAnswer}
                            disabled={answer.comments.length <= commentsPerPage}
                        >
                            Next
                        </button>
                        </div>

                        {ansError && <span className="error-message">{ansError}</span>}

                    </div>
                    <div className="ans-lastActivity">
                      <span className="answerAuthor">
                        {answer.ans_by.username} {' '}
                        <span className="answer-asked-time">
                          {formatAnsAskedTime(new Date(answer.ans_date_time))}
                        </span>
                      </span>
                      {!isGuestLogin && checkUser() && !isAcceptedAns(answerId) && (
                      <div className='accept-ans'> 
                              <button id='acceptans' onClick={() => handleAcceptAns(answerId)}> accept</button>
                    </div>)}
                    </div>
                  </div>
                );
              })}
              <div className="pagination-buttons">
                <button id='ans-prev' onClick={handlePrevPage} disabled={currentPage === 1}>
                  Prev
                </button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <button onClick={handleNextPage} 
                id='ans-next'
                disabled={question.answers.length <= answersPerPage}>
                {/* // disabled={currentPage === totalPages}> */}
                  Next
                </button>
              </div>
            </div>
          );          

        const answerQuestion = (          
              <div id="answerQuestionHeader">
                {!isGuestLogin && (
                  <button id="answer-question" onClick={showNewAnswersForm}>Answer Question</button>
                )} 
              </div>          
            );


        return (
            <div className="answer-container">
                {error && <span className="error-message">{error}</span>}
                <QuestionDetail que = {question} isGuest={isGuest} handleShowNewQuestionForm={handleShowNewQuestionForm} currentUser={userDetails} />
                {answersContainer}
                {answerQuestion}
            </div>
        );
    };

    return <>{!loading && displayAnswers()}</>;
}



export default AnswersPage;
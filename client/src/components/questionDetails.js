import React, { useState, useEffect } from 'react';
import axios from "axios";
import {processTextWithHyperlinks, formatAnsAskedTime} from './commonHelper.js';
import { makeUrl, makeUrlId } from './utils/makeUrl.js';
// import { response } from 'express';

function QuestionDetail({que, isGuest, handleShowNewQuestionForm, currentUser}) {
    const [question] = useState(que); 
    const [currentPageCommentQuestion, setCurrentPageCommentQuestion] = useState(1);
    const [newComment, setNewComment] = useState('');
    const [isGuestLogin] = useState(isGuest);
    const [userDetails] = useState(currentUser);
    const [queError, setQueError] = useState('');
    const [votes, setQueVotes] = useState(question.votes);
    const [comments, setComments] = useState(question.comments);
    const request = axios.create({
        withCredentials : true
      });

    useEffect(() => {
        // Set a timer to hide the error message after 5000 milliseconds (adjust the time as needed)
        const timer = setTimeout(() => {
          setQueError(null);
        }, 5000);
    
        // Clear the timer if the component unmounts before the timer expires
        return () => clearTimeout(timer);
      }, [queError]);

    const handleUpvoteQuestion = async (questionId) => {
        if(!isGuest) {
        // Make an API call to update the upvote on the server
        if(userDetails.reputation < 50) {
            setQueError('Cannot vote, reputation < 50');
        }
        else {
              request.put(makeUrlId('questions/vote/upvote', questionId))
            .then(response => {
                // Handle the response here
                console.log(response.data); // Assuming the response contains data
                const updatedQuestionVotes = response.data;

                // Update the local state with the new question object
                setQueVotes(updatedQuestionVotes.votes);
            })
            .catch(error => {
                // Handle errors here
                setQueError(error.response.data.error);
            });
            }
        }
        
    };
    
    const handleDownvoteQuestion = async (questionId) => {
        if(!isGuest) {

            // Make an API call to update the upvote on the server
            if(userDetails.reputation < 50) {
                setQueError('Cannot vote, reputation < 50');
            }
            else {
                request.put(makeUrlId('questions/vote/downvote', questionId))
            .then(response => {
                // Handle the response here
                console.log(response.data); // Assuming the response contains data
                const updatedQuestionVotes = response.data;

                // Update the local state with the new question object
                setQueVotes(updatedQuestionVotes.votes);
            })
            .catch(error => {
                // Handle errors here
                setQueError(error.response.data.error);
            });
        }
    }
    };  

    const commentsPerPageQuestion = 3;
    const totalPagesCommentQuestion = Math.ceil(question.comments.length / commentsPerPageQuestion);

    const startIndexCommentQuestion = (currentPageCommentQuestion - 1) * commentsPerPageQuestion;
    const endIndexCommentQuestion = startIndexCommentQuestion + commentsPerPageQuestion;

    const handlePrevClickCommentQuestion = () => {
        setCurrentPageCommentQuestion((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextClickCommentQuestion = () => {
      setCurrentPageCommentQuestion((prevPage) => {
        const nextPage = prevPage === totalPagesCommentQuestion ? 1 : prevPage + 1;
        return nextPage;
      });
        // setCurrentPageCommentQuestion((prevPage) => Math.min(prevPage + 1, totalPagesCommentQuestion));
      };


    const handleCommentUpvoteQuestion = (commentId) => {
        if(!isGuest) {
    // Implement your upvoting logic for comments here
    request.put(makeUrlId('questions/comment/vote', commentId))
    .then(response => {
        // Handle the response here
        setComments(response.data.comments);
        console.log(response.data.comments);
    })
    .catch(error => {
        setQueError(error.response.data.error);
    });
}
    };

    const handleAddComment = async () => {
           
        try {
            
            if (newComment.length > 140) {
                setQueError('Error: Comment exceeds 140 characters.');
                return;
              }
              if(!isGuest) {
              if(userDetails.reputation < 50) {
                setQueError('Error: Cannot comment, reputation < 50');
                return;
              }
            }

          // Make an API call to add a new comment
          console.log(newComment);
          if(!isGuest) {
          request.post(makeUrl('questions/addcomment'),
          { questionId: question._id, text: newComment })
          .then(response => {
            console.log(response.data.comments);
            setComments(response.data.comments);
            // question(updatedQuestion)
          })
          .catch
        } 
    }catch (error) {
          console.error('Error adding comment:', error);
        }
      };
      const isSameUser = (user) => {
        if(!isGuestLogin) {
        return userDetails.user === user;
    }
      } 

    return (
        <>
        <div id="answersHeader">
        <h2 className="ans-que-header">{question.answers.length} answers</h2>
        <h2 className="ans-que-title-header">{question.title}</h2>
        {!isGuestLogin && (
          <button id="ask-question" className="new-question-button" onClick={handleShowNewQuestionForm}>
          Ask a Question
          </button>
        )}
    </div>

        <div id="questionBody">
        <div className='question-stats'>
          <div className="answer-views">{question.views} views</div>

          <div className="vote-buttons">
          {/* Upvote and Downvote arrows with vote count */}
          {!isGuestLogin && (
            <button id='queUpvote' onClick={() => handleUpvoteQuestion(question._id)}
            disabled={isSameUser(question.asked_by.username)}>upvote</button>
            )}
            <div className='que-votes'>{votes} votes</div>
            {!isGuestLogin && (
            <button id='queDownvote' onClick={() => handleDownvoteQuestion(question._id)}
          disabled={isSameUser(question.asked_by.username)}>downvote</button>
            )}
          </div>
          </div>
        
        <div className='question-text-details'>
          <div className="que-ans-text">{processTextWithHyperlinks(question.text)}</div>
          
          <div className="que-tags">
            {question.tags.map((tag, index) => (
              <div className="question-tag-inside" key={tag._id || index}>
                {tag.name}
              </div>
            ))}
          </div>
      
           {/* Comments section */}
            <div className="comments-section question-comment-section">
             <h4> Comments </h4>
                {/* Display comments based on pagination */}
                {comments.slice(startIndexCommentQuestion, endIndexCommentQuestion).map((comment, index) => (
                <div className="comment" key={comment._id || index}>
                    <div className='comment-stats'>

                        <div className="comment-votes">{comment.votes} votes</div>
                        
                        {!isGuestLogin && ( <button onClick={() => handleCommentUpvoteQuestion(comment._id)}
                        disabled={isSameUser(comment.posted_by.username)}>Upvote</button>
                        )}
                    </div>
                    <div className="comment-text">{comment.text}</div>
                    <div className="comment-author">{comment.posted_by.username}</div>                        
                </div>
                ))}
            </div>
            {/* Pagination buttons */}
            <div className="pagination-buttons">
                <button
                id='question-prev'
                onClick={handlePrevClickCommentQuestion}
                disabled={currentPageCommentQuestion === 1 || totalPagesCommentQuestion === 0}
                >
                Prev
                </button>
                <button
                id='question-next'
                onClick={handleNextClickCommentQuestion}
                disabled={question.comments.length <= commentsPerPageQuestion}
                // disabled={currentPageCommentQuestion === totalPagesCommentQuestion || totalPagesCommentQuestion === 0}
                >
                Next
                </button>
            </div>

             {/* Add comment input directly */}
             {!isGuestLogin && (<div>
                <input
                    type="text"
                    value={newComment}
                    id="queComment"
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => 
                        e.key === 'Enter' && handleAddComment()
                        && setNewComment('')}
                    placeholder="Add a new comment..."
                />
            </div>
            )}

            {queError && <span className="error-message">{queError}</span>}
        </div>

      
          <div className="lastActivityAnswer">
            <div className="que-author">{question.asked_by.username}</div>
            <div className="que-asked-time">{formatAnsAskedTime(new Date(question.ask_date_time))}</div>
          </div>
        </div>
        </>
    )
}
export {QuestionDetail};
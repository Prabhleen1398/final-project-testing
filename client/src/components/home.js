import React, { useEffect, useState } from "react";
import { DisplayQuestions } from "./displayQuestions.js";
import { DisplayTags } from "./displayTags.js";
import { AddQuestion } from "./addQuestion.js";
import "../stylesheets/index.css";
import {SearchBar} from "./searchText.js";
import AnswersPage from "./viewAnswers.js";
import AddAnswer from "./addAnswer.js";
import axios from 'axios';
import { makeUrl, makeUrlSearch } from './utils/makeUrl.js';
import UserInfo from "./userInfo.js";

function Home({onLogout, isGuest}) {
  const [questions, setQuestions] = useState([]);
  // const [answers, setAnswers] = useState([]);
  // const [tags, setTags] = useState([]);
  const [updatedQuestions, setUpdatedQuestions] = useState([]);
  const [displayedComponent, setDisplayedComponent] = useState("questions");
  // const { inputValue, handleInputChange, handleKeyUp } = useSearch();
  // const [searchTerm, setSearchTerm] = useState('');
  const [questionID, setQuestionID] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
  // New state for userInfo
  //const [userInfo, setUserInfo] = useState(null);

const getCurrentUserDetails = async () => { 
  try {
    // Call the server-side logout endpoint
    const request = axios.create({
      withCredentials : true
    })
    request.get(makeUrl('session/getsessiondetails')).then((response) => {
      console.log(response.data);
    if (response.status === 200) {
      const data = response.data;
      console.log(data);
      setCurrentUser(data);
      console.log(currentUser);
      // You can now use the user details as needed on your home page
    } else {
      console.error('Error:', response.statusText);
    }
    })
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

  useEffect(() => {
    const fetchData = async () => {
            try {
        const questionsResponse = await axios.get(makeUrl('questions'));
        setQuestions(questionsResponse.data);
        } catch (error) {
        console.error('Error fetching questions:', error);
      }
      finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        getCurrentUserDetails();
      } catch(err) {
        console.log(err);
      }
    }
    fetchData();
    
  }, []);

  const handleLogout = async () => {
    try {
      // Call the server-side logout endpoint
      const request = axios.create({
        withCredentials : true
      })
      request.post(makeUrl('session/logout')).then((response) => {
        console.log(response);
        console.log('in logout');
        console.log(currentUser);
        setCurrentUser(null);
        console.log(currentUser);
        // Redirect to the welcome page
        onLogout();
      })
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  const onSearch = (searchTerm) => {

    const fetchSearchResults = async () => {
      try {
        // setLoading(true);
        const questionsResponse = await axios.get(makeUrlSearch('search', searchTerm));
        setFilteredQuestions(questionsResponse.data);
        // setLoading(false);
      
        // return filteredQuestions;
        } catch (error) {
        console.error('Error fetching tags:', error);
      }
    }
    fetchSearchResults();

    setDisplayedComponent('searchResults');
     
  };
      
  const handleDisplayQuestions = () => {
    console.log("inside questions");
    console.log(questions);
    setQuestions(questions);
    setActiveMenuLink("questions");
    setDisplayedComponent("questions");
  };

  const handleDisplayTags = () => {
    setActiveMenuLink("tags");
    setDisplayedComponent("tags");
  };

  const onAddQuestion = (questions) => {
    setActiveMenuLink("questions");
    setQuestions(questions);
    // setTags(tags);
    setDisplayedComponent("questions");
  }
  const onTagClick = (questions) => {
    setActiveMenuLink("tags");
    setUpdatedQuestions(questions);
    //setTags(tags);
    //setDisplayedComponent("questions");
    setDisplayedComponent("updatedQuestions");

  }

  const showNewQuestionForm = () => {
    if (!isGuest) {
      setActiveMenuLink("questions");
      setQuestions(questions);
      setDisplayedComponent("addQuestion");
    }  
  }

  const handleQuestionClick = (questionID) => {
    setQuestionID(questionID);
    console.log(`${questionID} question pressed in home`);
    setDisplayedComponent('answersPage');
  };

  const showNewAnswersForm = () => {
    setQuestionID(questionID);
    setDisplayedComponent("addAnswer");
  }

  const addNewAnswer = (updatedQuestions, questionID) => {
    // Update the questions and answers state here with the new answer
    setQuestions(updatedQuestions);
    // setAnswers([...answers, newAnswer]);
    setQuestionID(questionID);
    setDisplayedComponent('answersPage');
  };

  const handleGuestHome = () => {
    onLogout();
  }

  function setActiveMenuLink(activeComponent) {
    if (activeComponent !== 'tags') {
      let sideBarQueInactive = document.getElementById("sideBarNav-tag");
      sideBarQueInactive.classList.remove("activeLink");
      let navSelected = document.getElementById("sideBarNav-que");
      navSelected.classList.add("activeLink");
    } else {
      let sideBarQueInactive = document.getElementById("sideBarNav-que");
      sideBarQueInactive.classList.remove("activeLink");
      let navSelected = document.getElementById("sideBarNav-tag");
      navSelected.classList.add("activeLink");
    }
  }
  const handleUserInfoClick = () => {
    setDisplayedComponent("userInfo");
  };

  return (
    <>
      <div className='header'>
        <h1 id='title'>Fake Stack Overflow</h1>
        <SearchBar onSearch={onSearch} />
        {!isGuest && currentUser ? (
        <div>
          {console.log(currentUser.user)}
          <p>Welcome, {currentUser.user}!</p>
          <button id='logout' className='button-util' onClick={handleLogout}>Logout</button>
          <button
              className="button-util"
              onClick={handleUserInfoClick}
              id="myInfo"
            >
            My Info
          </button>
        </div>
      ) : (
        <div>
          <p>Guest</p>
          <button id='guest-register' className='button-util' onClick={handleGuestHome}>Register</button>
          {/* <button className='button-util' onClick={handleLogout}>Logout</button> */}
        </div>
      )}

      </div>
      <div id='main-container'>
        <div className="nav-container">
          <div id="sideBarNav">
            <a className="activeLink nav-link" id="sideBarNav-que" onClick={handleDisplayQuestions}>
              Questions
            </a>
            <a className="nav-link" id="sideBarNav-tag" onClick={handleDisplayTags}>
              Tags
            </a>
          </div>
        </div>
<div>
        </div>
        {displayedComponent === "questions" && !loading && <DisplayQuestions questions={questions} handleShowNewQuestionForm={showNewQuestionForm} headerText={"All Questions"} onQuestionClick={handleQuestionClick} isGuest={isGuest} />}
        {displayedComponent === "addQuestion" && <AddQuestion questions={questions} onAddQuestion={onAddQuestion} />}
        {displayedComponent === "tags" && <DisplayTags handleShowNewQuestionForm={showNewQuestionForm} showQuestion={onTagClick} isGuest={isGuest}/>}
        {displayedComponent === "searchResults" && <DisplayQuestions questions={filteredQuestions} handleShowNewQuestionForm={showNewQuestionForm} headerText={"Search Results"} onQuestionClick={handleQuestionClick} isGuest={isGuest} />}
        {displayedComponent === "answersPage" && <AnswersPage questionID={questionID} showNewAnswersForm = {showNewAnswersForm} handleShowNewQuestionForm={showNewQuestionForm} isGuest={isGuest} currentUser={currentUser}/> }
        {displayedComponent === "addAnswer" && <AddAnswer questionID={questionID} addNewAnswer={addNewAnswer}/>}
        {displayedComponent === "updatedQuestions" && <DisplayQuestions questions={updatedQuestions} handleShowNewQuestionForm={showNewQuestionForm} headerText={"All Questions"} onQuestionClick={handleQuestionClick} isGuest={isGuest}/>}
        {displayedComponent === "userInfo" && <UserInfo userDetail={currentUser} />}

      </div>
    </>
  );
}

export default Home;
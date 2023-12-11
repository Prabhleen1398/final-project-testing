[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/hxTav0v1)
Login with your Northeastern credentials and read the Project Specifications [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/EcUflH7GXMBEjXGjx-qRQMkB7cfHNaHk9LYqeHRm7tgrKg?e=oZEef3).

Add design docs in *images/*

## Instructions to setup and run project

Detailed instructions with all relevant commands go here.
To start the server from home directory: npm server/server.js "secretKey" 
To run populate_db manually: node server/populate_db.js mongodb://127.0.0.1:27017/fake_so
To destroy/restart database node server/destroy.js
To initiate client: cd client
                    npm start
                    (runs on http://localhost:3000/)


## Team Member 1 Contribution

Prabhleen
    - welcome and registration pages
    - session for login and activity
    - pagination for questions, answers, comments
    - add a comment
    - voting a question, answer, comment
    - test cases for registration, log in, answer, add comment, add answer, add question, accept ans, view questions, upvoting and downvoting questions
    - accept ans
    - design docs and data model

## Team Member 2 Contribution

Tejas
    - logout and minor changes in existing code on the api 
    - client side and api for user profile to show repuatation and member since
    - client side and api for user profile to show list of questions, answers and tags
    - repost question, answers and tags
    - delete questions, answers and tags
    - test cases for user profile, home for registered and guest user, new question page, new answer page and search/hyperlinks

## Test cases

| Use-case Name   | Test case Name |
|-----------------|----------------|
| Welcome Page Content	| Test-1.1 |
| Register Page Content	| Test-1.2 |
| Login Page Content | Test -1.3 |
| Register User, blank username | Test-2.1 |
| Register User, blank email | 	Test-2.2 |
| Register User, blank password |	Test-2.3 |
| Register user, blank repeat password| 	Test-2.4| 
| Register user, repeat password do not match| 	Test-2.5| 
| Register user, password contains username| 	Test-2.6| 
| Register user, password contains email	| Test-2.7| 
 | Register user, email not correct format| 	Test-2.8.1| 
 | Register user, email not correct format	| Test-2.8.2| 
 | Register user, email not correct format	| Test-2.8.3| 
| Register user, user already exists| 	Test-2.9| 
| Register user, email already exists	| Test-2.10| 
| Register user, back| 	Test-2.11| 
| Register user, success	| Test-2.12| 
| Login user, blank username| 	Test-3.1| 
| Login user, blank password| 	Test-3.2| 
| Login user, incorrect credentials	| Test-3.3| 
| Login user, success| 	Test-3.4| 
| Register, login, success	| Test-3.5| 
| Login user, logout| 	Test-4.1| 
| Login user, homepage elements| 	Test-4.2| 
| Guest user, homepage	| Test-4.3| 
| Guest user Display individual Question | 4.5.1 |
|  Number of Questions in a single page | 5.1 |
| Search Bar Display	| 
| Newest Order  Registered User	| 13.1 |
| Active Order	Registered User	| 13.2 |
| Unanswered Order	 Registered User	| 13.3 |
| Number of Questions in a single page	
| Question count and next and prev buttons | 5.2 |
 | Question count and next and prev buttons | 5.3| 
 | Registered User Ask a question | 6.1 |
 | Ask a Question |  6.2|
 | Question count and next and prev buttons for registered users | 6.3 |
| List of Questions - Count | 6.4|
| Individal Question list  registered user | 6.5|
| Question Count  Registerd user | 6.6|
| Search Questions and display in Newest order |  7.1 |
| Ask a Question  Bad reputation | 7.2 |
| Adds a question with a hyperlink and verifies | 7.3 |
| Adds an answer with a hyperlink and verifies | 7.4 |
| Display tags List and Tag count for each tag	
| Display tags List and Tag count for each tag | Registered user	
| Ask a Question  Good reputation	|
 |  Tries to add a question with an invalid hyperlink and verifies failure | 7.5 |
| Attempts to add an answer with an invalid hyperlink and verifies failure | 7.6 |
| Display User information(user name, member since, repuatation)	 | 
| Display userQuestions in Newest order	|
| Delete userQuestions	|
| Delete userTag if not shared by others |	
| Edit userTag if not shared by others	 |
| Display userAnswers	|
| Edit userAnswers	| 
| Delete userAnswers and reputation same	| 
| Edit userQuestion	|10.1 |
| length of userAnswers	|10.2 |
| Delete answer deletes votes and comments	|10.3 |
| Delete tag deletes from all questions	|10.4 |
| Edit and Delete button disabled for shared tag		
| Search string in question text	|11.1 |
| Search string matches tag and text |11.2 |		
| Create new answer should be displayed at the top of the answers page	| 12.1 |
| Answer is mandatory when creating a new answer	| 12.2 |	
| Ask a Question creates and displays in All Questions | 12.3 |	
| Ask a Question creates and displays in All Questions with necessary tags	| 12.4 |
| Ask a Question with empty title shows error	| 12.5 |
| Ask a Question with long title shows error	| 12.6 |
| Ask a Question with more than 5 tags shows error | 12.7 |	
| Ask a Question with a long new tag	| 12.8 |
| Ask a Question with no summary	| 12.9 |
| Add a comment question < 140 High Reputation	| 8.1 |
| Add a commnet question < 140 Low reputation	| 8.2 |
| Add a comment < 140 high reputation	 | 8.3 |
| Add a comment < 140 low reputation	 | 8.4 |
| Add a comment question > 140	| 8.5 |
| Add a comment answer > 140	| 8.6 |
| Upvote question High Reputation	| 8.7 |
| Upvote question Low Reputation	| 8.8 |
| Downvote question High Reputation	|8.9 |
| Downvote question Low Reputation	| 8.10 |
| Upvote answer High Reputation	| 8.11 |
| Upvote answer Low Reputation	| 8.12 |
| Downvote answer high reputation	| 8.13 |
| Downvote answer low reputation	| 8.14 |
| Accept answer	| 9.1 |
| Prev and next in ans < 5	| 9.2 |
| prev and next in ans	| 9.3 |
| Prev and next in comment	| 9.4 |
| Upvote a comment question	| 9.5 |
| upvote comment and active sort	| 9.6 |
| upvote already upvoted ans	| 9.7 |
| downvote already downvoted ans	| 9.8 |
| Upvote already upvoted que	| 9.9 |
| downvote already downvoted que	|9.10  |
| upvote already voted comment	| 9.11 |
| Guest login que upvote not visible	|9.12 |
| guest login qye downvote not visible	|9.13 |
| Guest login ans comment upvote not visible	|9.14 |
|  Guest login add que comment not visible	|9.15 |
| guest login add ans comment not visible	|9.16 |
| Guest login comment upvote not visible	|9.17 |
| guest login ans upvote not visible	|9.18 |
| Guest login ans downvote not visible	|9.19 |
 | Newest Order | Guest User	| 13.4 |
 | Active Order | Guest User |  13.5 |
 | Unanswered Order | Guest User |  13.6 |
  | Adds multiple questions with valid hyperlinks and verify | 14.1 |
| Upvote question High Reputation updates reputation | 9.20  |
| Downvote question High Reputation updates reputation | 9.21 | 


## Design Patterns Used

- Design Pattern Name:
-   Factory Design pattern

    - Factory Design pattern

- Problem Solved:
- Sorting questions based on active, newest and unanswered questions is a very repititve and similar task with just the sorting pattern to be different, however the response remains the same. In order to solve that,created a factory called SortingStrategyFactory which creates objects of 3 classes, active, newest and unanswered strategies. In util-controller, where the API is called, based on the sort passed, we create the respoctive class's object and sort the answers as per this strategy.

    - Sorting questions based on active, newest and unanswered questions is a very repititve and similar task with just the sorting pattern to be different, however the response remains the same. In order to solve that,created a factory called SortingStrategyFactory which creates objects of 3 classes, active, newest and unanswered strategies. In util-controller, where the API is called, based on the sort passed, we create the respoctive class's object and sort the answers as per this strategy.

- Location in code where pattern is used:

    - server/controllers/SortingStrategyFactory.js

    - Used in server/controllers/utilsController.js - line 6-18(sortQuestions)

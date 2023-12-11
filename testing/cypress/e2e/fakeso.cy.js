// Template test file. Change the file to add more tests.

Cypress.Commands.add('login', (username, password) => {
    cy.visit('http://localhost:3000');   
    cy.get('#login-button').click();   
     cy.get("#formLoginName").should('exist').type(username);   
     cy.get("#formLoginPassword").should('exist').type(password);   
     cy.get("#formLoginSubmit").click(); 
    });

Cypress.Commands.add('guest', () => {
  cy.visit('http://localhost:3000');
  cy.get('#guest-button').click();
  });

describe('Reset db before and after each test', () => {

  beforeEach(() => {
      // Seed the database before each test
      cy.exec('node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so');
  });

  //mongodb://127.0.0.1:27017/fake_so
  afterEach(() => {
      // Clear the database after each test
      cy.exec('node ../server/destroy.js')
  });
  
  it('1.1 | Welcome page content', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Register as a new user');
    cy.contains('Login as an existing user');
    cy.contains('Continue as a guest');
  })
  
  it('1.2 | Register page content', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.contains('Username');
      cy.contains('Password');
      cy.contains('Repeat Password');
      cy.contains('Sign Up');
      cy.contains('Back');
    })

    it('1.3 | Login page content', () => {
      // Click the "Login" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#login-button').click();
      cy.contains('Username');
      cy.contains('Password');
      cy.contains('Login');
      cy.contains('Back');
    })

    it('2.1 | Register user, blank username', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.get("#formRegisterEmail").should('exist').type('user@email.com'); // Type a valid email
      cy.get("#formRegisterPassword").should('exist').type('password123');
      cy.get("#formRegisterPasswordRepeat").type('password123'); // Type a valid password
      cy.get("#formRegisterSubmit").click();
      cy.contains('Username cannot be empty');
    })

    it('2.2 | Register user, blank email', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.get("#username").should('exist').type('user');
      cy.get("#formRegisterPassword").should('exist').type('password123'); // Type a valid password
      // cy.get("#formRegisterEmail").type('user@email.com'); // Type a valid email
      cy.get("#formRegisterPasswordRepeat").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterSubmit").click();
      cy.contains('Email cannot be empty');
    })

    it('2.3 | Register user, blank password', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.get("#username").should('exist').type('user');
      cy.get("#formRegisterEmail").type('user@email.com'); // Type a valid email
      // cy.get("#formRegisterPassword").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterPasswordRepeat").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterSubmit").click();
      cy.contains('Password cannot be empty');
    })

    it('2.4 | Register user, blank repeat password', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.get("#username").should('exist').type('user');
      cy.get("#formRegisterEmail").type('user@email.com'); // Type a valid email
      cy.get("#formRegisterPassword").should('exist').type('password123'); // Type a valid password
      // cy.get("#formRegisterPasswordRepeat").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterSubmit").click();
      cy.contains('Please re-enter your password');
    })

    it('2.5 | Register user, repeat password do not match', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.get("#username").should('exist').type('user');
      cy.get("#formRegisterEmail").type('user@email.com'); // Type a valid email
      cy.get("#formRegisterPassword").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterPasswordRepeat").should('exist').type('password'); // Type a valid password
      cy.get("#formRegisterSubmit").click();
      cy.contains('Passwords do not match');
    })
  
    it('2.6 | Register user, password contains username', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.get("#username").should('exist').type('user');
      cy.get("#formRegisterEmail").type('user@email.com'); // Type a valid email
      cy.get("#formRegisterPassword").should('exist').type('user'); // Type a valid password
      cy.get("#formRegisterPasswordRepeat").should('exist').type('user'); // Type a valid password
      cy.get("#formRegisterSubmit").click();
      cy.contains('Password should not contain username or email');
    })

    it('2.7 | Register user, password contains email', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.get("#username").should('exist').type('user');
      cy.get("#formRegisterEmail").type('user@email.com'); // Type a valid email
      cy.get("#formRegisterPassword").should('exist').type('user@email.com'); // Type a valid password
      cy.get("#formRegisterPasswordRepeat").should('exist').type('user@email.com'); // Type a valid password
      cy.get("#formRegisterSubmit").click();
      cy.contains('Password should not contain username or email');
    })

    it('2.8.1 | Register user, email not correct format', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.get("#username").should('exist').type('user');
      cy.get("#formRegisterEmail").type('user@'); // Type a valid email
      cy.get("#formRegisterPassword").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterPasswordRepeat").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterSubmit").click();
      cy.contains('Invalid email format');
    })

    it('2.8.2 | Register user, email not correct format', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.get("#username").should('exist').type('user');
      cy.get("#formRegisterEmail").type('user123'); // Type a valid email
      cy.get("#formRegisterPassword").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterPasswordRepeat").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterSubmit").click();
      cy.contains('Invalid email format');
    })

    it('2.8.3 | Register user, email not correct format', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.get("#username").should('exist').type('user');
      cy.get("#formRegisterEmail").type('user123@.com'); // Type a valid email
      cy.get("#formRegisterPassword").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterPasswordRepeat").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterSubmit").click();
      cy.contains('Invalid email format');
    })

    it('2.9 | Register user, user already exists', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.get("#username").should('exist').type('test2');
      cy.get("#formRegisterEmail").type('user123@gmail.com'); // Type a valid email
      cy.get("#formRegisterPassword").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterPasswordRepeat").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterSubmit").click();
      cy.contains('Please use unique username/password');
    })

    it('2.10 | Register user, email already exists', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.get("#username").should('exist').type('newuser');
      cy.get("#formRegisterEmail").type('test2@gmail.com'); // Type a valid email
      cy.get("#formRegisterPassword").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterPasswordRepeat").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterSubmit").click();
      cy.contains('Please use unique username/password');
    })

    it('2.11 | Register user, back', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.get("#back").click();
      cy.contains('Register as a new user');
      cy.contains('Login as an existing user');
      cy.contains('Continue as a guest');
    })

    it('2.12 | Register user, success', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.get("#username").should('exist').type('newuser');
      cy.get("#formRegisterEmail").type('newuser@northeastern.edu'); // Type a valid email
      cy.get("#formRegisterPassword").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterPasswordRepeat").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterSubmit").click();
      cy.contains('Username');
      cy.contains('Password');
      cy.contains('Login');
    })

    it('3.1 | Login user, blank username', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#login-button').click();
      // cy.get("#username").should('exist').type('newuser');
      cy.get("#formLoginPassword").should('exist').type('password123'); // Type a valid password
      cy.get("#formLoginSubmit").click();
      cy.contains('Username cannot be empty');
    })

    it('3.2 | Login user, blank password', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#login-button').click();
      cy.get("#formLoginName").should('exist').type('newuser');
      // cy.get("#formLoginPassword").should('exist').type('password123'); // Type a valid password
      cy.get("#formLoginSubmit").click();
      cy.contains('Password cannot be empty');
    })
  
    it('3.3 | Login user, incorrect credentials', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#login-button').click();
      cy.get("#formLoginName").should('exist').type('someuser');
      cy.get("#formLoginPassword").should('exist').type('somepass'); // Type a valid password
      cy.get("#formLoginSubmit").click();
      cy.contains('Error during Login');
    })

    it('3.3.1 | Login user, incorrect username', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#login-button').click();
      cy.get("#formLoginName").should('exist').type('someusername');
      cy.get("#formLoginPassword").should('exist').type('abcd'); // Type a valid password
      cy.get("#formLoginSubmit").click();
      cy.contains('Error during Login');
    })

    it('3.3.2 | Login user, incorrect password', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#login-button').click();
      cy.get("#formLoginName").should('exist').type('test2');
      cy.get("#formLoginPassword").should('exist').type('abcde'); // Type a valid password
      cy.get("#formLoginSubmit").click();
      cy.contains('Error during Login');
    })

    it('3.4 | Login user, success', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#login-button').click();
      cy.get("#formLoginName").should('exist').type('test2');
      cy.get("#formLoginPassword").should('exist').type('abcd'); // Type a valid password
      cy.get("#formLoginSubmit").click();
      cy.contains('Welcome, test2!');
    })

    it('3.5 | Register user, login user, success', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#register-button').click();
      cy.get("#username").should('exist').type('newuser');
      cy.get("#formRegisterEmail").type('newuser@northeastern.edu'); // Type a valid email
      cy.get("#formRegisterPassword").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterPasswordRepeat").should('exist').type('password123'); // Type a valid password
      cy.get("#formRegisterSubmit").click();
      cy.get("#formLoginName").should('exist').type('newuser');
      cy.get("#formLoginPassword").should('exist').type('password123'); // Type a valid password
      cy.get("#formLoginSubmit").click();
      cy.contains('Welcome, newuser!');
    })

    it('4.1 | Login user, logout', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.get('#login-button').click();
      cy.get("#formLoginName").should('exist').type('test2');
      cy.get("#formLoginPassword").should('exist').type('abcd'); // Type a valid password
      cy.get("#formLoginSubmit").click();
      cy.get('#logout').click();
      cy.contains('Register as a new user');
      cy.contains('Login as an existing user');
      cy.contains('Continue as a guest');
    })
    
    it('4.2 | Login user, homepage elements and buttons', () => {
      // Click the "Register" button and assert navigation
      cy.visit('http://localhost:3000');
      cy.login('test2','abcd');
      cy.contains('Welcome, test2!');
      cy.contains('Fake Stack Overflow');
      cy.get('#logout').should("exist");
      cy.get("#searchBar").should("exist");
      cy.get('#myInfo').should("exist");
      cy.contains('Newest');
      cy.contains('Active');
      cy.contains('Unanswered');
      cy.contains('Questions');
      cy.contains('Tags');
      cy.get('#ask-question').should("exist");
    })

    it('4.3 | Guest user, homepage', () => {
      // Click the "Register" button and assert navigation
      cy.guest();
      cy.get("#ask-question").should('not.exist');
      cy.get("#guest-register").should('exist');
      cy.contains('Fake Stack Overflow');
      cy.get('#searchBar').should("exist");
      cy.contains('Newest');
      cy.contains('Active');
      cy.contains('Unanswered');
      cy.contains('Questions');
      cy.contains('Tags');
    });

   
    // it("4.5 | Registered user | Display individual Question", () => {
    //   cy.login("test2", "abcd");
    //   cy.get(".question").each(($el) => {
    //     cy.wrap($el).within(() => {
    //       cy.get(".postTitle").should("exist");
    //       cy.get(".que-summary").should("exist");
    //       cy.get(".postStats").should("exist"); // If votes are within .postStats
    //       cy.get(".que-count").should("exist"); 
    //       cy.get(".que-view").should("exist"); 
    //       cy.get(".que-votes").should("exist"); 
    //       cy.get(".lastActivity").should("exist"); // If username and date are within .lastActivity
    //       // Assuming 'getMetaData' formats the date in a way that includes the word 'asked'
    //       cy.get(".que-asked-time").should("contain", "asked");
    //       cy.get(".que-author").should("exist");
    //     });
    //   });
    // });


    it("4.5.1 | Guest user | Display individual Question", () => {
      cy.guest();
      cy.get(".questions").each(($el) => {
        cy.wrap($el).within(() => {
          cy.get(".postTitle").should("exist");
          cy.get(".que-summary").should("exist");
          cy.get(".postStats").should("exist"); // If votes are within .postStats
          cy.get(".que-count").should("exist"); 
          cy.get(".que-view").should("exist"); 
          cy.get(".que-votes").should("exist"); 
          cy.get(".lastActivity").should("exist"); // If username and date are within .lastActivity
          // Assuming 'getMetaData' formats the date in a way that includes the word 'asked'
          cy.get(".que-asked-time").should("contain", "asked");
          cy.get(".que-author").should("exist");
        });
      });
    });

    // it("4.6 | Search Bar Display | Guest", () => {
    //   cy.guest();
    //   const searchTerm = "react";
    //   cy.get("#searchBar").should("exist");
    //   cy.get("#searchBar").type(`${searchTerm}{enter}`);
    // });

    it("5.1 | Number of Questions in a single page", () => {
      cy.guest();
      cy.get(".question").should("have.length.lte", 5);
    });
  
    it("5.2 | Question count and next and prev buttons", () => {
      cy.guest();
      cy.get(".num-questions")
    })

    it("5.3 | Question count and next and prev buttons | Registered User", () => {
      cy.login("test2", "abcd");
      cy.get(".num-questions")
        .invoke("text")
        .then((text) => {
          const questionCount = parseInt(text.split(" ")[0], 10);
          if (questionCount > 5) {
            cy.get("#que-next")
              .should("be.visible")
              .should('not.have.attr', 'disabled');
            cy.get("#que-prev")
              .should("be.visible")
              .should('not.have.attr', 'disabled');
          }
          // } else {
          //   // cy.get("#que-next").should('have.attr', 'disabled');
          //   // cy.get("#que-prev").should('have.attr', 'disabled');
          // }
        });
    });
      
    //HOME PAGE | REGISTERED USER | high reputation
    it("6.1 | Registered User Ask a question", () => {
      cy.login('test2','abcd');
    })
    
    it("6.2 | Ask a Question", () => {
      cy.login('test2','abcd');
      cy.contains("Ask a Question").click();
      
    });
  
    it("6.3 | Question count and next and prev buttons for registered users", () => {
      cy.login('test2','abcd');
      // cy.get("#question_count")

      cy.get(".num-questions")
        .invoke("text")
        .then((text) => {
          const questionCount = parseInt(text.split(" ")[0], 10); // Assuming the format is "X questions"
          if (questionCount > 5) {
            cy.get("#que-next")
              .should("be.visible")
              .should('not.have.attr', 'disabled');
            // cy.contains("que-prev")
            //   .should("be.visible")
            //   .should('not.have.attr', 'disabled');;
          } else {
            cy.get("#que-next").should('have.attr', 'disabled');
            cy.contains("#que-prev").should('have.attr', 'disabled');
          }
        });
    });
  
    it("6.4 | List of Questions - Count", () => {
      cy.login('test2','abcd');
      cy.get(".questions").should("have.length.at.least", 0);
    });
  
    it("6.5 | Individal Question list | registered user", () => {
      cy.login('test2','abcd');
      cy.get(".questions").each(($el) => {
        cy.wrap($el).within(() => {
          cy.get(".postTitle").should("exist");
          cy.get(".que-summary").should("exist");
          //NOT WORKING
          //cy.get(".question_tags").find(".tagBtn").should("exist"); // Ensure this matches the class or element type for tags
          cy.get(".postStats").should("exist"); // If votes are within .postStats
          cy.get(".lastActivity").should("exist"); // If username and date are within .lastActivity
          // Assuming 'getMetaData' formats the date in a way that includes the word 'asked'
          // cy.get(".question_meta").should("contain", "asked");
        });
      });
    });
  
  
    it("6.6 | Question Count | Registerd user", () => {
      cy.login('test2','abcd');
      cy.get(".question").should("have.length.lte", 5);
    });

    it("7.1 | Search Questions and display in Newest order", () => {
      cy.login('test2','abcd');
      const searchTerm = "react";

      cy.get("#searchBar", { timeout: 10000 })
        .should("be.visible")
        .type(searchTerm);
  
      cy.get("#searchBar").type("{enter}");
  
      cy.get(".questions-display").should("exist");
  
      // validate that the search results are in Newest order
      let previousDate = new Date();
      cy.get("#questions-to-display").each(($el, index, $list) => {
        const dateString = $el.find(".que-asked-time").text();
        const currentDate = new Date(dateString);
  
        if (index > 0) {
          expect(currentDate).to.be.lte(previousDate);
        }
        previousDate = currentDate;
      });
      });

//   //NEW QUESTION | Registered User

//   it("Ask a Question | Good reputation", () => {
//     cy.login('test2','abcd');
//     cy.contains("Ask a Question").click();

//     cy.get("#formTitleInput").type("New Title");
//     cy.get("formSummaryInput").type("New Summary");
//     cy.get("#formTextInput").type(
//       "New Text"
//     );
//     cy.get("#formTagInput").type("NewTag");
//     // const QUESTION_API_URL = "http://localhost:8000/api";

//     // cy.intercept("POST", `${QUESTION_API_URL}/questions`).as("addQuestion");

//     // Submit the form
//     cy.get("#post-question").contains("Post Question").click();

//     // Check if redirected to the home page with the new question displayed
//     cy.contains("New Title").should("exist");
//     cy.get("#question_list")
//       .first()
//       .within(() => {
//         cy.contains("New Title").should("exist"); 
//         cy.contains("New Text").should("exist");
//         cy.contains("New Tag").should("exist");
//       });
//   });


  it("7.2 | Ask a Question | Bad reputation", () => {
    cy.login('test','test');

    cy.contains("Ask a Question").click();

    cy.get("#formTitleInput").type("New Title");
    cy.get("#formSummaryInput").type("New Summary");
    cy.get("#formTextInput").type(
      "New Text"
    );
    cy.get("#formTagInput").type("NewTag");

    // const QUESTION_API_URL = "http://localhost:8000/api";

    // cy.intercept("POST", `${QUESTION_API_URL}/question`).as("addQuestion");

    // Submit the form
    cy.get("#post-question").contains("Post Question").click();

    // cy.contains(".error-message", (str) => {
    //   expect(str).to.equal(
    //     `User does not have sufficient reputation to add new tags.`
    //   );
    // });
  });


  it('7.3 | Adds a question with a hyperlink and verifies', () => {
    cy.login('test2','abcd');
    cy.contains('Ask a Question').click();
    cy.get('#formTitleInput').type('How to add a hyperlink in Markdown?');
    cy.get('#formTextInput').type('Here is a link: [Google](https://www.google.com)');
    cy.get('#formTagInput').type('markdown');
    cy.get('#formSummaryInput').type('test summary');
    cy.contains('Post Question').click();
    cy.contains('How to add a hyperlink in Markdown?').click();
    cy.get('#questionBody').find('a').should('have.attr', 'href', 'https://www.google.com');
  });

it('7.4 | Adds an answer with a hyperlink and verifies', () => {
    cy.login('test2','abcd');
    const answers = ['Check this link for more info: [Documentation](https://docs.example.com)', "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.", "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router."];
    // cy.visit('http://localhost:3000');
    cy.login("test2", "abcd");
    cy.get("#que-next").click();
    cy.contains('Programmatically navigate using React router').click();
    cy.contains('Answer Question').click();
    // cy.get('#answerUsernameInput').type('joym');
    cy.get('#answerTextInput').type('Check this link for more info: [Documentation](https://docs.example.com)');
    cy.contains('Post Answer').click();
    cy.get('.answerText').first().within(() => {
        cy.get('a').should('have.attr', 'href', 'https://docs.example.com');
    });
    cy.contains('test2');
    cy.contains('0 seconds ago');
});

it('7.5 |  Tries to add a question with an invalid hyperlink and verifies failure', () => {
    const invalidUrls = [
        '[Google](htt://www.google.com)',
        '[Microsoft](microsoft.com)',
        '[](https://www.google.com/)',
        '[link]()',
        'dfv[]()',
        '[link](http://www.google.com/)',
        '[Google](https//www.google.com)',
        '[GitHub](http//github.com)',
        '[Facebook](https:/facebook.com)',
        '[Twitter](://twitter.com)',
        '[Netflix](htps://www.netflix)',
        '[Google](htts://www.goo<gle.com)',
        '[Google](http://www.google)',
        '[Dropbox](ttps://www.dropbox.c-m)',
        '[LinkedIn](ps:/www.linkedin.com)',
        '[Adobe](ttps://www.adobe..com)',
        '[Spotify](ttp:///www.spotify.com)',
        '[Reddit](http://reddit)',
        '[Wikipedia](tps://www.wikipedia=com)'
    ];
    cy.login('test2', 'abcd');
    cy.contains('Ask a Question').click();
    cy.get('#formTitleInput').type('How to add an invalid hyperlink in Markdown?');
    invalidUrls.forEach((url) => {
        cy.get('#formTextInput').clear().type(`This is an invalid link: ${url}`);
        cy.get('#formTagInput').clear().type('markdown');
        cy.get('#formSummaryInput').clear().type('user1');
        cy.contains('Post Question').click();
        cy.contains('Invalid hyperlink');
    });
    cy.login("test2", "abcd");
    cy.contains('How to add an invalid hyperlink in Markdown?').should('not.exist');
});

it('7.6 | Attempts to add an answer with an invalid hyperlink and verifies failure', () => {
    // cy.visit('http://localhost:3000');

    cy.login("test2", "abcd");
    cy.get("#que-next").click();
    cy.contains('Programmatically navigate using React router').click();
    cy.contains('Answer Question').click();
    cy.get('#answerTextInput').type('Check this invalid link: [](https://wrong.url)');
    cy.contains('Post Answer').click();
    cy.contains('Invalid hyperlink');
    cy.login("test2", "abcd");
    cy.get("#que-next").click();
    cy.contains('Programmatically navigate using React router').click();
    cy.get('.answerText').should('not.contain', 'https://wrong.url');
});


  // Add a comment question < 140 High Reputation
  it('8.1 | Add a comment question < 140 High Reputation', () => {
    cy.login("test2", "abcd");
    cy.contains('new question 5').click();
    const longComment = "test a new comment for question";
    cy.get('#queComment').type(`${longComment}{enter}`);
    cy.get("#question-next").click();
    cy.get('.comment-text').contains(`${longComment}`);
  });

  // Add a comment question < 140 Low Reputation
  it('8.2 | Add a comment question < 140 Low Reputation', () => {
    cy.login("test", "test");
    cy.contains('new question 5').click();
    const longComment = "test a new comment";
    cy.get('#queComment').type(`${longComment}{enter}`);
    cy.contains('Error: Cannot comment, reputation < 50');
    cy.contains(`$longComment`).should('not.exist');
  });

  //Add a comment answer < 140 High Reputation
  it('8.3 | Add a comment answer < 140 High Reputation', () => {
    cy.login("test2", "abcd");
    cy.contains('new question 5').click();
    cy.contains('Answer 9');
    
    cy.get('.answer-individual').first().within(() => {
      // Type a comment in the input field
      const longComment = "test add a new comment";
      cy.get('#ansComment').type(`${longComment}{enter}`);
    });
    
    cy.contains("test add a new comment").should('exist');
  });

   //Add a comment answer < 140 Low Reputation
   it('8.4 | Add a comment answer < 140 Low Reputation', () => {
    cy.login("test", "test");
    cy.contains('new question 5').click();
    cy.contains('Answer 9');
    cy.get('.answer-individual').first().within(() => {
      // Type a comment in the input field
      const longComment = "test add a new comment";
      cy.get('#ansComment').type(`${longComment}{enter}`);
      cy.contains('Error: Cannot comment, reputation < 50');
      cy.contains(`$longComment`).should('not.exist');
    });
  });

  // Add a comment question > 140
  it('8.5 | Add a comment question > 140', () => {
    cy.login("test2", "abcd");
    cy.contains('new question 5').click();
    const longComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque porttitor quam sit amet consectetur interdum. In hac habitasse platea dictumst. Fusce ultrices, mauris non tempor ullamcorper, arcu odio malesuada lectus, nec sagittis orci sem ut quam. Donec interdum nulla vel tincidunt vestibulum. Vivamus dapibus odio ut arcu ullamcorper, vel fermentum libero pellentesque. Proin vel purus nec velit ultrices facilisis id vitae turpis. Suspendisse eu arcu arcu. Phasellus vestibulum nisi et libero semper, vel scelerisque justo cursus. Sed vestibulum ligula vel lacus euismod, vel d    ";
    cy.get('#queComment').type(`${longComment}{enter}`);
    cy.contains('Error: Comment exceeds 140 characters.');
    cy.contains(`$longComment`).should('not.exist');
  });

  //Add a comment answer > 140
  it('8.6 | Add a comment answer > 140', () => {
    cy.login("test2", "abcd");
    cy.contains('new question 5').click();
    cy.contains('Answer 9');
    cy.get('.answer-individual').first().within(() => {
      // Type a comment in the input field
      const longComment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque porttitor quam sit amet consectetur interdum. In hac habitasse platea dictumst. Fusce ultrices, mauris non tempor ullamcorper, arcu odio malesuada lectus, nec sagittis orci sem ut quam. Donec interdum nulla vel tincidunt vestibulum. Vivamus dapibus odio ut arcu ullamcorper, vel fermentum libero pellentesque. Proin vel purus nec velit ultrices facilisis id vitae turpis. Suspendisse eu arcu arcu. Phasellus vestibulum nisi et libero semper, vel scelerisque justo cursus. Sed vestibulum ligula vel lacus euismod, vel d    ";
      cy.get('#ansComment').type(`${longComment}{enter}`);
      cy.contains('Error: Comment exceeds 140 characters.');
      cy.contains(`$longComment`).should('not.exist');
    });
    
  });


  // Upvote question High Reputation 
  it('8.7 | Upvote question High Reputation', () => {
    cy.login("test2", "abcd");
    cy.contains('new question 5').click();
    cy.get('#queUpvote').click()
    cy.get('.que-votes').contains("2 votes");
  });

  // Upvote question Low Reputation 
  it('8.8 | Upvote question Low Reputation', () => {
    cy.login("test", "test");
    cy.contains('new question 5').click();
    cy.get('#queUpvote').click()
      cy.contains('Cannot vote, reputation < 50');
  });

  // Downvote question High Reputation 
  it('8.9 | Downvote question High Reputation', () => {
    cy.login("test2", "abcd");
    cy.contains('new question 5').click();
    cy.get('#queDownvote').click()
      cy.get('.que-votes').contains("0 votes");
  });

  // Downvote question Low Reputation
  it('8.10 | Downvote question Low Reputation', () => {
    cy.login("test", "test");
    cy.contains('new question 5').click();
    cy.get('#queDownvote').click()
      cy.contains('Cannot vote, reputation < 50');
  }); 


  // Upvote answer High Reputation 
  it('8.11 | Upvote answer High Reputation', () => {
    cy.login("test2", "abcd");
    cy.contains('new question 5').click();
    cy.get('.answer-individual').within(() => {
        // Assuming there is at least one answer, select the first one
        cy.get('.vote-buttons').first().within(() => {
          cy.contains('upvote').click();
        });
        cy.get('.ans-votes').contains('1 votes');
    })
  });

  // Upvote answer Low Reputation 
  it('8.12 | Upvote answer Low Reputation', () => {
    cy.login("test", "test");
    cy.contains('new question 5').click();
    cy.get('.answer-individual').within(() => {
      // Assuming there is at least one answer, select the first one
      cy.get('.vote-buttons').first().within(() => {
        cy.contains('upvote').click();
      });
      cy.contains('Cannot vote, reputation < 50');
  })
  });

  // Downvote answer High Reputation 
  it('8.13 | Downvote answer High Reputation', () => {
    cy.login("test2", "abcd");
    cy.contains('new question 5').click();
    cy.get('.answer-individual').within(() => {
        // Assuming there is at least one answer, select the first one
        cy.get('.vote-buttons').first().within(() => {
          cy.contains('downvote').click();
        });
        cy.contains('-1 votes');
    })
  });

//   // Downvote answer Low Reputation 
  it('8.14 | Downvote answer Low Reputation', () => {
    cy.login("test", "test");
    cy.contains('new question 5').click();
    cy.get('.answer-individual').within(() => {
      // Assuming there is at least one answer, select the first one
      cy.get('.vote-buttons').first().within(() => {
        cy.contains('downvote').click();
        cy.contains('downvote').click();
      });
      cy.contains('Cannot vote, reputation < 50');
  })
});

  // accept answer
  it('9.1 | accept answer', () => {
    cy.login("test2", "abcd");
    cy.get('#que-next').click();
    cy.contains('new question 3').click();
    cy.contains('Answer Question').click();
    cy.get("#answerTextInput").type('new ans 1');
    cy.contains('Post Answer').click();
    cy.contains('new ans 1');
    cy.contains('Answer Question').click();
    cy.get("#answerTextInput").type('new ans 2');
    cy.contains('Post Answer').click();
    cy.contains('new ans 2');
    cy.get('#logout').click()
    cy.login("testuser2", "pass2");
    cy.get('#que-next').click();
    cy.contains('new question 3').click();
      // Click the "Accept Answer" button for the first answer
      // Click the "Accept Answer" button for the second answer
    cy.get('.answer-individual').eq(1).within(() => {
    cy.get('#acceptans').should("exist").click();
    });

  // After clicking, check the order of answers
  cy.get('.answer-individual').eq(0).within(() => {
    cy.get('.answerText').should('include.text', 'new ans 1');
  });

  cy.get('.answer-individual').eq(1).within(() => {
    cy.get('.answerText').should('include.text', 'new ans 2');
  });
  

  });

  // prev and next in ans
  it('9.2 | prev and next in ans ans < 5', () => {
    cy.guest();
    cy.contains('new question 5').click();
    cy.get('#ans-prev').should('have.attr', 'disabled');
    cy.get('#ans-next').should('have.attr', 'disabled');
  });

  // prev and next in ans post add ans
  it('9.3 | prev and next in ans ans ', () => {
    cy.login("test2", "abcd");
    cy.contains('new question 4').click();
    cy.contains('Answer Question').click();
    cy.get("#answerTextInput").type('new ans');
    cy.contains('Post Answer').click();
    cy.contains('new ans');
    cy.get('#ans-prev').should('have.attr', 'disabled');
    cy.get('#ans-next').should('not.have.attr', 'disabled');
    cy.get('#ans-next').click();
    cy.contains('I just found all the above examples just too confusing, so I wrote my own. ');
  });


  // prev and next in comment
  it('9.4 | prev and next in comment', () => {
    cy.guest();
    cy.contains('new question 5').click();
    cy.get('#question-prev').should('have.attr', 'disabled');
    cy.get('#question-next').should('not.have.attr', 'disabled');
    cy.contains('Comment 9').should('not.exist');
    cy.contains('Comment 6');
    cy.contains('Comment 7');
    cy.contains('Comment 8');
    cy.contains('Next').click();
    cy.contains('Comment 9');
    cy.contains('Comment 6').should('not.exist');
    cy.contains('Comment 7').should('not.exist');
    cy.contains('Comment 8').should('not.exist');
    cy.get('#question-prev').should('not.have.attr', 'disabled');
    cy.contains('Prev').click()
    cy.contains('Comment 6');
    cy.contains('Comment 7');
    cy.contains('Comment 8');
    cy.contains('Next').click();
    cy.contains('Next').click();
    cy.contains('Comment 6');
    cy.contains('Comment 7');
    cy.contains('Comment 8');
  });

  // upvote a comment que
  it('9.5 | upvote a comment', () => {
    cy.login("test2", "abcd");
    cy.contains('new question 5').click();
    cy.get('.question-comment-section').should('exist').each(($commentsSection, index) => {
      cy.contains('Comment 6');
      cy.wrap($commentsSection).within(() => {
          cy.contains('Upvote').click();
      });
    });
    cy.get('.comment-votes').contains('1 votes')
  });

  // upvote a comment ans
  

//   //upvote comment and    sort
  it('9.6 | upvote comment and active sort', () => {
    cy.login("test2", "abcd");
    cy.contains('new question 5').click();
    cy.get('.question-comment-section').should('exist').each(($commentsSection, index) => {
      cy.contains('Comment 6');
      cy.wrap($commentsSection).within(() => {
          cy.contains('Upvote').click();
      });
    });
    cy.guest();
    cy.contains('Active').click();
    cy.get('.questions-display').find('.question-individual').first().within(() => {
      cy.contains('new question 5');
    });
  });

//   //upvote already upvoted ans
  it('9.7 | upvote already upvoted ans', () => {
    cy.login("test2", "abcd");
      cy.contains('new question 5').click();
      cy.get('.answer-individual').within(() => {
          // Assuming there is at least one answer, select the first one
          cy.get('.vote-buttons').first().within(() => {
            cy.contains('upvote').click();
            cy.contains('upvote').click();
          });
          cy.contains('User has already upvoted on this answer')
      })
  });

  // downvote already downvoted ans
  it('9.8 | downvote already downvoted ans', () => {
    cy.login("test2", "abcd");
      cy.contains('new question 5').click();
      cy.get('.answer-individual').within(() => {
          // Assuming there is at least one answer, select the first one
          cy.get('.vote-buttons').first().within(() => {
            cy.contains('downvote').click();
            cy.contains('downvote').click();
          });
          cy.contains('User has already downvoted on this answer')
      })
  });

  //upvote already upvoted que
  it('9.9 | upvote already upvoted que', () => {
    cy.login("test2", "abcd");
      cy.contains('new question 5').click();
      cy.get('.question-stats').within(() => {
        cy.contains("upvote").click();
        cy.contains("upvote").click();
      });
      cy.get('.question-text-details').within(() => {
        cy.contains("User has already upvoted on this question");
      })
  });

  // downvote already downvoted que
  it('9.10 | downvote already downvoted que', () => {
    cy.login("test2", "abcd");
      cy.contains('new question 5').click();
      cy.get('.question-stats').within(() => {
        cy.contains("downvote").click();
        cy.contains("downvote").click();
      });
      cy.get('.question-text-details').within(() => {
        cy.contains("User has already downvoted on this question");
      })
  });

  // upvote already voted comment
  it('9.11 | upvote already voted comment', () => {
    cy.login("test2", "abcd");
    cy.contains('new question 5').click();
    cy.get('.question-comment-section').should('exist').each(($commentsSection, index) => {
      cy.contains('Comment 6');
      cy.wrap($commentsSection).within(() => {
          cy.contains('Upvote').click();
          cy.contains('Upvote').click();
      });
    });
    cy.get('.question-text-details').within(() => {
      cy.contains("User has already upvoted this comment");
    })
    
    });

  //  guest login que upvote not visible
  it('9.12 | guest login que upvote not visible', () => {
    it('guest login que downvote not visible', () => {
      cy.guest();
      cy.contains('android studio save string shared preference, start activity and load the saved string').click();
      cy.contains('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.').within(
        () => {
          cy.contains('#queUpvote').should('not.exist')
        }
      )
    });
  });
  
  // guest login que downvote not visible
  it('9.13 | guest login que downvote not visible', () => {
    cy.guest();
    cy.contains('android studio save string shared preference, start activity and load the saved string').click();
    cy.contains('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.').within(
      () => {
        cy.contains('#queDownvote').should('not.exist')
      }
    )
  });

  //guest login ans comment upvote not visible
  it('9.14 | guest login ans comment upvote not visible', () => {
    cy.guest();
    cy.contains('android studio save string shared preference, start activity and load the saved string').click();
    cy.contains('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.');
    cy.contains('Thanks for helping.').within(() => {
          cy.get('#upvoteComment').should('not.exist');
        })
  });

  //guest login add que comment not visible
  it('9.15 | guest login add que comment not visible', () => {
    cy.guest();
    // cy.contains('next').click()
    cy.contains('new question 4').click();
    cy.contains('question 4 text').within(() => {  
      // Check that the "downvote" button is not present
      cy.get('#queComment').should('not.exist');
    });
  });

  //guest login add ans comment not visible
  it('9.16 | guest login add ans comment not visible', () => {
    cy.guest();
    cy.contains('new question 5').click();
    cy.contains('Answer 9').within(() => {  
      // Check that the "downvote" button is not present
      cy.get('#ansComment').should('not.exist');
    });
    
  });

   //guest login comment upvote not visible
   it('9.17 | guest login comment upvote not visible', () => {
    cy.guest();
    cy.contains('new question 5').click();
    cy.contains('new question 5').within(() => {  
      // Check that the "downvote" button is not present
      cy.contains('upvote').should('not.exist');
    });
  });

  //  guest login ans upvote not visible
  it('9.18 | guest login ans upvote not visible', () => {
    cy.guest();
    cy.contains('new question 5').click();
    // cy.contains('Answer 9');
    cy.contains('Answer 9').within(() => {  
      // Check that the "downvote" button is not present
      cy.contains('upvote').should('not.exist');
    });
  });
  
  // guest login ans downvote not visible
  it('9.19 | guest login ans downvote not visible', () => {
    cy.guest();
    cy.contains('new question 5').click();
    // cy.contains('Answer 9');
    cy.contains('Answer 9').within(() => {  
      // Check that the "downvote" button is not present
      cy.contains('downvote').should('not.exist');
    });
  });

  it('10.1 | Edit userQuestion', () => {
    cy.login('test2','abcd');
    cy.contains('My Info').click();
    cy.contains('My Questions').click();
    cy.contains("new question 6").click();
    cy.get('#questionTitle').type('new question 6');
    cy.get('#text').type('question 6 text for updating last active');
    cy.get('#summary').type('Q6 summary');
    cy.get('#questionTitle').clear().type('new question 6 - test');
    cy.contains('Save').click();
    cy.contains('My Answers').click();
    cy.contains('My Questions').click();
    cy.contains('My Answers').click();
    cy.contains('new question 6 - test');
});

  it('10.2 | length of userAnswers', () => {
    cy.login('test2','abcd');
    cy.contains('My Info').click();
    cy.contains('My Answers').click();
    cy.contains('Consider using apply() instead; commit writes its');
    cy.get("#my-answer-text").should("have.length.lte", 50);
  });

  it('10.3 | Delete answer deletes votes and comments', () => {
    cy.login('test','test');
      cy.contains('My Info').click();
      cy.contains('My Answers').click();
      cy.contains('Answer 8');
      cy.contains('Your Answers (3)');
      cy.contains('Delete').click();
      cy.contains('My Answers').click();
      cy.contains('My Questions').click();
      cy.contains('My Answers').click();
      cy.contains('Answer 8').should('not.exist');
      cy.get("#sideBarNav-que").click();
      cy.contains('new Question 4').click();
      cy.contains('Answer 8').should('not.exist');
  });

  it('10.4 | Delete tag deletes from all questions', () => {
    cy.login("test2", "abcd");
    cy.contains('My Info').click();

    cy.contains('My Tags').click();
    cy.contains('shared-preferences');
    cy.contains('test-tag');

    cy.contains('Delete').click();
    cy.contains('My Tags').click();
    cy.contains('My Questions').click();
    cy.contains('My Tags').click();

    cy.contains('test-tag').should('not.exist');
    cy.get("#sideBarNav-que").click();
    cy.contains("test-tag").should('not.exist');

  });
  //SEARCH
    it('11.1 | Search string in question text', () => {
      cy.login("test2", "abcd");
        const qTitles = ['android studio save string shared preference, start activity and load the saved string'];
        cy.get('#searchBar').type('navigation{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('11.2 | Search string matches tag and text', () => {
      cy.login("test2", "abcd");
      const qTitles = ['new question 7','new question 5','new question 6','new question 4','android studio save string shared preference, start activity and load the saved string'];
        cy.get('#searchBar').type('navigation [React]{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
        cy.get('#que-next').click();
        const qTitles2 = ['new question 3', 'Programmatically navigate using React router'];
        cy.get('.postTitle').each(($el, index, $list) => {
          cy.wrap($el).should('contain', qTitles2[index]);
      })
      
    })

    //NEW ANSWER PAGE
    it('12.1 | Create new answer should be displayed at the top of the answers page', () => {
      cy.login("test2", "abcd");
        const answers = ["Test Answer 1","On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.", "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node."];
        cy.get("#que-next").click();
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.get('#answerTextInput').type(answers[0]);
        cy.contains('Post Answer').click();
        cy.get('.answerText').each(($el, index) => {
            cy.wrap($el).should('contain', answers[index]);
        });
        cy.contains('test2');
    });


    it('12.2 | Answer is mandatory when creating a new answer', () => {
      cy.login("test2", "abcd");
      cy.get("#que-next").click();
        cy.contains('Programmatically navigate using React router').click();
        cy.contains('Answer Question').click();
        cy.contains('Post Answer').click();
        cy.contains('Answer text cannot be empty');
    });

    //NEW QUESTION
      it('12.3 | Ask a Question creates and displays in All Questions', () => {
        cy.login("test2", "abcd");
          cy.contains('Ask a Question').click();
          cy.get('#formTitleInput').type('Test Question 1');
          cy.get('#formTextInput').type('Test Question 1 Text');
          cy.get('#formSummaryInput').type('Test Summary');
          cy.get('#formTagInput').type('javascript');

          cy.contains('Post Question').click();
          cy.contains('Fake Stack Overflow');
          const qTitles = ['Test Question 1'];
          cy.get('.postTitle').each(($el, index, $list) => {
              cy.wrap($el).should('contain', qTitles[index]);
          });
      });

      it('12.4 | Ask a Question creates and displays in All Questions with necessary tags', () => {
        cy.login("test2", "abcd");
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript t1 t2');
        cy.get('#formSummaryInput').type('Test Summary');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        cy.contains('javascript');
        cy.contains('t1');
        cy.contains('t2');
    })

    
  it('12.5 | Ask a Question with empty title shows error', () => {
    cy.login("test2", "abcd");
    cy.contains('Ask a Question').click();
    cy.get('#formTextInput').type('Test Question 1 Text');
    cy.get('#formTagInput').type('javascript');
    cy.get('#formSummaryInput').type('Test Summary');
    cy.contains('Post Question').click();
    cy.contains('Title cannot be empty');
})

it('12.6 | Ask a Question with long title shows error', () => {
  cy.login("test2", "abcd");
  cy.contains('Ask a Question').click();
  cy.get('#formTitleInput').type('Test Question 0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789');
  cy.get('#formTextInput').type('Test Question 1 Text');
  cy.get('#formTagInput').type('javascript');
  cy.get('#formSummaryInput').type('Test Summary');
  // cy.get('#formUsernameInput').type('joym');
  cy.contains('Post Question').click();
  cy.contains('Title cannot be more than 100 characters');
})


it('12.7 | Ask a Question with more than 5 tags shows error', () => {
  cy.login("test2", "abcd");
  cy.contains('Ask a Question').click();
  cy.get('#formTitleInput').type('Test Question 1');
  cy.get('#formTextInput').type('Test Question 1 Text');
  cy.get('#formTagInput').type('t1 t2 t3 t4 t5 t6');
  cy.get('#formSummaryInput').type('Test Summary');
  cy.contains('Post Question').click();
  cy.contains('Cannot have more than 5 tags');
})

it('12.8 | Ask a Question with a long new tag', () => {
  cy.login("test2", "abcd");
  cy.contains('Ask a Question').click();
  cy.get('#formTitleInput').type('Test Question 1');
  cy.get('#formTextInput').type('Test Question 1 Text');
  cy.get('#formTagInput').type('t1 t2 t3t4t5t6t7t8t9t3t4t5t6t7t8t9');
  cy.get('#formSummaryInput').type('Test Summary');
  cy.contains('Post Question').click();
  cy.contains('New tag length cannot be more than 20');
})

it('12.9 | Ask a Question with no summary', () => {
  cy.login("test2", "abcd");
  cy.contains('Ask a Question').click();
  cy.get('#formTitleInput').type('Test Question 1');
  cy.get('#formTextInput').type('Test Question 1 Text');
  cy.get('#formTagInput').type('t1 t2 t3t4t5t6t7t8t9t3t4t5t6t7t8t9');
  cy.contains('Post Question').click();
  cy.contains('Summary cannot be empty');
})

// SORTING


it("13.1 | Newest Order | Registered User", () => {
  cy.login("test2", "abcd");
  cy.contains("Newest").click();
  const qTitles = ['new question 7','new question 5','new question 6','new question 4','android studio save string shared preference, start activity and load the saved string'];
  cy.get('.postTitle').each(($el, index, $list) => {
    cy.wrap($el).should('contain', qTitles[index]);
})
  cy.get('#que-next').click();
        const qTitles2 = ['new question 3', 'Programmatically navigate using React router'];
        cy.get('.postTitle').each(($el, index, $list) => {
          cy.wrap($el).should('contain', qTitles2[index]);  
      })
});

it("13.2 | Active Order | Registered User", () => {
  const qTitles = ['new question 7','new question 5','new question 6','new question 4','android studio save string shared preference, start activity and load the saved string'];
  cy.login("test2", "abcd");
  cy.contains("Active").click();
    cy.get('.postTitle').each(($el, index, $list) => {
        cy.wrap($el).should('contain', qTitles[index]);
    })
    cy.get('#que-next').click();
        const qTitles2 = ['new question 3', 'Programmatically navigate using React router'];
        cy.get('.postTitle').each(($el, index, $list) => {
          cy.wrap($el).should('contain', qTitles2[index]);  
      })
});

it("13.3 | Unanswered Order | Registered User", () => {
  cy.login("test2", "abcd");
  cy.contains("Unanswered").click();
  cy.contains('3 questions');
});

it("13.4 | Newest Order | Guest User", () => {
  cy.guest();
  cy.contains("Newest").click();
  const qTitles = ['new question 7','new question 5','new question 6','new question 4','android studio save string shared preference, start activity and load the saved string'];
  cy.get('.postTitle').each(($el, index, $list) => {
    cy.wrap($el).should('contain', qTitles[index]);
})
  cy.get('#que-next').click();
        const qTitles2 = ['new question 3', 'Programmatically navigate using React router'];
        cy.get('.postTitle').each(($el, index, $list) => {
          cy.wrap($el).should('contain', qTitles2[index]);  
      })
});


it("13.5 | Active Order | Guest User", () => {

  const qTitles = ['new question 7','new question 5','new question 6','new question 4','android studio save string shared preference, start activity and load the saved string'];
  cy.guest();
  cy.contains("Active").click();
    cy.get('.postTitle').each(($el, index, $list) => {
        cy.wrap($el).should('contain', qTitles[index]);
    })
    cy.get('#que-next').click();
        const qTitles2 = ['new question 3', 'Programmatically navigate using React router'];
        cy.get('.postTitle').each(($el, index, $list) => {
          cy.wrap($el).should('contain', qTitles2[index]);  
      })
});

it("13.6 | Unanswered Order | Guest User", () => {
  cy.guest();
  cy.contains("Unanswered").click();
  cy.contains('3 questions');
});



it('14.1 | Adds multiple questions with valid hyperlinks and verify', () => {
  cy.visit('http://localhost:3000');
  cy.login("test2", "abcd");

  // List of question data
  const questions = [
      { title: 'Test Question 1', text: 'Test Question 1 Text [Google](https://www.google.com)', summary: "question summary", tag: 'javascript', username: 'joym', link:'https://www.google.com' },
      { title: 'Test Question 2', text: 'Test Question 2 Text [Yahoo](https://www.yahoo.com)', summary: "question summary", tag: 'react', username: 'abhi',link:'https://www.yahoo.com' },
      { title: 'How to add a hyperlink in Markdown?', text: 'Here is a link: [Google](https://www.google.com)', summary: "question summary", tag: 'markdown', username: 'user1' ,link:'https://www.google.com'}
  ];

  // Add multiple questions with hyperlinks
  questions.forEach((question) => {
      cy.contains('Ask a Question').click();
      cy.get('#formTitleInput').type(question.title);
      cy.get("#formSummaryInput").type(question.summary);
      cy.get('#formTextInput').type(question.text);
      cy.get('#formTagInput').type(question.tag);
      // cy.get('#formUsernameInput').type(question.username);
      cy.contains('Post Question').click();
  });

  cy.contains('Questions').click();
  cy.contains('10 questions');
  // questions.reverse().forEach(q =>{
  //     cy.contains(q.title).click()
  //     cy.get('#questionBody').find('a').should('have.attr', 'href',q.link);
  //     cy.contains('Questions').click();
  // })
});


  // Upvote question High Reputation  updates reputation

  it('9.20 | Upvote question High Reputation updates reputation', () => {
    cy.login("test2", "abcd");
    cy.contains('new question 5').click();
    cy.get('#queUpvote').click()
    cy.get('.que-votes').contains("2 votes");
    cy.get("#logout").click();
    cy.login("test3", "pass3");
    cy.get("#myInfo").click();
    cy.contains("Reputation: 35")

  });

  // Downvote question High Reputation updates reputation

  it('9.21 | Downvote question High Reputation updates reputation', () => {
    cy.login("test2", "abcd");
    cy.contains('new question 5').click();
    cy.get('#queDownvote').click()
      cy.get('.que-votes').contains("0 votes");
      cy.login("test3", "pass3");
    cy.get("#myInfo").click();
    cy.contains("Reputation: 20")
  });

})

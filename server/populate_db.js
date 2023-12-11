// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
let userArgs = process.argv.slice(2);
const bcrypt = require('bcrypt');

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let User = require('./models/users')
let Comment = require('./models/comments')


let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


function tagCreate(name, user) {
  let tag = new Tag({ name: name, created_by: user , upvoted_by: []});
  return tag.save();
}

function answerCreate(text, ans_by, ans_date_time, votes, comments) {
  answerdetail = {text:text, upvoted_by: [], downvoted_by: []};
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  if (votes != false)answerdetail.votes = votes;
  if (comments != false)answerdetail.comments = comments;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, text, summary, tags, answers, asked_by, ask_date_time, views, votes, comments, accepted_ans, last_activity, upvoted_by, downvoted_by ) {
  qstndetail = {
    title: title,
    text: text,
    summary: summary,
    tags: tags,
    asked_by: asked_by
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;
  if(votes != false)  qstndetail.votes = votes;
  if(comments != false)  qstndetail.comments = comments;
  if(accepted_ans != false)  qstndetail.accepted_ans = accepted_ans;
  if(last_activity != false) qstndetail.last_activity = last_activity;
  if(upvoted_by != false) qstndetail.upvoted_by = upvoted_by;
  if(downvoted_by != false) qstndetail.downvoted_by = downvoted_by;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

const userCreate = async (username, email, password, reputation, register_date) => {
  // Hash the password before saving it to the database
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  usrdetail = {
    username: username,
    email:  email,
    password: hashedpassword
  }
  if(reputation != false) usrdetail.reputation = reputation;
  if(register_date != false) usrdetail.register_date = register_date;
  let usr = new User(usrdetail);
  return usr.save();
}

function commentCreate(text, votes, posted_by) {
  cmtdetail = {
    text: text,
    posted_by: posted_by
  }
  if(votes != false) cmtdetail.votes = votes;
  let cmt = new Comment(cmtdetail);
  return cmt.save();
}

const populate = async () => {
  let u1 = await userCreate('test', 'abc@northeastern.edu', 'test', false, false);
  let u2 = await userCreate('testuser2', 'id2@gmail.com', 'pass2', 55, false);
  let u3 = await userCreate('test3', 'testemail@yahoo.com', 'pass3', 30, new Date('2023-05-08T12:13:39'));
  let u4 = await userCreate('test2', 'test2@gmail.com', 'abcd', 60, false);
  let t1 = await tagCreate('react', u2);
  let t2 = await tagCreate('javascript', u1);
  let t3 = await tagCreate('android-studio', u3);
  let t4 = await tagCreate('shared-preferences', u4);
  let t5 = await tagCreate('test-tag', u4);
  let c1 = await commentCreate('Thanks for helping.',false, u2);
  let c2 = await commentCreate('React routers are also used for tasks including ...', 2, u3);
  let c3 = await commentCreate('I am also stuck on the same question. Any further help here would be helpful', false, u4);
  let c4 = await commentCreate('Any leads on this question.', 3, u1);
  let c5 = await commentCreate('Comment 5', false, u4);
  let c6 = await commentCreate('Comment 6', false, u2);
  let c7 = await commentCreate('Comment 7', false, u1);
  let c8 = await commentCreate('Comment 8', false, u3);
  let c9 = await commentCreate('Comment 9', false, u2);
  let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', u1, new Date('2023-11-20T03:24:42'));
  let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', u2, new Date('2023-11-25T08:24:00'), 2, false);
  let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', u4, new Date('2023-11-18T09:24:00'), 3, [c1]);
  let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', u2, new Date('2023-11-12T03:30:00'), false, [c2,c3,c4]);
  let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', u1, new Date('2023-11-01T15:24:19'), 10, false);
  let a6 = await answerCreate('Answer to test pagination', u2, new Date(),false, [c1,c2,c3, c4]);
  let a7 = await answerCreate('Answer 7', u2, new Date(),false, false);
  let a8 = await answerCreate('Answer 8', u1, new Date(),false, false);
  let a9 = await answerCreate('Answer 9', u3, new Date(),false, false);

  await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', 'Summary for Q1', [t1, t2], [a1, a2], u1, new Date('2022-01-20T03:24:00'), false, false, false, false, false, false, false);
  await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', 'Summary for Q2', [t3, t4, t2], [a3], u2, new Date('2023-10-01T11:24:30'), 121, false, false, false, false, false, false);
  await questionCreate('new question 3', 'new question 3 text', 'Q3 summary', [t1,t3,t4], false, u2, new Date('2023-08-12T11:15:37'),120, 3, false, false, false,false, false)
  await questionCreate('new question 4', 'question 4 text', 'A longer summary. This summary is to test the appearance of question when it overflows from the div', [t1, t3], [a4,a5,a6,a7,a8], u1,new Date('2023-10-10T11:11:13'), 1, 1, [c5], false, false,false, false);
  await questionCreate('new question 5', 'question 5 text for accepted answer', 'Summary Q5', [t1, t3], a9, u3, new Date('2023-11-10T11:11:13'), 10, 1, [c6, c7,c8, c9], false, false,false, false);
  await questionCreate('new question 6', 'question 6 text for updating last active', 'Q6 summary', [t1, t3,t5], false, u4, new Date('2023-11-10T11:11:13'), 10, 1, false, false, new Date('2023-12-01T11:11:13'),false, false);
  await questionCreate('new question 7', 'question 7 text for testing answer page scrolling', 'Test Summary for Q7', [t1, t3, t2], false, u1, new Date(), false, false, false, false, new Date('2023-12-01T11:11:13'),false, false);
  if(db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');

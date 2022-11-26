// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import { getDatabase, ref, set, child, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
// import {questionObj} from "/postQuiz.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDnxQcy9tza0KU4-NaW4hlgh3dJ2J49w5k",
    authDomain: "quizapp-with-db.firebaseapp.com",
    databaseURL: "https://quizapp-with-db-default-rtdb.firebaseio.com",
    projectId: "quizapp-with-db",
    storageBucket: "quizapp-with-db.appspot.com",
    messagingSenderId: "797756880516",
    appId: "1:797756880516:web:6d78c8713a7eb00a4e74d1",
    measurementId: "G-Y9P20DS2LS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();

// Getting Id's
var question = document.getElementById('textAreaQuestion');
var answereKey = document.getElementById('answereKey');
// Options Array 
var allOptions = [];

// getData function variables
var quizArray = [];
var questionObj;
var currentindex = 0;

var currentcount = document.getElementById('currentcount');
var totalcount = document.getElementById('totalcount');
var completeQuestion = document.getElementById('completeQuestion');
var allOption = document.getElementById('allOption');
// var button = document.getElementById('button');
// console.log(button);
var nextBtn = document.getElementById('next');
// var previousBtn = document.getElementById('previous');
var congOrBluck = document.getElementById('congOrBluck');
var eachQuestionNumber = 0;
var totalmarks;
var inputs = document.getElementsByTagName('INPUT');



window.postQuestions = function (e) {
    e.preventDefault();
    console.log(question.value);
    questionObj = {
        question: `${question.value}`,
        options: allOptions,
        correctAns: answereKey.value,
        dateTime: JSON.stringify(new Date())
    }
    const keyRef = ref(database, "admin/")
    questionObj.id = push(keyRef).key;

    console.log(questionObj.id);

    const questionReference = ref(database, `Questions/${questionObj.id}`);

    for (var i = 0; i < inputs.length; i++) {
        const element = inputs[i].value;
        if (element != "" && element != " " && answereKey.value != "") {

            set(questionReference, questionObj);
            console.log(questionObj);

            setTimeout(function () {
                location.replace("/postquiz.html");
            }, 1000);

        }
    }
 
    console.log(questionObj);
    


};

window.getData = function () {


    const questionReference = ref(database, "Questions/");
    onChildAdded(questionReference, function (data) {
        console.log(data.val());
        var fechedData = data.val();

        console.log(fechedData, 'fechedData')
        quizArray.push(fechedData);


        // Get Data End 
        // ===================================================
        init();
        totalmarks = quizArray.length * 10


    });

}

function init() {

    allOption.innerHTML = "";

    var index = currentindex + 1;
    currentcount.innerHTML = index
    totalcount.innerHTML = quizArray.length;
    completeQuestion.innerHTML = quizArray[currentindex].question

    // Now for options we need loop
    // console.log(quizArray[currentindex].options);
    for (var i = 0; i < quizArray[currentindex].options.length; i++) {
        var options = quizArray[currentindex].options[i];
        // console.log(`${quizArray[currentindex].correctAns}`);
        allOption.innerHTML += `<button class='options' onclick="marks('${options}','${quizArray[currentindex].correctAns}')">
                ${options}</button>`;
        // console.log(options,"here it is");
    }

}


window.next = function () {
    allOption.innerHTML = '';

    if (currentindex == quizArray.length - 1) {
        var percentage = 0;
        nextBtn.className = "Disabled";
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('totalquestions').innerHTML = quizArray.length
        document.getElementById('totalmarkss').innerHTML = totalmarks;

        var obtainedMArks = document.getElementById('ObtainedMarks').innerHTML = eachQuestionNumber;

        // Percentage Of Student;
        percentage = (obtainedMArks / totalmarks) * 100;
        // console.log(percentage ); 
        document.getElementById('percentage').innerHTML = (percentage) + " %";
        if (percentage >= 50) {
            document.getElementById('status').innerHTML = 'Pass';
            document.getElementById('status').style = "color:green"
            congOrBluck.innerHTML = ' Congratulations <i style="color:green; " class="fa-solid fa-circle-check"></i>';
        } else {
            document.getElementById('status').innerHTML = 'Fail';
            document.getElementById('status').style = "color:red"
            congOrBluck.innerHTML = ' Better Luck Next Time  <i style="color:red " class="fa-solid fa-face-frown"></i>';
        }

    } else {
        currentindex++
        init();
    }

    // previousBtn.className = "Enabled";
    // checkForPreIndex = currentindex;



}
window.marks = function (userSelect, correctAnswer) {
    console.log(userSelect);
    console.log(correctAnswer);

    if (userSelect == correctAnswer) {

        eachQuestionNumber += 10
        // console.log(eachQuestionNumber);

    }
}

// =====================================================================

// Front End Js Start Here Of Post Question Form 

window.createOptionField = function () {
    {/* <input type="text" name="" id="optionField" placeholder="option..."><br></br> */ }
    var optionstext = document.getElementById("optionstext");
    var optionappend = document.getElementById("optionappend");

    console.log(optionappend);
    if (optionstext.value != "" && optionstext.value != " ") {
        optionappend.innerHTML += `<li class="li" ><button class="optionsli" type="button" id="options" onclick="getCorrectKey(this)"> <b id="optionsVal">${optionstext.value}</b></button></li>`;
    }

    // get options value
    var allOptionsValue = optionstext.value;

    // options value push in array 
    allOptions.push(allOptionsValue);
    console.log(allOptions);

    optionstext.value = "";
}
window.getCorrectKey = function (options) {
    var answereKey = document.getElementById("answereKey");
    var innerHtmlOfSelectedOptions = options.childNodes[1].innerHTML;
    answereKey.value = innerHtmlOfSelectedOptions;

    console.log(options);
}
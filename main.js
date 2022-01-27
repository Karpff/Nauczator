const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());   
if(!params.set)
{
    var set = prompt("Wprowadź skrót przedmiotu (bke,padw,rp,bkeEGZ)");
    window.location = window.location+"?set="+set;
}
var questions = questionSets[params.set];

var question;
var questionNum = questions.length;
var rite;
var last20 = [];
var rightAnswers = 0;
var allAnswers = 0;
var answered = false;

function getQuestion()
{
    answered = false;
    if(questions.length == 0)
    {
        $("#question")[0].innerHTML = "Nie ma już więcej pytań";
    }
    else 
    {
        answersHTML = "";
        question = Math.floor(Math.random()*questions.length);
        $("#question")[0].innerHTML = questions[question].q;
        let answers = questions[question].a;
        rite = answers[0];
        var indexes = [];
        for(let i in answers){indexes.push(i)}
        for(let i=0;i<answers.length;i++)
        {
            let nr = Math.floor(Math.random()*indexes.length)
            answersHTML += `<div class="alert alert-primary answer" id="a${i}">${answers[indexes[nr]]}</div>`
            indexes.splice(nr,1);
        }
        $("#answers")[0].innerHTML = answersHTML;
        $("#questionSuccessRate")[0].innerHTML = ``
        $(".answer").click(onAnswerClick);
    }
}

function onAnswerClick(e)
{
    if(!answered)
    {
        answered = true;
        if(e.target.innerHTML == rite)
        {
            questions[question].right++;
            rightAnswers++;
            last20.push(true);
            if(last20.length > 20)last20.shift();
            $("#"+e.target.id).removeClass("alert-primary").addClass("alert-success");
        }
        else
        {
            questions[question].wrong++;
            last20.push(false);
            if(last20.length > 20)last20.shift();
            $("#"+e.target.id).removeClass("alert-primary").addClass("alert-danger");
            Array.from(document.getElementsByClassName("answer")).forEach(ele=>
            {
                if(ele.innerHTML == rite)
                {
                    ele.classList.remove("alert-primary");
                    ele.classList.add("alert-success");
                }
            });
        }
        allAnswers++;
        $("#progressLast20")[0].innerHTML = `${Math.floor(last20.filter(x=>x).length/last20.length*100)}%`;
        $("#progressLast20").css("width",`${last20.filter(x=>x).length/last20.length*100}%`);
        $("#progressAll")[0].innerHTML = `${Math.floor(rightAnswers/allAnswers*100)}%`;
        $("#progressAll").css("width",`${rightAnswers/allAnswers*100}%`);
        $("#questionSuccessRate")[0].innerHTML = `Twoje poprawne/niepoprawne odpowiedzi na to pytanie: <span class="badge badge-success">${questions[question].right}</span> | <span class="badge badge-danger">${questions[question].wrong}</span>`
    }
}


window.addEventListener("load",_=>
{
    getQuestion();
    $("#questionNum")[0].innerHTML = questionNum;
    questions.forEach(q=>
    {
        q.right = 0;
        q.wrong = 0;
    });

    $(".answer").click(onAnswerClick);

    $("#nextBtn").click(getQuestion);
    $("#deleteBtn").click(_=>
    {
        questions.splice(question,1);getQuestion();
        $("#progressQuestions")[0].innerHTML = `${Math.floor(100-(questions.length/questionNum)*100)}%`;
        $("#progressQuestions").css("width",`${100-(questions.length/questionNum)*100}%`);
    });

    document.getElementById("showAllBtn").setAttribute('href',"allQuestions.html?set="+params.set);
});

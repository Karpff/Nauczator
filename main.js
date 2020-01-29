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
        question = Math.floor(Math.random()*questions.length);
        $("#question")[0].innerHTML = questions[question].q;
        rite = questions[question].a[0];
        var points = [0,1,2,3];
        for(let i=0;i<4;i++)
        {
            let nr = Math.floor(Math.random()*points.length)
            $("#a"+i)[0].innerHTML = questions[question].a[points[nr]];
            points.splice(nr,1);
        }
        Array.from(document.getElementsByClassName("answer")).forEach(ele=>
        {
            ele.classList.remove("alert-danger");
            ele.classList.remove("alert-success");
            ele.classList.add("alert-primary");
        });
        $("#questionSuccessRate")[0].innerHTML = ``
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

    $(".answer").click(e=>
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
    });

    $("#nextBtn").click(getQuestion);
    $("#deleteBtn").click(_=>
    {
        questions.splice(question,1);getQuestion();
        $("#progressQuestions")[0].innerHTML = `${Math.floor(100-(questions.length/questionNum)*100)}%`;
        $("#progressQuestions").css("width",`${100-(questions.length/questionNum)*100}%`);
    });
});

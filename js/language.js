var randomNumber, randomChara;
var correct, errorcharacterList, hitSequence = 0, record = 0;
var characterList = CompleteArray();
correct = 0;
errorcharacterList = 0;

function VerifyRecord()
{
    if(localStorage.getItem("recordRussian") != null)
    {
        record = parseInt(localStorage.getItem("recordRussian"));
    }
    else
    {
        localStorage.setItem("recordRussian", 0);
    }
    document.getElementById("record").innerHTML = record;
}

function SetQuestion()
{
    VerifyRecord();
    randomNumber = Math.round(Math.random() * (characterList.length - 1)); //só precisa alterar aqui caso adicione mais elementos ou remova
    console.log(randomNumber);
    randomChara = "&#" + characterList[randomNumber] + ";";
    document.getElementById("question").innerHTML = randomChara;
}
    
function DisplayScore()
{
    document.getElementById("right").innerHTML = correct;
    document.getElementById("wrong").innerHTML = errorcharacterList;
    document.getElementById("sequence").innerHTML = hitSequence;
}
    
function Check(x)
{
    if (document.getElementById(characterList[randomNumber]).style.background = "aquamarine")
    {
        if(VerifyLines(randomNumber))
        {
            document.getElementById(characterList[randomNumber]).style.background = "#f2f2f2"; // faffd2  
        }
        else
        {
            document.getElementById(characterList[randomNumber]).style.background = "transparent";
        }
        
        console.log(characterList[randomNumber]);
    }

    if (parseInt(x) == characterList[randomNumber])
    {
        correct++;
        hitSequence++;
        SetRecord();
        DisplayScore();
        SetQuestion();
    }
    else
    {
        //armazenar a id do elemento com cor diferente
        //depois pegar ele para verificar a linha e por fim, voltar para a cor padrão
        document.getElementById(characterList[randomNumber]).style.background = "aquamarine";
        errorcharacterList++;
        DisplayScore();
    }
}

function SetRecord()
{
    if(hitSequence >= record)
    {
        record = hitSequence;
        localStorage.setItem("recordRussian", record);
        document.getElementById("record").innerHTML = record;
    }
    hitSequence = 0;
}

function ResetRecord()
{
    localStorage.clear();
    correct = 0;
    errorcharacterList = 0;
    hitSequence = 0;
    record = 0;
    DisplayScore();
    document.getElementById("record").innerHTML = record;
}

function CompleteArray()
{
    var newArray = Array(1053, 1071, 1042, 1067, 1056, 1057, 1055, 1060, 
        1043, 1051, 1059, 1047, 1061, 1062, 1063, 1064, 1065, 1066, 1068, 
        1040, 1045, 1025, 1046, 1048, 1049, 1050, 1052, 1054, 1058, 1069, 
        1070, 1044);
    return newArray;
}

function VerifyLines(n)
{
    verify = false;
    var a = Array(19,18,2,8,31,29,29,0,27,6,4,5,16,30,28,1,3,20);

    for (i = 0; i < a.length; i++)
    {
        if(n == a[i])
        {
            verify = true
        }
    }

    return verify;
}
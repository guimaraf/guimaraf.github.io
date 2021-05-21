shortyLink = () => {
  var initialValue = document.getElementById("originalLink").value;
  if(initialValue !== ""){
    $.getJSON( "https://is.gd/create.php?callback=?", {
    url: initialValue,
    format: "json"
    }).done(function( data ) {
        let newLink = data.shorturl;
        console.log(newLink);
        resultShorty(newLink);
    });
  }
  else{
    resultBlank();
  }
}

resultBlank = () =>{
  console.log("blank");
  document.getElementById("inputBlank").innerHTML = "O campo abaixo não possui um link"

  setTimeout(()=> {
     document.getElementById("inputBlank").innerHTML = "";
    }, 3000);
}

resultShorty = (res) => {
  let verifyRes = res!==undefined ? res : "Link inválido, verifique o link antes de gerar";
  let inputGenerate = `<input type="text" id="generateLink" value="${verifyRes}"/>`;
 
  let returnInfo = inputGenerate + ' <button type="button" class="pure-button pure-button-primary" onclick="copyClipboard();" >Copiar link</button>';
  document.getElementById("result").innerHTML = returnInfo;
}

copyClipboard = () => {
  var copyText = document.getElementById("generateLink");

  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/

  document.execCommand("copy");
}
shortyLink = () => {
  var valor = document.getElementById("originalLink").value;
  $.getJSON( "https://is.gd/create.php?callback=?", {
    url: valor,
    format: "json"
}).done(function( data ) {
    let novolink = data.shorturl;
  console.log(novolink);
  resultShorty(novolink);
});
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
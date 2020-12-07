textInImage = () => {
  var valor = document.getElementById("originalText").value;
  console.log(valor);
  
  let completText = ""
  for (i = 0; i < 10; i++){
    completText += valor + "<br>"
    console.log(completText);
  }

  document.getElementById("textImage").innerHTML = completText;
}

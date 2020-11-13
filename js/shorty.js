function shortyLink() {
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

function resultShorty(res){
  document.getElementById("result").innerHTML = res!==undefined ? "Link Gerado <br><br>" + res : "Erro ao gerar link"
}
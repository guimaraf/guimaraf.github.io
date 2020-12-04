var xmlhttp = new XMLHttpRequest();
var url = "meu_json.json"; // caminho do arquivo

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
        handle(myArr);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

// onde ajax/meu_json.json é o caminho do arquivo
$.getJSON( "arquivo.json", function( data ) {
  console.log('asasas');
  // forEach aqui para criar o select a partir de data
});



//let tempStates = 'Acre,Alagoas,Amapá,Amazonas,Bahia,Ceará,Distrito Federal,Espírito Santo,Goiás,Maranhão,Mato Grosso,Mato Grosso do Sul,Minas Gerais,Pará,Paraíba,Paraná,Pernambuco,Piauí,Rio de Janeiro, Rio Grande do Norte,Rio Grande do Sul,Rondônia,Roraima,Santa Catarina,São Paulo,Sergipe,Tocantins'
let statesBrazil = 'Acre,Alagoas,Amapá,Amazonas,Bahia,Ceará,Distrito Federal,Espírito Santo,Goiás,Maranhão,Mato Grosso,Mato Grosso do Sul,Minas Gerais,Pará,Paraíba,Paraná,Pernambuco,Piauí,Rio de Janeiro, Rio Grande do Norte,Rio Grande do Sul,Rondônia,Roraima,Santa Catarina,São Paulo,Sergipe,Tocantins'.split(',')

console.log(statesBrazil)

console.log(statesBrazil[3])
let clearForm = () => {
  //Limpa valores do formulário de cep.
  document.getElementById('rua').value=("");
  document.getElementById('bairro').value=("");
  document.getElementById('cidade').value=("");
  document.getElementById('uf').value=("");
}

let myCallback = (conteudo) => {
  if (!("erro" in conteudo)) {
    //Atualiza os campos com os valores.
    document.getElementById('rua').value=(conteudo.logradouro);
    document.getElementById('bairro').value=(conteudo.bairro);
    document.getElementById('cidade').value=(conteudo.localidade);
    document.getElementById('uf').value=(conteudo.uf);
  } 
  else {
    //CEP não Encontrado.
    clearForm();
    alert("CEP não encontrado.");
  }
}

document.addEventListener('keydown', function(event) {
  if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      getCep();
      //console.log('A tecla Enter foi pressionada!');
  }
});

let getCep = () => {
  let cep = document.getElementById('infoCep').value;

  if (cep != "") {
    var validacep = /^[0-9]{8}$/;

    //Valida o formato do CEP.
    if(validacep.test(cep)) {

        //Preenche os campos com "..." enquanto consulta webservice.
        document.getElementById('rua').value="...";
        document.getElementById('bairro').value="...";
        document.getElementById('cidade').value="...";
        document.getElementById('uf').value="...";

        //Cria um elemento javascript.
        var script = document.createElement('script');

        //Sincroniza com o callback.
        script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=myCallback';

        //Insere script no documento e carrega o conteúdo.
        document.body.appendChild(script);
    } 
    else {
        clearForm();
        alert("Formato de CEP inválido.");
    }
  }
  else {
    clearForm();
  }
};
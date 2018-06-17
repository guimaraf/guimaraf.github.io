<?php
    // Array com dados
    $cliente1 = array(
        'codigo'   => '001',
        'nome'     => 'William',
        'telefone' => '012 9999-6352'
    );
    
    $cliente2 = array(
        'codigo'   => '002',
        'nome'     => 'Adriano',
        'telefone' => '012 8888-4452'
    );
    
    $cliente3 = array(
        'codigo'   => '003',
        'nome'     => 'Maria',
        'telefone' => '013 3434-4444'
    );
    
    // Atribui os 3 arrays para apenas um array
    $dados = array($cliente1, $cliente2, $cliente3);
    
    // Tranforma o array $dados em JSON
    $dados_json = json_encode($dados);
    
    // Cria o arquivo cadastro.json
    // O parâmetro "a" indica que o arquivo será aberto para escrita
    $fp = fopen("cadastro.json", "a");
    
    // Escreve o conteúdo JSON no arquivo
    $escreve = fwrite($fp, $dados_json);
    
    // Fecha o arquivo
    fclose($fp);
?>
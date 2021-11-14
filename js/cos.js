//API base
//https://www.coingecko.com/api/documentations/v3#/

//json usado
//https://api.coingecko.com/api/v3/simple/price?ids=contentos&vs_currencies=usd

let cosDolValue = 0
let dolValueInReal = 0

const allChannels = [
    {name: '500 Pop de Games', id: '27438164387210240'},
    {name: 'Antiguera Gamer', id: '15477494811371520'},
    {name: 'Atmafalcon', id: '20143686938175488'},
    {name: 'BatCat Plays', id: '22408999366993920'},
    {name: 'BrBrock', id: '27999853156411392'},
    {name: 'Brutalkillgamer', id: '17599791412455424'},
    {name: 'Canal do Z3OX1S', id: '27193916548883456'},
    {name: 'Canal GMT Gaming', id: '20943083979057152'},
    {name: 'Canal do Templário', id: '16516954775267328'},
    {name: 'Celo jogando', id: '23979822751589376'},
    {name: 'Chrono Plays', id: '16791718469478400'},
    {name: 'Caverna', id: '16690040201455616'},
    {name: 'Coyote', id: '21690947436718080'},
    {name: 'Dan BraveHeart', id: '17834881468770304'},
    {name: 'DØGG亗', id: '29183508399432704'},
    {name: 'Geek Gamer BR', id: '20041833364497408'},
    {name: 'Furius', id: '27823601740850176'},
    {name: 'GAMERETC', id: '19135801298167808'},

    {name: 'Gamer Nostalgico', id: '31943404449343488'},
    {name: 'Gus Leone', id: '27006563815171072'},
    {name: 'HunTerZ', id: '22225658858612736'},
    {name: 'Joe do Antigão', id: '21094124290222080'},
    {name: 'Kuro Suzume Games', id: '17579798837241856'},
    {name: 'Maicom💖', id: '21276004965065728'},
    {name: 'MajimaZ', id: '23422430360545280'},
    {name: 'Mimosinha', id: '26990215479601152'},
    {name: 'Miyu4Gamer', id: '17248160209348608'},

    {name: 'Mundo Geek', id: '22551370915292160'},
    {name: 'Noobcardoremake', id: '19717788094604288'},
    {name: 'Nosvh12', id: '30137551099700224'},
    {name: 'o2🅺a🅶🅴', id: '16544443442571264'},
    {name: 'Overpower Games', id: '19217437503956992'},
    {name: 'Paulinux Games', id: '19199883234682880'},
    {name: 'Pegasus', id: '18017024920168448'},
    {name: 'PrimaziaGameplays', id: '18607579884857344'},
    {name: 'Rapidinho Seven', id: '17363153098287104'},
    {name: 'Rush Run Luciano', id: '27824218238003200'},
    {name: 'SHADOW NB', id: '27150632344266752'},
    {name: 'Swift Games', id: '19179146257277952'},
    {name: 'Tchan79 Games', id: '25263410326184960'},
    {name: 'TiLt Games', id: '18611709025626112'},
    {name: 'Walker Tv', id: '18085401595389952'},
    {name: 'Wukong (King)', id: '25176487257089024'},
    {name: 'z_Loki', id: '29123359075902464'}
  ]

let updateList = () =>{

    getDolValue()
    getImage()

    let contentData = ''
    let limit = 1
    
    for (let i = 0; i < allChannels.length; i++){
        if(limit < 2){
            contentData = `<center><b><a href="https://cos.tv/channel/${allChannels[i].id}" target="_blank" >${allChannels[i].name}</a></b><br> </center>`
            document.getElementById("cosChannelsLeft").innerHTML += contentData
            limit = 2
        }
        else{
            contentData = `<center><b><a href="https://cos.tv/channel/${allChannels[i].id}" target="_blank" >${allChannels[i].name}</a></b><br> </center>`
            document.getElementById("cosChannelsRight").innerHTML += contentData
            limit = 1
        }
    }
}

//open json from api
const getImage = async() =>{
	const api = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=contentos&vs_currencies=usd')
	if(api.ok){
		const res = await api.json()
        if(res != null){
            console.log(res)
            cosDolValue = res.contentos.usd
            dolReal = parseFloat(dolValueInReal)
            document.getElementById("cosValue").innerHTML = 'Valor de 1 Cos U$ ' + res.contentos.usd.toFixed(4) + '<br> Valor do dólar R$ ' + dolReal.toFixed(2) + '<br> Valor do COS em real R$ ' + (dolReal * cosDolValue).toFixed(2)
        }
	}
}

const getDolValue = async() =>{
	const api2 = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL')
	if(api2.ok){
		const res2 = await api2.json()
        console.log(res2)

        if(res2 != null){
            console.log(res2.USDBRL.ask)
            dolValueInReal = res2.USDBRL.ask
            //document.getElementById("realDolValue").innerHTML = 'O valor do dólar agora é de R$ '
        }
	}
}

//https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL

//cotação do realperante o dólar
//calcular o valor do cos em reais
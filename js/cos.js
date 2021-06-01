const allChannels = [
    {name: 'Antiguera Gamer', id: '15477494811371520'},
    {name: 'Canal do Z3OX1S', id: '27193916548883456'},
    {name: 'Canal GMT Gaming', id: '20943083979057152'},
    {name: 'Chrono Plays', id: '16791718469478400'},
    {name: 'Caverna', id: '16690040201455616'},
    {name: 'Coyote', id: '21690947436718080'},
    {name: 'Dan BraveHeart', id: '17834881468770304'},
    {name: 'Geek Gamer BR', id: '20041833364497408'},
    {name: 'Gus Leone', id: '27006563815171072'},
    {name: 'HunTerZ', id: '22225658858612736'},
    {name: 'Joe do Antigão', id: '21094124290222080'},
    {name: 'Kuro Suzume Games', id: '17579798837241856'},
    {name: 'Mimosinha', id: '26990215479601152'},
    {name: 'Miyu4Gamer', id: '17248160209348608'},
    {name: 'o2🅺a🅶🅴', id: '16544443442571264'},
    {name: 'Pegasus', id: '18017024920168448'},
    {name: 'Rapidinho Seven', id: '17363153098287104'},
    {name: 'Rush Run Luciano', id: '27824218238003200'},
    {name: 'Swift Ganes', id: '19179146257277952'},
    {name: 'TiLt Games', id: '18611709025626112'},
    {name: 'Walker Tv', id: '18085401595389952'},
    {name: 'Xandão Gamers', id: '27774951872964608'}
  ]

let updateList = () =>{
    let contentData = ''
    let limit = 1
    
    for (let i = 0; i < allChannels.length; i++){
        if(limit < 2){
            //contentData = `<b><a href="https://cos.tv/channel/${allChannels[i].id}" target="_blank" >${allChannels[i].name}</a> ${addSpaces(allChannels[i].name)}</b>`
            contentData = `<b><a href="https://cos.tv/channel/${allChannels[i].id}" target="_blank" >${allChannels[i].name}</a>${addSpacesNew()}</b>`
            document.getElementById("cosChannels").innerHTML += contentData
            limit = 2
        }
        else{
            contentData = `<b><a href="https://cos.tv/channel/${allChannels[i].id}" target="_blank" >${allChannels[i].name}</a></b> <br>`
            document.getElementById("cosChannels").innerHTML += contentData
            limit = 1
        }
    }
}

let addSpaces = (word) =>{
    let allSpaces = ''
    for(let i = 0; i < 30 - word.length; i++){
        allSpaces+= '&nbsp'
    }
    return allSpaces
}

let addSpacesNew = () => {
    let a = '&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp'
    let b = '&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp'
    return a + '|' + b
}
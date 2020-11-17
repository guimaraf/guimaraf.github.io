let songs = {
  "Test1" : {
    url : "files/Boing_Boing.webm"
  },
  "Test2" : {
    url : "files/gamesaved.wav"
  }
}

playSound = (name) => new Audio(songs[name].url).play()
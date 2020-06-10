import Quagga from 'quagga'; // ES6

Quagga.init({
  inputStream : {
    name : "Live",
    type : "LiveStream",
    target: document.querySelector('#camera')    // Or '#yourElement' (optional)
  },
  decoder : {
    readers : ["code_128_reader"]
  }
}, function(err) {
    if (err) {
        console.log(err);
        return
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
});

Quagga.onDetected(function (data){
  console.log(data)
})

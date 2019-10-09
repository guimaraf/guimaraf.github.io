function downloadimage(){
    //alert(document.getElementById("ww"));
    var container = document.getElementById("htmltoimage"); // full page 
    html2canvas(container,{allowTaint : true}).then(function(canvas) {
        var link = document.createElement("a");
        document.body.appendChild(link);
        link.download = "about.jpg";
        link.href = canvas.toDataURL();
        link.target = '_blank';
        link.click();
    });
}
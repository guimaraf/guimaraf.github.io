// Create a document fragment to hold the resized images and elements
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Create a document fragment to hold the resized images and elements
const fragment = document.createDocumentFragment();

function resizeImage(image) {
    const isSquare = image.width === image.height;
    const resolutions = getCheckboxConstruct() ? getConstructResolutions() : isSquare ? getSquareResolutions() : getRectangularResolutions();

    for (let i = 0; i < resolutions.length; i++) {
        const [width, height] = resolutions[i];
        canvas.width = width;
        canvas.height = height;

        if(!getCheckInterpolate()){
            // Desenha a imagem redimensionada sem interpolação
            ctx.mozImageSmoothingEnabled = false; // Firefox
            ctx.webkitImageSmoothingEnabled = false; // Chrome e Safari
            ctx.msImageSmoothingEnabled = false; // IE
            ctx.imageSmoothingEnabled = false; // Padrão
        }

        ctx.drawImage(image, 0, 0, width, height);
        
        // Use a qualidade especificada ao salvar a imagem

        const resizedImage = getCheckboxConstruct() ? canvas.toDataURL("image/png", 1) : canvas.toDataURL('image/jpeg', 0.92);

        const imageItem = document.createElement('li');
        const resolutionText = document.createElement('span');
        const resolutionContainer = document.createElement('div');
        resolutionText.textContent = `${width} x ${height}`;
        resolutionContainer.appendChild(resolutionText);
        imageItem.appendChild(resolutionText);
        const saveButton = document.createElement('button');

        saveButton.textContent = 'Salvar';
        saveButton.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = resizedImage;
            link.download = getCheckboxConstruct() ? `${width}x${height}.png` :  `${width}x${height}.jpg`;
            link.click();
        });
        
        resolutionContainer.appendChild(saveButton);
        imageItem.appendChild(resolutionContainer);
        //imageItem.appendChild(saveButton);
        const imageElement = document.createElement('img');
        imageElement.src = resizedImage;
        imageItem.appendChild(imageElement);
        fragment.appendChild(imageItem);

    }
}

const imageList = document.querySelector('#image-list');

document.querySelector('#image-input').addEventListener('change', event => {
    const file = event.target.files[0];
    if (file) {
        const image = new Image();
        image.onload = () => {
            resizeImage(image, getSquareResolutions(), getRectangularResolutions());
            imageList.appendChild(fragment); // Append the fragment to the imageList element
        };
        image.src = URL.createObjectURL(file); // Update the src property of the image object
    }
});

document.querySelector('#clear-button').addEventListener('click', () => {
    // chamando a ação para limpar as imagens da tela
    clearElements();
});


const getCheckboxConstruct = () => {
    // verifica se o checkbox do Construct 2 e 3 está ativo na página
    var checkbox = document.getElementById("checkbox");
    var checkBoxVerify = checkbox.checked ? true : false;
    return checkBoxVerify;
}

const getCheckInterpolate = () => {
    // verifica se o checkbox interpolação está ativo na página
    var checkbox = document.getElementById("checkboxInterpolate");
    var checkInterpolateVerify = checkbox.checked ? true : false;
    return checkInterpolateVerify;
}

const clearElements = () => {
    // Adicione um manipulador de eventos ao botão "Limpar"
    // Remova todas as imagens redimensionadas da página
    const imageList = document.querySelector('#image-list');
    while (imageList.firstChild) {
        imageList.removeChild(imageList.firstChild);
    }
}

const getConstructResolutions = () => {
    const construct3Icons = [
        [16,16],[32,32],[64,64],[114,114],[128,128],[256,256],[512,512],[1024,1024]
    ];
    return construct3Icons;
}

const getSquareResolutions = () =>{
    const squareResolutions = [
        [44,44],[71,71],[75,75],[88,88],[100,100],[142,142],[150,150],
        [176,176],[200,200],[256,256],[284,284],[300,300],[310,310],
        [600,600],[620,620],[1240,1240]
    ];
    return squareResolutions;
}

const getRectangularResolutions = () =>{
    const rectangularResolutions = [
        [310,150], [620,300], [930,450], [1240,600], [2480, 1200]
    ];
    return rectangularResolutions
}
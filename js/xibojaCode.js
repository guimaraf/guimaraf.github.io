const squareResolutions = [[44,44], [71,71], [75,75], [88,88], [100,100], [142,142], [150,150], [176,176], [200,200], [256,256], [284,284], [300,300], [310,310], [600,600], [620,620], [1240,1240]];
const rectangularResolutions = [[310,150], [620,300], [930,450], [1240,600], [2480, 1200]];
const construct3Icons = [[16,16],[32,32],[64,64],[128,128],[256,256],[512,512]];

function resizeImage(image, squareResolutions, rectangularResolutions) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const isSquare = image.width === image.height;
    const resolutions = check() ? construct3Icons : isSquare ? squareResolutions : rectangularResolutions;

    for (const resolution of resolutions) {
        const [width, height] = resolution;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);
        
        // Use a qualidade especificada ao salvar a imagem
        const resizedImage = canvas.toDataURL('image/jpeg', 0.92);

        const imageItem = document.createElement('li');
        const resolutionText = document.createElement('span');
        resolutionText.textContent = `${width} x ${height}`;
        imageItem.appendChild(resolutionText);
        const saveButton = document.createElement('button');
        
        saveButton.textContent = 'Salvar';
        saveButton.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = resizedImage;
            link.download = `${width}x${height}.jpg`;
            link.click();
        });
        
        imageItem.appendChild(saveButton);
        const imageElement = document.createElement('img');
        imageElement.src = resizedImage;
        imageItem.appendChild(imageElement);
        
        document.querySelector('#image-list').appendChild(imageItem);
    }
}

document.querySelector('#image-input').addEventListener('change', event => {
    const file = event.target.files[0];
    if (file) {
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = () => {
            resizeImage(image, squareResolutions, rectangularResolutions);
        };
    }
});

// Adicione um manipulador de eventos ao botão "Limpar"
document.querySelector('#clear-button').addEventListener('click', () => {
    clearElements();
});

const clearElements = () => {
    // Remova todas as imagens redimensionadas da página
    const imageList = document.querySelector('#image-list');
    while (imageList.firstChild) {
        imageList.removeChild(imageList.firstChild);
    }
}

const check = () => {
    var checkbox = document.getElementById("checkbox");
    return checkbox.checked;
}
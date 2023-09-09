async function convertToWav() {
    const webmInput = document.getElementById('webmInput');
    const downloadLink = document.getElementById('downloadLink');

    if (webmInput.files.length === 0) {
        alert('Selecione um arquivo .webm primeiro.');
        return;
    }

    const webmFile = webmInput.files[0];
    const reader = new FileReader();

    reader.onload = async function () {
        const arrayBuffer = reader.result;
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Obtenha o nome do arquivo original
        const originalFileName = webmFile.name;

        // Crie um novo buffer de áudio em formato WAV
        const wavBuffer = new ArrayBuffer(44 + audioBuffer.length * 2);
        const view = new DataView(wavBuffer);

        // Cabeçalho do arquivo WAV
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + audioBuffer.length * 2, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // Formato PCM
        view.setUint16(22, 1, true); // Mono
        view.setUint32(24, audioContext.sampleRate, true);
        view.setUint32(28, audioContext.sampleRate * 2, true);
        view.setUint16(32, 2, true); // Tamanho do bloco
        view.setUint16(34, 16, true); // Bits por amostra
        writeString(view, 36, 'data');
        view.setUint32(40, audioBuffer.length * 2, true);

        // Copie os dados do áudio para o buffer WAV
        const dataView = new DataView(wavBuffer, 44);
        for (let i = 0; i < audioBuffer.length; i++) {
            dataView.setInt16(i * 2, audioBuffer.getChannelData(0)[i] * 0x7FFF, true);
        }

        // Crie um Blob a partir do buffer WAV
        const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });

        // Crie uma URL para o Blob e defina-a como o href do link de download
        const wavUrl = URL.createObjectURL(wavBlob);
        downloadLink.href = wavUrl;
        downloadLink.style.display = 'block';
        downloadLink.download = originalFileName.replace(/\.[^/.]+$/, "") + '.wav'; // Use o nome original do arquivo
    };

    reader.readAsArrayBuffer(webmFile);
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

document.getElementById('convertButton').addEventListener('click', convertToWav);

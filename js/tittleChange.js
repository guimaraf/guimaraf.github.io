let showAlert = false
const notification = 'Guimaraf Studios'

const titleOriginal = document.title

const tittleAlert = setInterval(() => {
    document.title = showAlert ? titleOriginal : notification
    showAlert = !showAlert
}, 2000)
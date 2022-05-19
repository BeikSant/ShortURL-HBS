console.log('Hola soy el front-end');

document.addEventListener('click', e => {
    if (e.target.dataset.short){
        const url = `http://localhost:8000/${e.target.dataset.short}`
        
        navigator.clipboard
            .writeText(url)
            .then(() => {
                console.log('Text Copied');
                window.alert('Link Copiado')
            })
            
            .catch((err) => {
                console.log('Error', err);
            });
    }
});
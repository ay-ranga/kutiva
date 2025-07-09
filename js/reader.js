document.addEventListener('DOMContentLoaded', () => {
        // Pegando o link do PDF da URL
        const urlParams = new URLSearchParams(window.location.search);
        const pdfLink = urlParams.get('pdf');
        
        // Dados do PDF (você pode ajustá-los dinamicamente)
        const pdfData = {
                title: "Visão de Samora Machel sobre a Economia de Moçambique pós-independência",
                text: "Visão de Samora Machel sobre a Economia de Moçambique pós-independência"
        };
        
        // Preenchendo os dados na página
        document.getElementById('pdf-title').textContent = pdfData.title;
        document.getElementById('pdf-text').textContent = pdfData.text;
        
        // Exibindo o PDF no iframe
        if (pdfLink) {
                document.getElementById('pdf-frame').src = pdfLink;
        } else {
                document.getElementById('pdf-frame').src = "https://firebasestorage.googleapis.com/v0/b/kutiva-8a875.appspot.com/o/No%20palco%20da%20vida%20(1).pdf?alt=media&token=ae1d6152-ba1e-4a61-95c6-83335d21dd0c";
        }
        
        // O botão de download é apenas um placeholder, sem funcionalidade
});

window.addEventListener('offline', () => {
    window.location.href = 'offline.html';
});
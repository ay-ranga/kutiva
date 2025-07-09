document.addEventListener('DOMContentLoaded', () => {
        // Espaço para o link do PDF
        const pdfLink = "https://firebasestorage.googleapis.com/v0/b/kutiva-8a875.appspot.com/o/No%20palco%20da%20vida%20(1).pdf?alt=media&token=ae1d6152-ba1e-4a61-95c6-83335d21dd0c";
        
        // Dados do livro (você pode preenchê-los dinamicamente a partir de uma API ou objeto)
        const bookData = {
                title: "Visão de Samora Machel sobre a Economia de Moçambique pós-independência",
                author: "Adriano Maleiane",
                description: "O Livro 'Visão de Samora Machel Sobre a Economia de Moçambique Pós-Independência' Retrata o Modelo de Economia Desejado por Samora Machel, Três Passos à Frente.",
                cover: "/img/Screenshot_25-5-2025_105514_.jpeg"
        };
        
        // Preenchendo os dados na página
        document.getElementById('book-title').textContent = bookData.title;
        document.getElementById('book-author').textContent = bookData.author;
        document.getElementById('book-description').textContent = bookData.description;
        document.getElementById('book-cover').src = bookData.cover;
        
        // Evento para o botão "Iniciar Leitura"
        document.getElementById('read-btn').addEventListener('click', () => {
                // Redireciona para a página de leitura com o link do PDF
                window.location.href = `reader.html?pdf=${encodeURIComponent(pdfLink)}`;
        });
        
        // O botão de download é apenas um placeholder, sem funcionalidade
});

window.addEventListener('offline', () => {
    window.location.href = 'offline.html';
});
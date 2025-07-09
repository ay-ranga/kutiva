// Visualizador de livros com proteção DRM
class KutivaBookViewer {
    constructor() {
        this.currentBook = null;
        this.pdfDoc = null;
        this.currentPage = 1;
        this.totalPages = 0;
        this.scale = 1.0;
        this.canvas = null;
        this.ctx = null;
        this.setupDRM();
    }

    setupDRM() {
        // Desabilitar botão direito
        document.addEventListener('contextmenu', (e) => {
            if (this.currentBook) {
                e.preventDefault();
                return false;
            }
        });

        // Desabilitar teclas de cópia/print
        document.addEventListener('keydown', (e) => {
            if (this.currentBook) {
                // Desabilitar Ctrl+S, Ctrl+P, Ctrl+C, F12, etc.
                if ((e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'c')) ||
                    e.key === 'F12' || e.key === 'PrintScreen') {
                    e.preventDefault();
                    return false;
                }
            }
        });

        // Desabilitar seleção de texto
        document.addEventListener('selectstart', (e) => {
            if (this.currentBook) {
                e.preventDefault();
                return false;
            }
        });
    }

    async openBook(bookId, container) {
        try {
            // Verificar autenticação
            if (!window.kutivaAPI || !window.kutivaAPI.canAccessBook()) {
                throw new Error('LOGIN_REQUIRED');
            }

            // Tentar carregar do cache offline primeiro
            const offlineBook = await this.getOfflineBook(bookId);
            if (offlineBook) {
                await this.loadPDFFromBlob(offlineBook.blob, container);
                this.currentBook = { id: bookId, ...offlineBook.metadata };
                return;
            }

            // Carregar do servidor
            const bookData = await window.kutivaAPI.getBook(bookId);
            const bookBlob = await window.kutivaAPI.downloadBook(bookId);

            await this.loadPDFFromBlob(bookBlob, container);
            this.currentBook = { id: bookId, ...bookData };

        } catch (error) {
            if (error.message === 'LOGIN_REQUIRED') {
                alert('É necessário fazer login para ler este livro.');
                if (window.kutivaRouter) {
                    window.kutivaRouter.navigate('/login');
                }
            } else {
                console.error('Erro ao abrir livro:', error);
                container.innerHTML = `<div class="error">Erro ao carregar livro: ${error.message}</div>`;
            }
        }
    }

    async loadPDFFromBlob(blob, container) {
        try {
            // Carregar PDF.js se necessário
            if (!window.pdfjsLib) {
                await this.loadPDFJS();
            }

            const arrayBuffer = await blob.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            this.pdfDoc = await loadingTask.promise;
            this.totalPages = this.pdfDoc.numPages;

            // Criar interface do visualizador
            this.createViewer(container);
            await this.renderPage(1);

        } catch (error) {
            console.error('Erro ao carregar PDF:', error);
            throw error;
        }
    }

    async loadPDFJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    createViewer(container) {
        const bookTitle = this.currentBook?.title || 'Livro';

        container.innerHTML = `
            <div class="book-viewer">
                <div class="viewer-header">
                    <button class="btn-close" onclick="window.kutivaBookViewer.closeBook()">✕</button>
                    <h3>${bookTitle}</h3>
                    <div class="viewer-controls">
                        <button onclick="window.kutivaBookViewer.zoomOut()">-</button>
                        <span>${Math.round(this.scale * 100)}%</span>
                        <button onclick="window.kutivaBookViewer.zoomIn()">+</button>
                    </div>
                </div>
                <div class="viewer-content">
                    <canvas id="pdf-canvas"></canvas>
                    <div class="watermark"></div>
                </div>
                <div class="viewer-footer">
                    <button onclick="window.kutivaBookViewer.prevPage()" ${this.currentPage <= 1 ? 'disabled' : ''}>‹ Anterior</button>
                    <span>Página ${this.currentPage} de ${this.totalPages}</span>
                    <button onclick="window.kutivaBookViewer.nextPage()" ${this.currentPage >= this.totalPages ? 'disabled' : ''}>Próxima ›</button>
                </div>
            </div>
        `;

        this.canvas = document.getElementById('pdf-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Aplicar marca d'água
        this.addWatermark();
    }

    addWatermark() {
        const watermarkData = window.kutivaAPI?.getUserWatermarkData();
        if (!watermarkData) return;

        const watermarkDiv = document.querySelector('.watermark');
        if (watermarkDiv) {
            watermarkDiv.innerHTML = `
                <div class="watermark-text">
                    ${watermarkData.name}<br>
                    ${watermarkData.email}<br>
                    ${watermarkData.timestamp}
                </div>
            `;
        }
    }

    async renderPage(pageNum) {
        try {
            const page = await this.pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: this.scale });

            this.canvas.height = viewport.height;
            this.canvas.width = viewport.width;

            const renderContext = {
                canvasContext: this.ctx,
                viewport: viewport
            };

            await page.render(renderContext).promise;
            this.currentPage = pageNum;

            // Atualizar controles
            this.updateControls();

        } catch (error) {
            console.error('Erro ao renderizar página:', error);
        }
    }

    updateControls() {
        const prevBtn = document.querySelector('.viewer-footer button:first-child');
        const nextBtn = document.querySelector('.viewer-footer button:last-child');
        const pageSpan = document.querySelector('.viewer-footer span');

        if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
        if (nextBtn) nextBtn.disabled = this.currentPage >= this.totalPages;
        if (pageSpan) pageSpan.textContent = `Página ${this.currentPage} de ${this.totalPages}`;
    }

    async nextPage() {
        if (this.currentPage < this.totalPages) {
            await this.renderPage(this.currentPage + 1);
        }
    }

    async prevPage() {
        if (this.currentPage > 1) {
            await this.renderPage(this.currentPage - 1);
        }
    }

    async zoomIn() {
        this.scale = Math.min(this.scale + 0.25, 3.0);
        await this.renderPage(this.currentPage);
        const zoomSpan = document.querySelector('.viewer-controls span');
        if (zoomSpan) zoomSpan.textContent = `${Math.round(this.scale * 100)}%`;
    }

    async zoomOut() {
        this.scale = Math.max(this.scale - 0.25, 0.5);
        await this.renderPage(this.currentPage);
        const zoomSpan = document.querySelector('.viewer-controls span');
        if (zoomSpan) zoomSpan.textContent = `${Math.round(this.scale * 100)}%`;
    }

    closeBook() {
        this.currentBook = null;
        this.pdfDoc = null;
        const viewer = document.querySelector('.book-viewer');
        if (viewer) {
            viewer.remove();
        }
    }

    async downloadForOffline(bookId) {
        try {
            if (!window.kutivaAPI || !window.kutivaAPI.canAccessBook()) {
                throw new Error('LOGIN_REQUIRED');
            }

            const bookData = await window.kutivaAPI.getBook(bookId);
            const bookBlob = await window.kutivaAPI.downloadBook(bookId);

            await window.kutivaAPI.saveBookForOffline(bookId, bookBlob, bookData);

            console.log('✅ Livro baixado para leitura offline');

        } catch (error) {
            console.error('Erro ao baixar livro:', error);
            throw error;
        }
    }

    async getOfflineBook(bookId) {
        try {
            if (!window.kutivaAPI) return null;
            const offlineBooks = await window.kutivaAPI.getDownloadedBooks();
            return offlineBooks.find(book => book.id === bookId);
        } catch (error) {
            console.error('Erro ao buscar livro offline:', error);
            return null;
        }
    }
}

// CSS para o visualizador
const viewerCSS = `
.book-viewer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    z-index: 1000;
    display: flex;
    flex-direction: column;
}

.viewer-header {
    background: #00a859;
    color: white;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.btn-close {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
}

.viewer-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.viewer-controls button {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 3px;
}

.viewer-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;
    position: relative;
}

#pdf-canvas {
    max-width: 100%;
    max-height: 100%;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
}

.watermark {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255,255,255,0.8);
    padding: 10px;
    border-radius: 5px;
    font-size: 12px;
    color: #666;
    pointer-events: none;
}

.viewer-footer {
    background: #333;
    color: white;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.viewer-footer button {
    background: #00a859;
    border: none;
    color: white;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 3px;
}

.viewer-footer button:disabled {
    background: #666;
    cursor: not-allowed;
}

.error {
    text-align: center;
    padding: 50px;
    color: #f44336;
    font-size: 18px;
}
`;

// Adicionar CSS
const style = document.createElement('style');
style.textContent = viewerCSS;
document.head.appendChild(style);

// Instância global
window.kutivaBookViewer = new KutivaBookViewer();

console.log('📖 Visualizador de livros com DRM carregado');
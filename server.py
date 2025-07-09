
#!/usr/bin/env python3
import http.server
import socketserver
import os
import mimetypes
from urllib.parse import urlparse
import sys

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)
    
    def do_GET(self):
        # Parse a URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Log da requisição
        print(f"Requisição: {self.path}")
        
        # Remover a barra inicial se existir
        if path.startswith('/'):
            path = path[1:]
        
        # Se o caminho estiver vazio, servir index.html
        if path == '' or path == '/':
            path = 'index.html'
        
        # Tratar caminhos especiais
        if path in ['js/router.js', 'js/navigation.js']:
            self.path = '/' + path
            return super().do_GET()
        
        # Se não tem extensão e não é um arquivo JS/CSS/etc, tentar adicionar .html
        if ('.' not in os.path.basename(path) and 
            not path.startswith('css/') and 
            not path.startswith('js/') and 
            not path.startswith('icon/') and 
            not path.startswith('img/') and
            not path.startswith('vid/')):
            html_path = path + '.html'
            if os.path.exists(html_path) and os.path.isfile(html_path):
                path = html_path
        
        # Verificar se o arquivo existe
        if os.path.exists(path) and os.path.isfile(path):
            self.path = '/' + path
            return super().do_GET()
        else:
            # Servir página 404 personalizada
            self.send_custom_404()
    
    def send_custom_404(self):
        """Enviar página 404 personalizada"""
        try:
            if os.path.exists('404.html'):
                with open('404.html', 'rb') as f:
                    content = f.read()
                
                self.send_response(404)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            else:
                # Fallback 404 básico
                content = """
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 - Página não encontrada</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; background: #00a859; color: white; padding: 50px; }
                        h1 { font-size: 3rem; }
                        a { color: white; text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <h1>404</h1>
                    <p>Página não encontrada</p>
                    <a href="/">Voltar ao KUTIVA</a>
                </body>
                </html>
                """.encode('utf-8')
                
                self.send_response(404)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                
        except Exception as e:
            print(f"Erro ao servir 404: {e}")
            super().send_error(404)

    def log_message(self, format, *args):
        """Log personalizado"""
        print(f"{self.address_string()} - {format % args}")

def run_server(port=8080):
    """Executar servidor HTTP"""
    try:
        handler = CustomHTTPRequestHandler
        with socketserver.TCPServer(("0.0.0.0", port), handler) as httpd:
            print(f"Servidor KUTIVA rodando em http://0.0.0.0:{port}")
            print("Pressione Ctrl+C para parar")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor parado pelo usuário")
    except Exception as e:
        print(f"Erro no servidor: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Alterar diretório para o projeto
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    run_server()

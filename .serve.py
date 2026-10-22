import http.server
import socket
import socketserver
import os

PORT = 8642
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class DualStackServer(http.server.ThreadingHTTPServer):
    address_family = socket.AF_INET6

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

DualStackServer.allow_reuse_address = True
try:
    with DualStackServer(("::", PORT), NoCacheHandler) as httpd:
        print(f"DualStack Server listening on port {PORT} for both IPv4 and IPv6")
        httpd.serve_forever()
except Exception as e:
    print("Server failed:", e)

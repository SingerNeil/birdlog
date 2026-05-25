from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import socket


HOST = "127.0.0.1"
START_PORT = 5173
ROOT = Path(__file__).resolve().parent


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def find_port(start_port):
    for port in range(start_port, start_port + 20):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
            try:
                probe.bind((HOST, port))
            except OSError:
                continue
            return port
    raise RuntimeError("No available port found from 5173 to 5192.")


def main():
    port = find_port(START_PORT)
    handler = partial(NoCacheHandler, directory=str(ROOT))
    server = ThreadingHTTPServer((HOST, port), handler)
    print("")
    print("BirdLog dev server is running.")
    print(f"Open: http://{HOST}:{port}/?v=latest")
    if port != START_PORT:
        print("")
        print(f"Port {START_PORT} is already occupied, so BirdLog is using {port}.")
        print("Use the exact Open URL above. Do not open the old localhost:5173 tab.")
    print("")
    print("Press Ctrl+C to stop.")
    print("")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping BirdLog dev server.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()

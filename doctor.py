from pathlib import Path
import socket
import urllib.request


ROOT = Path(__file__).resolve().parent
HOSTS = ["127.0.0.1", "localhost", "::1"]
PORTS = range(5173, 5193)


def can_connect(host, port):
    family = socket.AF_INET6 if ":" in host else socket.AF_INET
    try:
        with socket.socket(family, socket.SOCK_STREAM) as sock:
            sock.settimeout(0.3)
            sock.connect((host, port))
        return True
    except OSError:
        return False


def fetch_title(url):
    try:
        with urllib.request.urlopen(url, timeout=1) as response:
            text = response.read(4000).decode("utf-8", errors="replace")
        return "BirdLog" in text and "/src/app.js" in text
    except Exception:
        return False


def main():
    print("BirdLog doctor")
    print(f"Project: {ROOT}")
    print("")
    found = False
    for port in PORTS:
        row = []
        for host in HOSTS:
            display_host = f"[{host}]" if ":" in host else host
            url = f"http://{display_host}:{port}/?v=latest"
            if can_connect(host, port):
                ok = fetch_title(url)
                row.append(f"{url} -> {'BirdLog' if ok else 'responding, not BirdLog'}")
                found = True
        if row:
            print(f"Port {port}:")
            for item in row:
                print(f"  {item}")
    if not found:
        print("No local server found from 5173 to 5192.")
        print("Run: npm run dev")
    print("")
    print("Use the exact BirdLog URL printed above or by npm run dev.")


if __name__ == "__main__":
    main()

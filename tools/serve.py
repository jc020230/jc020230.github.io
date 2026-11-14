#!/usr/bin/env python3
"""Preview the site using only Python's standard library. No package install required."""
from __future__ import annotations

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys
import webbrowser

ROOT = Path(__file__).resolve().parents[1]


class PreviewHandler(SimpleHTTPRequestHandler):
    """Avoid stale CSS and JavaScript while editing in VS Code."""

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()


def main() -> int:
    parser = argparse.ArgumentParser(description="Preview your researcher website locally.")
    parser.add_argument("--port", type=int, default=8000, help="Local port (default: 8000)")
    parser.add_argument("--open", action="store_true", help="Open your default browser")
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error("--port must be between 1 and 65535")

    handler = partial(PreviewHandler, directory=str(ROOT))
    try:
        server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    except OSError as exc:
        print(f"Cannot start the preview server: {exc}", file=sys.stderr)
        print("Try another port: python tools/serve.py --port 8001", file=sys.stderr)
        return 1

    url = f"http://127.0.0.1:{args.port}/"
    print(f"Researcher website: {url}", flush=True)
    print(f"Serving: {ROOT}", flush=True)
    print("Press Ctrl+C to stop. Refresh your browser after saving edits.", flush=True)
    if args.open:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nPreview server stopped.")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

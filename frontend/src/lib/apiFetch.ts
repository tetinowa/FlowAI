export function apiFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  if (url.includes("ngrok")) {
    headers.set("ngrok-skip-browser-warning", "true");
  }
  return fetch(url, { ...init, headers });
}

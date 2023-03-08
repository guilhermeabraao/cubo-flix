const api = axios.create({
    baseURL: 'https://tmdb-proxy.cubos-academy.workers.dev',
    timeout: 1000,
    headers: { 'Content-Type': 'Application/json' }
});
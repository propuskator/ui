function updateConfig() {
    document.removeEventListener('DOMContentLoaded', updateConfig);
    const { hostname, protocol, port } = window.location;
    const brokerUrlProtocol = protocol === 'http:' ? 'ws:' : 'wss:';

    const host = `${hostname}${port ? `:${port}` : ''}`;

    const brokerUrl = `${brokerUrlProtocol}//${host}/mqtt`;

    window.__CONFIG__ = {
        ...window.__CONFIG__,
        brokerUrl
    };
}

document.addEventListener('DOMContentLoaded', updateConfig);

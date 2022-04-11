let requests = async (url, method = 'GET') => {
    try {
        return await fetch(url, {
            method: method,
        })
            .then((response) => response.json())
            .then((data) => data);
    } catch (e) {
        console.error(e);
    }
};

let noResponseWithQueryString = async (url, method = 'GET', params) => {
    const currentUrl = window.location;
    const baseUrl = currentUrl.protocol + '//' + currentUrl.host;
    url = new URL(`${baseUrl}/${url}`);
    const searchParams = new URLSearchParams(params);
    url.search = searchParams.toString();

    try {
        return await fetch(url, {
            method: method,
        });
    } catch (e) {
        console.error(e);
    }
};

let responseWithQueryString = async (url, method = 'GET', params) => {
    const currentUrl = window.location;
    const baseUrl = currentUrl.protocol + '//' + currentUrl.host;
    url = new URL(`${baseUrl}${url}`);
    const searchParams = new URLSearchParams(params);
    url.search = searchParams.toString();

    try {
        return await fetch(url, {
            method: method,
        })
            .then((response) => response.json())
            .then((data) => data);
    } catch (e) {
        console.error(e);
    }
};

let jsonRequests = async (url, method = 'GET', body) => {
    try {
        if (method === 'GET' || method === 'DELETE') {
            return await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
            })
                .then((response) => response.json())
                .then((data) => data);
        } else {
            return await fetch(url, {
                method: method,
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => data);
        }
    } catch (e) {
        console.error(e);
    }
};

let requestWithHeader = async (url, method = 'GET', body, headers) => {
    try {
        if (method === 'GET' || method === 'DELETE') {
            return await fetch(url, {
                method: method,
                headers: headers,
            })
                .then((response) => response.json())
                .then((data) => data);
        } else {
            return await fetch(url, {
                method: method,
                headers: headers,
                body: JSON.stringify(body),
            })
                .then((response) => response.json())
                .then((data) => data);
        }
    } catch (e) {
        console.error(e);
    }
};

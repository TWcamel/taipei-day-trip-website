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

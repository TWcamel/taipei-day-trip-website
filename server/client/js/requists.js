let requests = async (url, method = 'GET') => {
    try {
        return await fetch(url, {
            method: method,
        })
            .then((response) => response.json())
            .then((data) => data)
    } catch (e) {
        console.error(e)
    }
}

let infiniteScrolling = {
    autoAddAttractions: () => {
        let page = 0

        const loadingObserver = document.querySelector('.gallery-observer')

        const callback = ([entry]) => {
            if (entry && entry.isIntersecting) {
                ;(async () => {
                    let nextPage = await attractions.getAttractions('%', page)
                    if (nextPage === undefined || nextPage === null)
                        observer.unobserve(loadingObserver)
                })()
                page += 1
            }
        }

        let observer = new IntersectionObserver(callback, { threshold: 0 })

        observer.observe(loadingObserver)
    },
}

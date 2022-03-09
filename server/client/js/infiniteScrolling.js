let infiniteScrolling = {
    autoAddAttractions: () => {
        let page = 0

        const callback = ([entry]) => {
            if (entry && entry.isIntersecting) {
                attractions.getAttractions('%', page)
                page += 1
            }
        }

        let observer = new IntersectionObserver(callback, { threshold: 0 })

        observer.observe(document.querySelector('.gallery-observer'))
    },
}

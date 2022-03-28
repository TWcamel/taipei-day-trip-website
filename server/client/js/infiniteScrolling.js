let infiniteScrolling = {
    observer: null,
    setObserver: (observer) => {
        infiniteScrolling.observer = observer;
    },
    startObserver: (loadingObserver) => {
        infiniteScrolling.observer.observe(loadingObserver);
    },
    stopObserver: (loadingObserver) => {
        infiniteScrolling.observer.unobserve(loadingObserver);
    },
    autoAddAttractions: (keyword) => {
        let page = 0;
        keyword = keyword || '%';

        const loadingObserver = document.querySelector('.gallery-observer');

        const callback = ([entry]) => {
            if (entry && entry.isIntersecting) {
                (async () => {
                    let nextPage =
                        await attractions.getAttractionsAndCreateGallery(
                            keyword,
                            page,
                        );
                    if (nextPage === undefined || nextPage === null)
                        infiniteScrolling.observer.unobserve(loadingObserver);
                })();
                page += 1;
            }
        };

        infiniteScrolling.setObserver(
            new IntersectionObserver(callback, {
                root: null,
                rootMargin: '0px 0px 1000px 0px',
                threshold: 0,
            }),
        );

        infiniteScrolling.startObserver(loadingObserver);
    },
};

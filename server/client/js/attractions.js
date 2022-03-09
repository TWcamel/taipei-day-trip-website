let attractions = {
    getAttractions: async (keyword, page) => {
        const currentUrl = window.location
        const baseUrl = currentUrl.protocol + '//' + currentUrl.host

        const url = new URL(`${baseUrl}/api/attractions`)
        let params = { page: page, keyword: keyword }
        url.search =
            page !== undefined && keyword !== undefined
                ? new URLSearchParams(params).toString()
                : ''

        const data = requests(url, 'GET')

        const promise = new Promise((resolve, reject) => {
            data.then((attractions) => {
                attractions.data.forEach((attraction) => {
                    gallery.createGalleryItem({
                        images: attraction.images,
                        name: attraction.name,
                        mrt: attraction.mrt,
                        category: attraction.category,
                    })
                })
            })
        })
    },
}

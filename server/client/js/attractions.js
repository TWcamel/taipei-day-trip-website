let attractions = {
    getAttractions: async () => {
        const currentUrl = window.location
        const baseUrl = currentUrl.protocol + '//' + currentUrl.host + '/'

        const req = `${baseUrl}/api/attractions`
        const data = requests(req, 'GET')

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

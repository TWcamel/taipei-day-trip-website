let attractions = {
    getAttractionsAndCreateGallery: async (keyword, page) => {
        const currentUrl = window.location
        const baseUrl = currentUrl.protocol + '//' + currentUrl.host

        const url = new URL(`${baseUrl}/api/attractions`)
        let params = { page: page, keyword: keyword }
        url.search =
            page !== undefined && keyword !== undefined
                ? new URLSearchParams(params).toString()
                : ''

        const attractions = requests(url, 'GET')

        const promise = new Promise((resolve, reject) => {
            attractions.then((_attractions) => {
                _attractions.data.forEach((attraction) => {
                    gallery.createGalleryItem({
                        id: attraction.id,
                        images: attraction.images,
                        name: attraction.name,
                        mrt: attraction.mrt,
                        category: attraction.category,
                    })
                })
                page = _attractions.nextPage
            })
        })

        return page
    },

    searchAttractionByKeyword: () => {
        const searchInput = document.querySelector('.input-keyword')

        const wait1SecondAndUpdateGallery = (func, ms) => {
            let timer = 0
            // ...args is the arguments from [intputEvent]
            return (...args) => {
                clearTimeout(timer)
                timer = setTimeout(func.bind(this, ...args), ms || 0)
            }
        }

        const getAttractionsByKeyword = (e) => {
            gallery.emptyGallery()
            infiniteScrolling.autoAddAttractions(e.target.value)
            gallery.checkIfGalleryIsEmptyAndPrint()
        }

        searchInput.addEventListener(
            'input',
            wait1SecondAndUpdateGallery(getAttractionsByKeyword, 1500)
        )
    },
}

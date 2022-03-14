let gallery = {
    createGalleryItem: ({ id, images, name, mrt, category }) => {
        const galleryLists = document.querySelector('.gallery')
        const galleryItem = `
        <div class="gallery-items" id="gallery-items-id-${id}" onclick="window.location.href='/attraction/${id}'">
            <img src="${images[0]}" alt="" />
            <div class="gallery-items-title">${name}</div>
            <div class="gallery-items-sub-title">
                <p>${mrt}</p>
                <p>${category}</p>
            </div>
        </div>
        `

        gallery.removeGelleryEmptyIfExists(galleryLists)

        galleryLists.innerHTML += galleryItem
    },

    emptyGallery: () => {
        const gallery = document.querySelector('.gallery')
        gallery.innerHTML = ''
        infiniteScrolling.stopObserver(
            document.querySelector('.gallery-observer')
        )
    },

    checkIfGalleryIsEmptyAndPrint: () => {
        const gallery = document.querySelector('.gallery')
        if (gallery.innerHTML === '') {
            gallery.innerHTML = `
            <div id="gallery-empty">
                <p> 😢 No attractions found </p>
            </div>
            `
        }
    },

    removeGelleryEmptyIfExists: (gallery) => {
        if (document.querySelector('#gallery-empty'))
            gallery.removeChild(document.querySelector('#gallery-empty'))
    },

    getGalleryItem: (id) => {
        return document.querySelector(`#gallery-items-id-${id}`)
    },
}

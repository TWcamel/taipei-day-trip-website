let gallery = {
    createGalleryItem: ({ images, name, mrt, category }) => {
        const gallery = document.querySelector('.gallery')
        const galleryItem = `
        <div class="gallery-items">
            <img src="${images[0]}" alt="" />
            <div class="gallery-items-title">${name}</div>
            <div class="gallery-items-sub-title">
                <p>${mrt}</p>
                <p>${category}</p>
            </div>
        </div>
        `
        gallery.innerHTML += galleryItem
    },
}

let overlay = {
    overlaySection: () => {
        let overlaySection = `<div class="overlay">
            <div class="overlay-content">
            </div>
        </div>
        `

        return overlaySection
    },

    createOverlay: () => {
        const body = document.querySelector('body')
        body.insertAdjacentHTML('afterbegin', overlay.overlaySection())
    },
}

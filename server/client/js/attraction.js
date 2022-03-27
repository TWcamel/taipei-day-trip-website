let initAttractionApp
;(initAttractionApp = () => {
    let attraction = {
        init: () => {
            navbar.insertHeaderAtFirstDomInBody()
            attraction.createAttractionPage()
        },
        getAttractionContainer: () => {
            return document.querySelector('#attraction-container')
        },
        getAttraction: async () => {
            const attractionId = window.location.pathname
            const url = `/api${attractionId}`

            let attraction = await requests(url, 'GET')

            return attraction.data
        },
        createAttractionPage: (_attraction = attraction.getAttraction()) => {
            new Promise((resolve, reject) => {
                _attraction.then((_attraction) => {
                    attraction.insertImgCarouselWithInAttractionContainer(
                        _attraction.images
                    )
                    attraction.insertBookingInfoWithInAttractionContainer(
                        _attraction
                    )
                    attraction.insertAttractionInfoContainer(_attraction)
                    afterInitAttractionApp.storeAttractionInfo(_attraction)
                })
            })
        },

        createCarouselImgContainer: (images) => {
            let imgContaienr = `
                <div id="carousel-img-prev-next-btn-container">
                    <a class="carousel-prev-next" id="carousel-prev-btn">&#10094</a>
                    <a class="carousel-prev-next" id="carousel-next-btn">&#10095</a>
                </div>
            `

            document
                .querySelector('#attraction-carousel-imgs')
                .insertAdjacentHTML('afterbegin', imgContaienr)

            imgContaienr = document.querySelector('#attraction-carousel-imgs')

            let dotContainer = `
                <div class="carousel-dot-container">
                </div>
            `

            imgContaienr.insertAdjacentHTML('beforeend', dotContainer)

            dotContainer = document.querySelector('.carousel-dot-container')

            images.forEach((image, idx) => {
                const dot = `
                    <span id="carousel-dot-id-${idx}" class="carousel-dot ${
                    idx === 0 ? 'carousel-dot-active' : ''
                }" onclick="afterInitAttractionApp.jumpToImg(${idx})"> </span>
                `
                dotContainer.insertAdjacentHTML('beforeend', dot)
            })

            images.forEach((image, idx) => {
                const carouselImgFlashlightContainer = `
                    <div class="carousel-img-flashlight" id="carousel-img-id-${idx}" style="display:
                    ${idx === 0 ? 'block' : 'none'}">
                        <img src="${image}" alt="" />
                    </div>
                `
                imgContaienr.insertAdjacentHTML(
                    'beforeend',
                    carouselImgFlashlightContainer
                )
            })

            afterInitAttractionApp.carouselPrevNextBtn()

            return imgContaienr
        },

        insertAttractionInfoContainer: ({
            description,
            address,
            transport,
        }) => {
            const intro = `
            <p class="attraction-description">
                ${description}
            </p>
            <h3>景點地址：</h3>
            <p class="address">
                ${address}
            </p>
            <h3>交通方式：</h3>
            <p class="transport">
                ${transport}
            </p>
            `

            const introContainer = document.querySelector(
                '#attraction-info-container'
            )

            introContainer.insertAdjacentHTML('beforeend', intro)

            return introContainer
        },

        insertImgCarouselWithInAttractionContainer: (_images) => {
            attraction.createCarouselImgContainer(_images)
        },

        insertBookingInfoWithInAttractionContainer: (_attraction) => {
            const attractionContainer = attraction.getAttractionContainer()
            attractionContainer.insertAdjacentHTML(
                'beforeend',
                booking.createBookingInfo(_attraction)
            )
            const bookingChooseDate = document.querySelector(
                'input[name="order-date"]'
            )
            bookingChooseDate.setAttribute('min', booking.getToday())

            const attractionTitle = _attraction?.name ?? '台北一日遊'
            afterInitAttractionApp.replaceDocumentTile(attractionTitle)
        },
    }
    attraction.init()
})()

let afterInitAttractionApp = {
    replaceDocumentTile: (title) => {
        document.title = title || '台北一日遊'
    },
    jumpToImg: (imgIdx) => {
        afterInitAttractionApp.disableActiveCarouselDotAndEnableTargetDot(
            imgIdx
        )
        afterInitAttractionApp.setDisplayToNoneAndActiveToTargetCarouselImgFlashlight(
            imgIdx
        )

        return imgIdx
    },

    disableActiveCarouselDotAndEnableTargetDot: (dotIdx) => {
        const activeDot = document.querySelector('.carousel-dot-active')

        const dots = document.querySelectorAll('.carousel-dot')

        activeDot.classList.remove('carousel-dot-active')

        dots[dotIdx].classList.add('carousel-dot-active')
    },

    setDisplayToNoneAndActiveToTargetCarouselImgFlashlight: (imgIdx) => {
        const imgs = document.querySelectorAll('.carousel-img-flashlight')

        imgs.forEach((img) => {
            img.setAttribute('style', 'display: none')
        })

        imgs[imgIdx].setAttribute('style', 'display: block')
    },

    carouselPrevNextBtn: () => {
        const prev = document.querySelector('#carousel-prev-btn')
        const next = document.querySelector('#carousel-next-btn')

        const dots = document.querySelectorAll('.carousel-dot')
        const firstDot = dots[0]
        const lastDot = dots[dots.length - 1]

        afterInitAttractionApp.targetDomAddEventListener(
            prev,
            'click',
            (event) => {
                event.stopPropagation()
                const dotActive = document.querySelector('.carousel-dot-active')
                const id = dotActive.getAttribute('id').split('-')[3]
                if (String(id) === '0') lastDot.click()
                else dotActive.previousElementSibling.onclick()
            }
        )

        afterInitAttractionApp.targetDomAddEventListener(
            next,
            'click',
            (event) => {
                event.stopPropagation()
                const dotActive = document.querySelector('.carousel-dot-active')
                const id = dotActive.getAttribute('id').split('-')[3]
                if (String(id) === `${dots.length - 1}`) firstDot.click()
                else dotActive.nextElementSibling.onclick()
            }
        )
    },

    targetDomAddEventListener: (targetDom, eventType, eventHandler) => {
        targetDom.addEventListener(eventType, eventHandler)
    },

    storeAttractionInfo: (attraction) => {
        localStorage.setItem('attraction', JSON.stringify(attraction))
    },

    getAttractionInfo: () => {
        return JSON.parse(localStorage.getItem('attraction'))
    },
}

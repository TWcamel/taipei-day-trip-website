let thankyou = {
    init: () => {
        navbar.insertHeaderAtFirstDomInBody();
        footer.insertFooterAtLastDomInBody();
        thankyou.checkUserLogin() && thankyou.createThankyouSection();
    },

    createThankyouSection: async () => {
        const orderInfo = await thankyou.getPaidOrderByOrderId();
        orderInfo.forEach(async (order) => {
            let detail = await thankyou.getOrderDetailByBookingId(
                order['BOOKING_ID'],
            );
            console.log(detail);
            await thankyou.insertImgIntoThankyouRightSection({
                img: detail.data.attraction.image,
                name: detail.data.attraction.name,
                price: detail.data.price,
                attractionId: detail.data.attraction.id,
            });
        });
        await thankyou.imgCarousel();
        let thankyouSection = document.createElement('div');
        thankyouSection.classList.add('thankyou-section');
        thankyouSection.innerHTML = `
        <div class="thankyou-section-container">
            <div class="thankyou-section-container-left">
                <div class="thankyou-section-container-left-top">
                    <div class="thankyou-section-container-left-top-title">
                        <h1>Thank you for your order!</h1>
                    </div>
                    <div class="thankyou-section-container-left-top-content">
                        <p>
                            您的訂單已經成功送出，請記得攜帶身分證以及訂單編號至您付款的旅遊景點以便進行身份確認。
                        </p>
                    </div>
                </div>
                <div class="thankyou-section-container-left-bottom">
                    <div class="thankyou-section-container-left-bottom-title">
                        <h2>訂單明細</h2>
                    </div>
                    <div class="thankyou-section-container-left-bottom-content">
                        <div
                            class="thankyou-section-container-left-bottom-content-order-name"
                        >
                            <p>付款人姓名: ${orderInfo[0]['card_name']}</p>
                        </div>
                        <div
                            class="thankyou-section-container-left-bottom-content-order-email"
                        >
                            <p>付款人郵件: ${orderInfo[0]['card_email']}</p>
                        </div>
                        <div
                            class="thankyou-section-container-left-bottom-content-order-card_phone"
                        >
                            <p>付款人電話: ${orderInfo[0]['card_phone']}</p>
                        </div>
                        <div
                            class="thankyou-section-container-right-bottom-content-order-price"
                        >
                            <p>訂單金額: $ ${orderInfo[0]['price']}</p>
                        </div>
                        <div
                            class="thankyou-section-container-right-bottom-content-order-update-time"
                        >
                            <p>訂單更新時間: ${orderInfo[0]['update_time']}</p>
                        </div>
                        <div
                            class="thankyou-section-container-left-bottom-content-order-id"
                        >
                            <p>訂單號碼: ${orderInfo[0]['order_id']}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="thankyou-section-container-right">
            </div>
        </div>
        `;
        const headerSec = document.querySelector('#header-section');
        headerSec.insertAdjacentElement('afterend', thankyouSection);
    },

    getCurrentQueryString: () => {
        let queryString = window.location.search;
        if (queryString.indexOf('?') === 0) {
            queryString = queryString.substring(1);
        }
        return queryString.split('=%20')[1];
    },

    getPaidOrderByOrderId: async () => {
        try {
            const res = await responseWithQueryString('/api/orders', 'GET', {
                order_id: thankyou.getCurrentQueryString(),
            });
            if (res.OK) {
                return res.data;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    },

    checkUserLogin: async () => {
        const userInfo = await thankyou.getUserInfo();
        if (userInfo.data === null) {
            //thankyou.jumpToIndexPage();
            return;
        }
    },

    jumpToIndexPage: () => {
        window.location.href = '/';
    },

    getUserInfo: async () => {
        try {
            const res = await jsonRequests(
                (url = '/api/user'),
                (method = 'GET'),
            );
            return res;
        } catch (err) {
            console.log(err);
            return false;
        }
    },

    getOrderDetailByBookingId: async (_bookingId) => {
        try {
            const res = await fetch('/api/bookings', {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ bookingId: _bookingId }),
            })
                .then((res) => res.json())
                .then((res) => res);
            if (res.data) return res;
        } catch (err) {
            console.log(err);
            return false;
        }
    },

    insertImgIntoThankyouRightSection: async ({
        img,
        name,
        price,
        attractionId,
    }) => {
        const thankyouRightSection = document.querySelector(
            '.thankyou-section-container-right',
        );
        const container = thankyou.createImgContainer(
            img,
            name,
            price,
            attractionId,
        );
        thankyouRightSection.insertAdjacentElement('afterbegin', container);
    },

    createImgContainer: (img, name, price, attractionId) => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add(
            'thankyou-section-container-right-img-container',
        );
        imgContainer.classList.add('mt-1');
        imgContainer.innerHTML = `
            <img class="thankyou-imgs" src="${img}" alt="">
            <div class="thankyou-imgs-overlay">
                <div class="thankyou-imgs-overlay-content">
                    <p> ${name} </p>
                    <p> $ ${price} </p>
                    <a class="thankyou-imgs-link" href="/attraction/${attractionId}"> 點擊查看景點 </a>
                </div>
            </div>
        `;
        return imgContainer;
    },

    imgCarousel: () => {
        const imgs = document.querySelectorAll('.thankyou-imgs');
        imgs.forEach((img) => {
            img.addEventListener('click', (e) => {
                const imgSrc = e.target.src;
                const imgModal = thankyou.createImgModal(imgSrc);
                document.body.insertAdjacentElement('afterbegin', imgModal);
                thankyou.closeImgModal();
            });
        });
    },

    createImgModal: (imgSrc) => {
        const imgModal = document.createElement('div');
        imgModal.classList.add('img-modal');
        imgModal.innerHTML = `
            <div class="img-modal-container">
                <div class="img-modal-container-img">
                    <img src="${imgSrc}" alt="">
                </div>
                <div class="img-modal-container-close">
                    <p>lasd</p>
                </div>
            </div>
        `;
        return imgModal;
    },

    closeImgModal: () => {
        const closeBtn = document.querySelector('.img-modal-container-close');
        closeBtn.addEventListener('click', () => {
            const imgModal = document.querySelector('.img-modal');
            imgModal.remove();
        });
    },
};

thankyou.init();

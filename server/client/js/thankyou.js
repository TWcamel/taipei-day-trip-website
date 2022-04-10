let thankyou = {
    init: () => {
        navbar.insertHeaderAtFirstDomInBody();
        footer.insertFooterAtLastDomInBody();
        thankyou.checkUserLogin() && thankyou.createThankyouSection();
    },
    createThankyouSection: async () => {
        const orderInfo = await thankyou.getPaidOrderByOrderId();
        console.log(orderInfo);
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
                            <p>Your order has been received and is now being processed. Your order details are shown below for your reference:</p>
                        </div>
                    </div>
                    <div class="thankyou-section-container-left-bottom">
                        <div class="thankyou-section-container-left-bottom-title">
                            <h2>Order Details</h2>
                        </div>
                        <div class="thankyou-section-container-left-bottom-content">
                            <div class="thankyou-section-container-left-bottom-content-order-date">
                                <p>訂購人姓名: ${orderInfo[0]['card_name']}</p>
                            </div>
                            <div class="thankyou-section-container-left-bottom-content-order-status">
                                <p>訂購人信箱: ${orderInfo[0]['card_email']}</p>
                            </div>
                            <div class="thankyou-section-container-left-bottom-content-order-total">
                                <p>訂購人電話: ${orderInfo[0]['card_phone']}</p>
                            </div>
                            <div class="thankyou-section-container-left-bottom-content-order-total">
                                <p>訂單編號: ${orderInfo[0]['order_id']}</p>
                            </div>
                            <div class="thankyou-section-container-left-bottom-content-order-total">
                                <p>訂單金額: ${orderInfo[0]['price']}</p>
                            </div>
                            <div class="thankyou-section-container-left-bottom-content-order-total">
                                <p>訂單成立時間: ${orderInfo[0]['update_time']}</p>
                            </div>
                        </div>
                    </div>
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
            thankyou.jumpToIndexPage();
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
};

thankyou.init();

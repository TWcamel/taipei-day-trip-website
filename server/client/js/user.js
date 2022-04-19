let user = {
    init: () => {
        navbar.insertHeaderAtFirstDomInBody();
        footer.insertFooterAtLastDomInBody();
        user.checkUserLogin() && user.waitForHeaderSecRenderThenCreateUserSec();
        user.waitForUserSectionContainerLeftRenderThenCreateLeftBottom();
    },

    checkUserLogin: async () => {
        const userInfo = await user.getUserInfo();
        if (userInfo.data === null) {
            user.jumpToIndexPage();
            return;
        }
    },

    waitForHeaderSecRenderThenCreateUserSec: () => {
        const sec = document.querySelector('#header-section');
        if (sec === null)
            setTimeout(user.waitForHeaderSecRenderThenCreateUserSec, 100);
        else user.createUserSection();
    },

    waitForUserSectionContainerLeftRenderThenCreateLeftBottom: () => {
        const sec = document.querySelector('.user-section-container-left');
        if (sec === null)
            setTimeout(
                user.waitForUserSectionContainerLeftRenderThenCreateLeftBottom,
                100,
            );
        else user.createLeftBottom();
    },

    createLeftBottom: async () => {
        const orderInfo = await user.getActiveOrder();

        orderInfo.forEach(async (order) => {
            const container = document.createElement('div');
            container.classList.add('user-section-container-left-bottom');
            container.innerHTML += `
            <div class="user-section-container-left-bottom">
                <div class="user-section-container-left-bottom-title">
                    <a class="order-id-detail-link" href="/thankyou?order_id=${order.ORDER_ID}" > 訂單明細 </a>
                </div>
                <div class="user-section-container-left-bottom-content">
                    <div
                        class="user-section-container-left-bottom-content-order-name"
                    >
                        <p>付款人姓名: ${order.CARD_NAME}</p>
                    </div>
                    <div
                        class="user-section-container-left-bottom-content-order-email"
                    >
                        <p>付款人郵件: ${order.CARD_INFO}</p>
                    </div>
                    <div
                        class="user-section-container-left-bottom-content-order-card_phone"
                    >
                        <p>付款人電話: ${order.PHONE}</p>
                    </div>
                    <div
                        class="user-section-container-right-bottom-content-order-price"
                    >
                        <p>訂單金額: $ ${order.PRICE}</p>
                    </div>
                    <div
                        class="user-section-container-right-bottom-content-order-update-time"
                    >
                        <p>訂單更新時間: ${order.UPDATE_TIME}</p>
                    </div>
                    <div
                        class="user-section-container-left-bottom-content-order-id"
                    >
                        <p>訂單號碼: ${order.ORDER_ID}</p>
                    </div>
                </div>
            </div>
            <hr>
          `;
            const userSecLeft = document.querySelector(
                '.user-section-container-left',
            );
            userSecLeft.insertAdjacentElement('beforeend', container);
        });
    },

    createUserSection: async () => {
        let userSection = document.createElement('div');
        userSection.classList.add('user-section');
        userSection.innerHTML = `
        <div class="user-section-container">
            <div class="user-section-container-left">
                <div class="user-section-container-left-top">
                    <div class="user-section-container-left-top-title">
                        <h1>Your order history, enjoy!</h1>
                    </div>
                    <div class="user-section-container-left-top-content">
                        <p>
                            以下是您的有效訂單，點擊查看詳細。
                        </p>
                    </div>
                </div>
            </div>
        </div>
        `;
        const headerSec = document.querySelector('#header-section');
        headerSec.insertAdjacentElement('afterend', userSection);
    },

    waitForHeaderSecRender: () => {
        const sec = document.querySelector('#header-section');
        if (sec === null) setTimeout(user.waitForHeaderSecRender, 100);
        else return true;
    },

    getCurrentQueryString: () => {
        let queryString = window.location.search;
        if (queryString.indexOf('?') === 0) {
            queryString = queryString.substring(1);
        }
        return queryString.split('=%20')[1];
    },

    getActiveOrder: async () => {
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
            })
                .then((res) => res.json())
                .then((res) => res);
            if (res.data) return res.data;
        } catch (err) {
            console.log(err);
            return false;
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

    jumpToOrderDetail: (orderId) => {
        window.location.href = `/thankyou?order_id=${orderId}`;
    },
};

user.init();

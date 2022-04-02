let initBookingApp;

let booking = {
    getToday: () => {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        return yyyy + '-' + mm + '-' + dd;
    },

    formatDate: (date) => {
        let d = new Date(date);
        let month = (d.getMonth() + 1).toString();
        let day = d.getDate().toString();
        let year = d.getFullYear();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return [year, month, day].join('-');
    },

    deleteBookingInfo: async (bookingId) => {
        try {
            const res = await fetch('/api/booking', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookingId: bookingId }),
            });
        } catch (err) {
            console.log(err);
            return false;
        }
        const container = document.querySelector(
            `#booking-info-attraction-container-id-${bookingId}`,
        );
        container.remove();
    },

    createBookingInfo: ({ id, name, category, mrt }) => {
        const bookingInfo = `
            <div class="booking">
                <div id="booking-info">
                    <div id="booking-info-title">
                        <h3>${name}</h3>
                        <p>${category} at ${mrt}</p>
                    </div>
                    <div id="booking-info-content" >
                        <h4>訂購導覽行程</h4>
                        <p >以此景點為中心的一日行程，帶您探索城市角落故事</p>
                        <div class="vc-two-ele mt-mi-1" id="booking-order-date">
                            <h4>選擇日期：</h4>
                            <input class="date ml-dot-5" id="booking-choose-order-date" type="date" name="order-date"></input>
                        </div>
                        <div class="vc-two-ele mt-mi-2" id="booking-time-period">
                            <h4>選擇時間：</h4>
                            <input class="ml-dot-5" type="radio" name="time-period" id="booking-morning" checked onclick="booking.timePeriodChangedThenUpdatePrice()"></input>
                            <label for="booking-morning">上半天</label>
                            <input type="radio" name="time-period" id="booking-afternoon" onclick="booking.timePeriodChangedThenUpdatePrice()"></input>
                                <label for="booking-afternonn">下半天</label>
                        </div>
                        <div class="vc-two-ele mt-mi-2" id="booking-price">
                            <h4>導覽費用：</h4>
                            <p class="price ml-dot-5">新台幣 <span id="price">2000</span> 元</p>
                        </div>
                        <button type="submit" id="booking-place-order" class="btn-booking-place-order" onclick="booking.bookNewOrder()">
                                開始預定行程
                        </button>
                    </div>
                </div>
            </div>
        `;
        return bookingInfo;
    },

    createBookingSection: (userName) => {
        let bookingSection = document.createElement('div');
        bookingSection.setAttribute('id', 'booking-section');
        bookingSection.innerHTML += `
          <div id="booking-container">
            <h2>您好，<span id="booking-sec-user-info">${userName}</span>，待預定行程如下 </h2>
          </div>
        `;
        const headerSec = document.querySelector('#header-section');
        headerSec.insertAdjacentElement('afterend', bookingSection);
    },

    createTapPayForm: (totalPrice) => {
        const form = document.createElement('form');
        form.setAttribute('id', 'booking-tap-pay-form');
        form.innerHTML += `
        <div class="booking-section-user-contact-info">
          <h5>您的聯絡資訊</h5>
          <div class="booking-text-block">
            <p>聯絡姓名：</p>
            <input class="booking-input-style user-contact-name contact" type="ame" placeholder="yourEmail@example.com" required="">
          </div>
          <div class="booking-text-block">
            <p>聯絡信箱：</p>
            <input class="booking-input-style user-contact-email contact" type="email" placeholder="yourEmail@example.com" required="">
          </div>
          <div class="booking-text-block">
            <p>手機號碼：</p>
            <input class="booking-input-style user-contact-phone contact" type="tel" placeholder="09xx-xxx-xxx" maxlength="10" required="">
          </div>
          <p class="booking-notice">
            請保持手機暢通，準時到達，導覽人員將用手機與您聯繫，務必留下正確的聯絡方式。
          </p>
        </div>

        <div class="booking-section-pay">
          <h5>信用卡付款資訊</h5>
          <div class="booking-text-block card-number-group">
            <label for="card-number">卡號號碼：</label>
            <div name="card-number" class="booking-input-style tpfield contact" id="card-number"><iframe frameborder="0" allowtransparency="true" scrolling="no" style="border: none; width: 100%; height: 100%; float: left;" src="https://js.tappaysdk.com/tpdirect/v5.7.0/tappay-field/html?%7B%22origin%22%3A%22http%3A%2F%2F3.141.125.128%3A3000%22%2C%22type%22%3A%22card-number%22%2C%22placeholder%22%3A%22****%20****%20****%20****%22%2C%22styles%22%3A%7B%22input%22%3A%7B%22color%22%3A%22gray%22%7D%2C%22%3Afocus%22%3A%7B%22color%22%3A%22black%22%7D%2C%22.valid%22%3A%7B%22color%22%3A%22%23448899%22%7D%2C%22.invalid%22%3A%7B%22color%22%3A%22%23d65350%22%7D%7D%2C%22field_type%22%3A%22tappay-field%22%7D"></iframe></div>
          </div>
          <div class="booking-text-block card-expiration-date-group">
            <label for="card-expiration-date">過期時間：</label>
            <div class="booking-input-style tpfield contact" id="card-expiration-date" name="card-expiration-date"><iframe frameborder="0" allowtransparency="true" scrolling="no" style="border: none; width: 100%; height: 100%; float: left;" src="https://js.tappaysdk.com/tpdirect/v5.7.0/tappay-field/html?%7B%22origin%22%3A%22http%3A%2F%2F3.141.125.128%3A3000%22%2C%22type%22%3A%22expiration-date%22%2C%22placeholder%22%3A%22MM%20%2F%20YY%22%2C%22styles%22%3A%7B%22input%22%3A%7B%22color%22%3A%22gray%22%7D%2C%22%3Afocus%22%3A%7B%22color%22%3A%22black%22%7D%2C%22.valid%22%3A%7B%22color%22%3A%22%23448899%22%7D%2C%22.invalid%22%3A%7B%22color%22%3A%22%23d65350%22%7D%7D%2C%22field_type%22%3A%22tappay-field%22%7D"></iframe></div>
          </div>
          <div class="booking-text-block card-ccv-group">
            <label for="card-ccv">驗證密碼：</label>
            <div class="booking-input-style tpfield contact" id="card-ccv" name="card-ccv"><iframe frameborder="0" allowtransparency="true" scrolling="no" style="border: none; width: 100%; height: 100%; float: left;" src="https://js.tappaysdk.com/tpdirect/v5.7.0/tappay-field/html?%7B%22origin%22%3A%22http%3A%2F%2F3.141.125.128%3A3000%22%2C%22type%22%3A%22ccv%22%2C%22placeholder%22%3A%22CCV%22%2C%22styles%22%3A%7B%22input%22%3A%7B%22color%22%3A%22gray%22%7D%2C%22%3Afocus%22%3A%7B%22color%22%3A%22black%22%7D%2C%22.valid%22%3A%7B%22color%22%3A%22%23448899%22%7D%2C%22.invalid%22%3A%7B%22color%22%3A%22%23d65350%22%7D%7D%2C%22field_type%22%3A%22tappay-field%22%7D"></iframe></div>
          </div>
        </div>
        <div class="booking-section-confirm-order">
          <h4>
            總價：新台幣<span class="booking-confirm-total">${totalPrice}</span>元
            <p class="error-msg"></p>
          </h4>
          <button type="submit" disabled="disabled" class="submit-booking-btn">
            確認訂購並付款
          </button>
        </div>`;
        const bookingInfoSec = document.querySelector('#booking-info-section');
        bookingInfoSec.insertAdjacentElement('beforeend', form);
    },

    createBookingInfoSection: (bookingInfo) => {
        let bookingInfoSec, container;
        if (document.querySelector('#booking-info-section') === null) {
            bookingInfoSec = document.createElement('div');
            bookingInfoSec.setAttribute('id', 'booking-info-section');
            bookingInfoSec.innerHTML += `
              <div class="booking-info-container mt-mi-2">
              </div>
            `;
            const bookingSec = document.querySelector('#booking-section');
            bookingSec.insertAdjacentElement('beforeend', bookingInfoSec);
        }
        container = document.querySelector('.booking-info-container');
        const timePeriod =
            bookingInfo.time === 'morning'
                ? '早上九點到下午四點'
                : '下午五點到晚上十點';
        const date = booking.formatDate(bookingInfo.date);
        container.innerHTML += `
          <div class="booking-info-attractoin-container mt-2" id="booking-info-attraction-container-id-${bookingInfo.booking_id}">
            <img class="booking-info-img" src="${bookingInfo.attraction.image}">
            <div class="booking-info-detail">
              <div class="booking-text-block">
                <h4 class="emphasize-font">台北一日遊：</h4>
                <p class="emphasize-font">${bookingInfo.attraction.name}</p>
              </div>
              <div class="booking-text-block">
                <h4>日期：</h4>
                <p id="booking-info-date">${date}</p>
              </div>
              <div class="booking-text-block">
                <h4>時間：</h4>
                <p id="booking-info-time">
                ${timePeriod}
                </p>
              </div>
              <div class="booking-text-block">
                <h4>費用：</h4>
                <p>新台幣 <span id="booking-info-price">${bookingInfo.price}</span> 元</p>
              </div>
              <div class="booking-text-block">
                <h4>地點：</h4>
                <p class="booking-info-address">${bookingInfo.attraction.address}</p>
              </div>
            </div>
            <img class="booking-info-delete" src="/image/icon_delete.svg" alt="" onclick="booking.deleteBookingInfo(${bookingInfo.booking_id})">
          </div>
        `;
    },

    timePeriodChangedThenUpdatePrice: () => {
        const timePeriod = document.querySelector(
            'input[name="time-period"]:checked',
        );
        const price = document.querySelector('#price');
        price.innerHTML = timePeriod.id === 'booking-morning' ? 2000 : 2500;
    },

    bookNewOrder: async () => {
        const userInfo = await booking.getUserInfo();
        console.log(userInfo);
        if (userInfo.data === null) {
            modal.modalPopUp();
            return;
        }
        if (booking.checkIfOrderDateIsChoose()) {
            booking.newOrder();
            booking.jumpToBookingPage();
        }
    },

    getBookingInfo: () => {
        const orderDate = document.querySelector(
            '#booking-choose-order-date',
        ).value;
        const timePeriod = document.querySelector(
            'input[name="time-period"]:checked',
        ).id;
        const price = document.querySelector('#price').innerHTML;
        const attractionId = window.location.pathname.split('/')[2];
        const order = {
            attractionId: attractionId,
            date: orderDate,
            time: timePeriod,
            price: price,
        };
        return order;
    },

    newOrder: async () => {
        const bookingInfo = booking.getBookingInfo();
        try {
            const res = await jsonRequests(
                (url = '/api/booking'),
                (method = 'POST'),
                (body = JSON.parse(JSON.stringify(bookingInfo))),
            );
        } catch (err) {
            console.log(err);
            return false;
        }
        return true;
    },

    checkIfOrderDateIsChoose: () => {
        const orderDate = document.querySelector('#booking-choose-order-date');
        if (orderDate.value === '') {
            booking.invalidOrderDate(orderDate);
            return false;
        }
        return true;
    },

    invalidOrderDate: (dom) => {
        dom.classList.add('invalid-order-date');
        setTimeout(() => {
            dom.classList.remove('invalid-order-date');
        }, 3000);
    },

    jumpToBookingPage: () => {
        window.location.href = '/booking';
    },

    jumpToIndexPage: () => {
        window.location.href = '/';
    },

    getUserBookingInfo: async () => {
        try {
            const res = await jsonRequests(
                (url = '/api/booking'),
                (method = 'GET'),
            );
            return res;
        } catch (err) {
            console.log(err);
            return false;
        }
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

    checkCurrentLocationIsBookingPage: () => {
        const currentLocation = window.location.pathname;
        if (currentLocation === '/booking') {
            return true;
        }
        return false;
    },

    renderBookingInfo: async () => {
        if (booking.checkCurrentLocationIsBookingPage()) {
            let totalPrice = 0;
            const userBookingInfo = await booking.getUserBookingInfo();
            const userInfo = await booking.getUserInfo();
            if (userInfo.data === null) {
                booking.jumpToIndexPage();
                return;
            }
            if (userBookingInfo.error === true) {
            }
            if (userBookingInfo.data.length > 1) {
                booking.createBookingSection(userInfo.data.name);
                userBookingInfo.data.forEach((item, idx) => {
                    totalPrice += item.data.price;
                    booking.createBookingInfoSection(item.data);
                });
            } else if (userBookingInfo.data) {
                booking.createBookingSection(userInfo.data.name);
                booking.createBookingInfoSection(userBookingInfo.data);
            }
            booking.createTapPayForm(totalPrice);
        }
    },
};

(initBookingApp = () => {
    bookingApp = {
        init: () => {
            navbar.insertHeaderAtFirstDomInBody();
            footer.insertFooterAtLastDomInBody();
            booking.renderBookingInfo();
        },
    };
    bookingApp.init();
})();

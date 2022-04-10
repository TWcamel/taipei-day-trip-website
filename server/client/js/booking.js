let initBookingApp;

let booking = {
    totalPrice: {
        value: 0,
        set: (value) => {
            booking.totalPrice.value = value;
        },
        get: () => {
            return booking.totalPrice.value;
        },
    },
    id: {
        value: null,
        set: (value) => {
            booking.id.value = value;
        },
        get: () => {
            return booking.id.value;
        },
    },
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

    dateToLocalTime: (date) => {
        let d = new Date(date);
        let localTime = d.toLocaleTimeString();
        return localTime;
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

    createHorizontalLine: (container, position) => {
        let line = document.createElement('hr');
        line.classList.add('horizontal-line');
        container.insertAdjacentElement(position, line);
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
        if (document.querySelector('#booking-section')) return;
        headerSec.insertAdjacentElement('afterend', bookingSection);
    },

    createBookingInfoSection: (bookingInfo) => {
        let bookingInfoSec, container;
        if (document.querySelector('#booking-info-section') === null) {
            bookingInfoSec = document.createElement('div');
            bookingInfoSec.setAttribute('id', 'booking-info-section');
            bookingInfoSec.innerHTML += `
              <div class="booking-info-container">
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
          <div class="booking-info-attractoin-container mt-2" id="booking-info-attraction-container-id-${
              bookingInfo.booking_id
          }">
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
                <p>新台幣 <span id="booking-info-price">${
                    bookingInfo.price
                }</span> 元</p>
              </div>
              <div class="booking-text-block">
                <h4>地點：</h4>
                <p class="booking-info-address">${
                    bookingInfo.attraction.address
                }</p>
              </div>
              <div class="booking-text-block">
                <h4>下單日期：</h4>
                <p class="booking-info-order">${booking.formatDate(
                    bookingInfo.claimTime,
                )} ${booking.dateToLocalTime(bookingInfo.claimTime)}</p>
              </div>
            </div>
            <img class="booking-info-delete" src="/image/icon_delete.svg" alt="" onclick="booking.deleteBookingInfo(${
                bookingInfo.booking_id
            })">
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

    createEmptyBookingInfoNotify: () => {
        const bookingInfoSec = document.createElement('div');
        bookingInfoSec.classList.add('booking-info-container');
        bookingInfoSec.innerHTML = `
          <div class="booking-info-attractoin-container">
            <div class="booking-info-detail">
              <div class="booking-text-block">
                <h2 class="emphasize-font">您尚未有任何預約</h4>
              </div>
            </div>
          </div>
        `;
        return bookingInfoSec;
    },

    showEmptyBookingInfoNotify: () => {
        const bookingInfoSec = document.querySelector(
            '.booking-info-container',
        );
        bookingInfoContainer.setAttribute('style', 'display: block');
    },

    hideEmptyBookingInfoNotify: () => {
        const bookingInfoSec = document.querySelector(
            '.booking-info-container',
        );
        bookingInfoContainer.setAttribute('style', 'display: none');
    },

    checkIfEmptyBookingInfoExists: () => {
        const bookingInfoSec = document.querySelector(
            '.booking-info-container',
        );
        return bookingInfoSec === null ? false : true;
    },

    renderBookingInfo: async () => {
        if (booking.checkCurrentLocationIsBookingPage()) {
            let price = 0;
            let bookingId = [];
            const userBookingInfo = await booking.getUserBookingInfo();
            const userInfo = await booking.getUserInfo();
            if (userInfo.data === null) {
                booking.jumpToIndexPage();
                return;
            }

            if (userBookingInfo.message === 'No booking found') {
                const bookingInfoSec = booking.createEmptyBookingInfoNotify();
                const headerSec = document.querySelector('#header-section');
                if (!booking.checkIfEmptyBookingInfoExists())
                    headerSec.insertAdjacentElement('afterend', bookingInfoSec);
                return;
            }

            if (booking.checkIfEmptyBookingInfoExists())
                booking.hideEmptyBookingInfoNotify();

            if (userBookingInfo.data.length > 1) {
                userBookingInfo.data.forEach((item, idx) => {
                    booking.createBookingSection(userInfo.data.name);
                    booking.createBookingInfoSection(item.data);
                    price += item.data.price;
                    bookingId.push(item.data.booking_id);
                });
            } else if (userBookingInfo.data) {
                booking.createBookingSection(userInfo.data.name);
                booking.createBookingInfoSection(userBookingInfo.data);
                price += userBookingInfo.data.price;
                bookingId.push(userBookingInfo.data.booking_id);
            }
            booking.totalPrice.set(price);
            booking.id.set(bookingId);
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

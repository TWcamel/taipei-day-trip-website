let initBookingApp;
(initBookingApp = () => {
    bookingApp = {
        init: () => {
            navbar.insertHeaderAtFirstDomInBody();
            footer.insertFooterAtLastDomInBody();
        },
    };
    bookingApp.init();
})();

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
                        <button type="submit" id="booking-place-order" class="btn-booking-place-order" onclick="window.location.href='/booking'">
                                開始預定行程
                        </button>
                    </div>
                </div>
            </div>
        `;
        return bookingInfo; 
    },

    timePeriodChangedThenUpdatePrice: () => {
        const timePeriod = document.querySelector(
            'input[name="time-period"]:checked',
        );
        const price = document.querySelector('#price');
        price.innerHTML = timePeriod.id === 'booking-morning' ? 2000 : 2500;
    },
};

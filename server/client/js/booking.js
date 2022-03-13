let booking = {
    createBookingInfo: ({ id, name, category, mrt }) => {
        const date = new Date()
        const today =
            date.getFullYear() +
            '-' +
            (date.getMonth() + 1) +
            '-' +
            date.getDate()

        const bookingInfo = `
            <div class="booking">
                <div id="booking-info">
                    <div id="booking-info-title">
                        <h4>${name}</h4>
                        <p>${category} at ${mrt}</p>
                    </div>
                    <div id="booking-info-content">
                        <h5>訂購導覽行程</h5>
                        <p>以此景點為中心的一日行程，帶您探索城市角落故事</p>
                        <div class="vc-two-ele" id="booking-order-date">
                            <h5>選擇日期</h5>
                            <input class="date ml-2" id="booking-choose-order-date" type="date" name="order-date" min="${today}"></input>
                        </div>
                        <div class="vc-two-ele mt-mi-2" id="booking-time-period">
                            <h5>選擇時間</h5>
                            <input class="ml-2" type="radio" name="time-period" id="booking-morning" checked></input>
                            <label for="booking-morning">上半天</label>
                            <input type="radio" name="time-period" id="booking-afternoon"></input>
                                <label for="booking-afternonn">下半天</label>
                        </div>
                        <div class="vc-two-ele mt-mi-2" id="booking-price">
                            <h5>導覽費用</h5>
                            <p class="price ml-2">新台幣<span id="price"> 2000 </span>元</p>
                        </div>
                        <button type="submit" id="booking-place-order" class="btn-booking-place-order">
                                開始預定行程
                        </button>
                    </div>
                </div>
            </div>
        `

        return bookingInfo
    },
}

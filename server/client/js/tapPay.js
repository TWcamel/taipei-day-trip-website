import tapPayConfig from '/../config/tapPay.js';

let tapPay = {
    init: () => {
        const bookingSec = document.querySelector('#booking-section');
        tapPay.insertPositionToDom(
            tapPay.createTapPayContainer(),
            'afterEnd',
            bookingSec,
        );
        const tapPayContainer = document.querySelector('.tap-pay-container');
        tapPay.insertPositionToDom(
            tapPay.createDivider(),
            'beforeEnd',
            tapPayContainer,
        );
        tapPay.insertPositionToDom(
            tapPay.createContactView(),
            'beforeEnd',
            tapPayContainer,
        );
        tapPay.insertPositionToDom(
            tapPay.createDivider(),
            'beforeEnd',
            tapPayContainer,
        );
        tapPay.insertPositionToDom(
            tapPay.createCardView(),
            'beforeEnd',
            tapPayContainer,
        );
        const cardView = document.querySelector('.card-view-container');
        tapPay.insertPositionToDom(
            tapPay.createDivider(),
            'beforeEnd',
            tapPayContainer,
        );
        tapPay.createPriceAndOrderBtn();
    },
    createPriceContainer: (_price) => {
        const priceContainer = document.createElement('div');
        priceContainer.classList.add('price-view-container');
        priceContainer.innerHTML = `
          <div class="dom-in-same-line justfy-end second-text">
            <h3 class="price-container-title mr-1">
                <span>總價</span>
            </h3>
            <h3 class="price-container-price second-text">
                <span>新台幣 $${_price}</span>
            </h3>
          <div>
        `;
        return priceContainer;
    },

    createPriceAndOrderBtn: () => {
        const price = booking.totalPrice.get();
        const priceContainer = tapPay.createPriceContainer(price);
        let tapPayContainer = document.createElement('div');
        tapPayContainer.classList.add('tap-pay-btn-container');
        tapPayContainer.classList.add('justfy-end');
        const tapPayBtn = tapPay.createTapPayButton();
        const footer = document.querySelector('#footer');
        tapPay.insertPositionToDom(priceContainer, 'beforeBegin', footer);
        tapPay.insertPositionToDom(
            tapPayContainer,
            'beforeEnd',
            priceContainer,
        );
        tapPay.insertPositionToDom(tapPayBtn, 'beforeEnd', tapPayContainer);
    },
    createTapPayContainer: () => {
        let container = document.createElement('div');
        container.classList.add('tap-pay-container');
        return container;
    },
    createTapPayButton: () => {
        let button = document.createElement('button');
        button.classList.add('tap-pay-button');
        button.classList.add('justfy-end');
        button.innerHTML = '確認訂購並付款';
        button.onclick = tapPay.tapPayButtonClicked();
        return button;
    },
    insertPositionToDom: (element, position, reference) => {
        reference.insertAdjacentElement(position, element);
    },
    waitBookingSectionIsReadyThenDoTapPay: () => {
        const bookingSec = document.querySelector('#booking-section');
        if (bookingSec) {
            tapPay.init();
            tapPay.setUpTapPay();
            tapPay.activateCardView();
        } else {
            setTimeout(tapPay.waitBookingSectionIsReadyThenDoTapPay, 200);
        }
    },
    setUpTapPay: () => {
        TPDirect.setupSDK(tapPayConfig.APP_ID, tapPayConfig.APP_KEY, 'sandbox');
    },
    createContactView: () => {
        let view = document.createElement('div');
        view.classList.add('contact-view-container');
        view.innerHTML += `
          <h2>您的聯絡資訊</h2>
          <div class="contact-view-item">
            <label class="mr-1">姓名:</label>
            <input type="text" name="name" placeholder="請輸入姓名" />
          </div>
          <div class="contact-view-item">
            <label class="mr-1">信箱:</label>
            <input type="text" name="email" placeholder="請輸入信箱" />
          </div>
          <div class="contact-view-item">
            <label class="mr-1">電話:</label>
            <input type="text" name="phone" placeholder="請輸入電話" />
          </div>
          <h3>請保持手機暢通，準時到達，導覽人員將用手機與您聯繫，務必留下正確的聯絡方式</h3>
        `;
        return view;
    },
    createCardView: () => {
        let cardView = document.createElement('div');
        cardView.classList.add('card-view-container');
        cardView.innerHTML += `
          <h2>信用卡付款資訊</h2>
          <div class="card-view-item dom-in-same-line">
            <label class="mr-1">信用卡:</label>
            <div id="card-view-ifram">
            <div id="tappay-iframe"></div>
          </div>
          `;
        return cardView;
    },
    createDivider: () => {
        let divider = document.createElement('hr');
        divider.classList.add('order-divider');
        return divider;
    },
    setCardViewStyle: () => {
        const carViewDefaultStyle = {
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: '300',
            errorColor: 'red',
        };
        return carViewDefaultStyle;
    },
    activateCardView: () => {
        TPDirect.card.setup('#card-view-ifram', tapPay.setCardViewStyle(), {
            isUsedCcv: true,
        });
    },
    tapPayButtonClicked: () => {
        TPDirect.card.onUpdate((update) => {
            update.canGetPrime === true ? tapPay.sendCardInfoToServer() : null;
        });
    },
    sendCardInfoToServer: () => {
        TPDirect.card.getPrime((result) => {
            if (result.status !== 0) {
                return;
            }
            const prime = result.card.prime;
            const contact = tapPay.getContactInfo();

            // TODO: make frontend page more readable
            const order = {
                prime: prime,
                partner_key: tapPayConfig.PARTNER_KEY,
                merchant_id: tapPayConfig.MERCHANT_ID,
                contact,
                totalPrice: booking.totalPrice.get(),
            };

            (async () => {
                try {
                    const res = await fetch('/api/orders', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': tapPayConfig.PARTNER_KEY,
                        },
                        body: JSON.stringify(order),
                    });
                } catch (err) {
                    console.log(err);
                    return false;
                }
            })();
        });
    },
    getContactInfo: () => {
        const contactInfo = {
            name: document.querySelector('input[name="name"]').value,
            email: document.querySelector('input[name="email"]').value,
            phone: document.querySelector('input[name="phone"]').value,
        };
        return contactInfo;
    },
};

tapPay.waitBookingSectionIsReadyThenDoTapPay();

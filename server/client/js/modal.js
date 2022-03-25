let modal = {
    modalContainer: () => {
        const modalContainer = document.createElement('div');
        modalContainer.classList.add('modal-container');
        return modalContainer;
    },

    createModal: () => {
        const body = document.querySelector('body');
        body.insertAdjacentElement('afterbegin', modal.modalContainer());
    },

    checkModalIfExists: () => {
        const modal = document.querySelector('.modal-container');
        return modal !== null;
    },

    checkModalIsHiding: () => {
        const modal = document.querySelector('.modal-container');
        return modal.style.display === 'none';
    },

    hideModal: () => {
        const modal = document.querySelector('.modal-container');
        modal.setAttribute('style', 'display: none');
    },

    showModal: () => {
        const modal = document.querySelector('.modal-container');
        modal.setAttribute('style', 'display: block');
    },

    modalPopUp: () => {
        if (!modal.checkModalIfExists()) {
            modal.createModal();
            modal.createModalContent();
            modal.createEleInsideTargetDom(
                modal.createModalContent(),
                '.modal-container'
            );
            modal.createEleInsideTargetDom(
                modal.createModalCloseBtn(),
                '.modal-content'
            );
            modal.createCloseBtnEvent();
            modal.createEleInsideTargetDom(
                modal.createLoginForm(),
                '.modal-content'
            );
            modal.createEleInsideTargetDom(
                modal.createSignupForm(),
                '.modal-content'
            );
            modal.createEleInsideTargetDom(
                modal.createSuccessfullyLoggedInMessage(),
                '.modal-content'
            );
            modal.createEleInsideTargetDom(
                modal.createSuccessfullyLoggedOutMessage(),
                '.modal-content'
            );
            modal.createEleInsideTargetDom(
                modal.createSuccessfullySignupMessage(),
                '.modal-content'
            );

            modal.showModal();
        } else if (modal.checkModalIsHiding()) modal.showModal();
        else if (modal.checkModalIfExists()) modal.hideModal();
    },

    createModalCloseBtn: () => {
        const closeBtn = document.createElement('button');
        closeBtn.classList.add('modal-close-btn');
        closeBtn.innerHTML = '&times;';
        return closeBtn;
    },

    createModalContent: () => {
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        return modalContent;
    },

    createLoginForm: () => {
        const form = document.createElement('form');
        form.classList.add('modal-login-form');
        form.setAttribute('id', 'user-login-form');
        modal.createFormTitle(form, '登入會員帳號');
        const emailInput = {
            form: form,
            inputType: 'email',
            inputName: 'email',
            inputPlaceholder: '請輸入電子信箱',
            inputRequired: true,
            inputId: 'user-login-email',
        };
        const passwordInput = {
            form: form,
            inputType: 'password',
            inputName: 'password',
            inputPlaceholder: '請輸入密碼',
            inputRequired: true,
            inputId: 'user-login-password',
        };
        const submitBtn = {
            form: form,
            btnMessage: '登入帳戶',
            onclick: 'modal.loginFormSubmit()',
            id: 'user-login-submit-btn',
        };
        modal.createFormInput(emailInput);
        modal.createFormInput(passwordInput);
        modal.createFormSubmitBtn(submitBtn);
        const linkMessage = {
            link: '#',
            linkMsg: '點此註冊會員帳號',
            onclick: 'modal.switchToSignupFrom()',
        };
        modal.createFormHelpMessageWithLink(form, '還沒有帳戶？', linkMessage);
        return form;
    },

    createSignupForm: () => {
        const form = document.createElement('form');
        form.classList.add('modal-signup-form');
        form.setAttribute('id', 'user-signup-form');
        modal.createFormTitle(form, '註冊會員帳號');
        const nameInput = {
            form: form,
            inputType: 'text',
            inputName: 'name',
            inputPlaceholder: '請輸入姓名',
            inputRequired: true,
            inputId: 'user-signup-name',
        };
        const emailInput = {
            form: form,
            inputType: 'email',
            inputName: 'email',
            inputPlaceholder: '請輸入電子信箱',
            inputRequired: true,
            inputId: 'user-signup-email',
        };
        const passwordInput = {
            form: form,
            inputType: 'password',
            inputName: 'password',
            inputPlaceholder: '請輸入密碼',
            inputRequired: true,
            inputId: 'user-signup-password',
        };

        const submitBtn = {
            form: form,
            btnMessage: '註冊帳戶',
            onclick: 'modal.signupFormSubmit()',
            id: 'user-signup-submit-btn',
        };

        modal.createFormInput(nameInput);
        modal.createFormInput(emailInput);
        modal.createFormInput(passwordInput);
        modal.createFormSubmitBtn(submitBtn);

        const linkMessage = {
            link: '#',
            linkMsg: '點此登入',
            onclick: 'modal.switchToLoginForm()',
        };
        modal.createFormHelpMessageWithLink(
            form,
            '已經有帳戶了？',
            linkMessage
        );

        return form;
    },

    createFormTitle: (form, title) => {
        const formTitle = document.createElement('h2');
        formTitle.innerHTML = title;
        form.appendChild(formTitle);
    },

    createFormInput: ({
        form,
        inputType,
        inputName,
        inputPlaceholder,
        inputRequired,
        inputId,
    }) => {
        const formInput = document.createElement('input');
        formInput.setAttribute('type', inputType);
        formInput.setAttribute('name', inputName);
        formInput.setAttribute('placeholder', inputPlaceholder);
        formInput.setAttribute('required', inputRequired);
        formInput.setAttribute('id', inputId);
        form.appendChild(formInput);
    },

    createFormSubmitBtn: ({ form, btnMessage, onclick, id }) => {
        const formSubmmitBtn = document.createElement('button');
        formSubmmitBtn.classList.add('modal-form-submmit-btn');
        formSubmmitBtn.setAttribute('onclick', onclick);
        formSubmmitBtn.setAttribute('id', id);
        formSubmmitBtn.innerHTML = btnMessage;
        form.appendChild(formSubmmitBtn);
        form.onsubmit = () => {
            return false;
        };
    },

    createFormHelpMessageWithLink: (
        form,
        message,
        linkMessage = { link, linkMsg, onclick }
    ) => {
        const formHelpMessage = document.createElement('p');
        formHelpMessage.classList.add('modal-form-help-message');
        formHelpMessage.innerHTML = message;
        modal.createFormHelpMessageLink(formHelpMessage, linkMessage);
        form.appendChild(formHelpMessage);
    },

    createFormHelpMessageLink: (dom, { link, linkMsg, onclick }) => {
        const formHelpMessageLink = document.createElement('span');
        formHelpMessageLink.classList.add('modal-form-help-message-link');
        formHelpMessageLink.innerHTML = linkMsg;
        formHelpMessageLink.setAttribute('onclick', onclick);
        dom.appendChild(formHelpMessageLink);
    },

    createEleInsideTargetDom: (ele, targetDom) => {
        const modalContent = document.querySelector(targetDom);
        modalContent.appendChild(ele);
    },

    createCloseBtnEvent: () => {
        const closeBtn = document.querySelector('.modal-close-btn');
        closeBtn.addEventListener('click', () => {
            modal.hideModal();
        });
    },

    switchToLoginForm: () => {
        const signupForm = document.querySelector('.modal-signup-form');
        const loginForm = document.querySelector('.modal-login-form');
        signupForm.style.display = 'none';
        loginForm.style.display = 'grid';
    },

    switchToSignupFrom: () => {
        const signupForm = document.querySelector('.modal-signup-form');
        const loginForm = document.querySelector('.modal-login-form');
        signupForm.style.display = 'grid';
        loginForm.style.display = 'none';
    },

    loginFormSubmit: () => {
        const loginForm = document.querySelector('#user-login-form');
        const loginFormData = new FormData(loginForm);
        const loginFormDataObj = {};
        for (const [key, value] of loginFormData.entries())
            loginFormDataObj[key] = value;

        //if (loginFormDataObj.email.indexOf('@') === -1) return;
        const loginFormDataJson = JSON.stringify(loginFormDataObj);

        (async () => {
            try {
                const res = await jsonRequests(
                    (url = '/api/user'),
                    (method = 'PATCH'),
                    (body = JSON.parse(loginFormDataJson))
                );
                if (res.ok) {
                    navbar.changeNavItem(true);

                    modal.hideOrShowTargetDom('#user-login-form', false);
                    modal.hideOrShowTargetDom(
                        '.modal-successfully-logged-in-message',
                        true
                    );
                    modal.reloadPageAfterDelay(2000);
                }
                if (res.error) {
                    if (modal.checkIfTargetDomExists('.modal-form-btn-message'))
                        modal.hideOrShowTargetDom(
                            '.modal-form-btn-message',
                            true
                        );
                    else
                        modal.appendSiblingAfterDom(
                            '<p class="modal-form-btn-message">您輸入的信箱或密碼不正確</p>',
                            '#user-login-submit-btn'
                        );
                }
            } catch (e) {
                console.error(e);
            }
        })();
    },

    signupFormSubmit: () => {
        const signupForm = document.querySelector('#user-signup-form');
        const signupFormData = new FormData(signupForm);
        const signupFormDataObj = {};
        for (const [key, value] of signupFormData.entries())
            signupFormDataObj[key] = value;

        if (signupFormDataObj.email.indexOf('@') < 1) return;

        const signupFormDataJson = JSON.stringify(signupFormDataObj);

        (async () => {
            try {
                const res = await jsonRequests(
                    (url = '/api/user'),
                    (method = 'POST'),
                    (body = JSON.parse(signupFormDataJson))
                );
                if (res.ok) {
                    modal.hideOrShowTargetDom('#user-signup-form', false);
                    modal.hideOrShowTargetDom(
                        '.modal-successfully-signup-message',
                        true
                    );

                    modal.jumpToLoginFormAferDelay(2000);
                }
                if (res.error) {
                    if (
                        modal.checkIfTargetDomExists(
                            '.modal-signup-form-btn-message'
                        )
                    )
                        modal.hideOrShowTargetDom(
                            '.modal-signup-form-btn-message',
                            true
                        );
                    else
                        modal.appendSiblingAfterDom(
                            '<p class="modal-signup-form-btn-message">電子郵件已經被註冊過了</p>',
                            '#user-signup-submit-btn'
                        );
                }
            } catch (e) {
                console.error(e);
            }
        })();
    },

    logOut: async () => {
        try {
            const res = await jsonRequests(
                (url = '/api/user'),
                (method = 'DELETE')
            );
            console.log(res);
            if (res.ok) {
                modal.hideOrShowTargetDom('.modal-container', true);
                modal.hideOrShowTargetDom(
                    '.modal-successfully-logged-in-message',
                    false
                );
                modal.hideOrShowTargetDom(
                    '.modal-successfully-logged-out-message',
                    true
                );
                modal.reloadPageAfterDelay(2000);
            }
        } catch (e) {
            console.error(e);
        }
    },

    checkUserLoggedIn: async () => {
        try {
            const res = await jsonRequests(
                (url = '/api/user'),
                (method = 'PATCH'),
                (body = { email: 'check', password: 'check' })
            );
            return res.ok ? true : false;
        } catch (e) {
            console.error(e);
        }
    },

    appendSiblingAfterDom: (msg, targetDom) => {
        const targetDomEle = document.querySelector(targetDom);
        targetDomEle.insertAdjacentHTML('afterEnd', msg);
    },

    checkIfTargetDomExists: (dom) => {
        const modalFormBtnMessage = document.querySelector(`${dom}`) || false;
        return modalFormBtnMessage ? true : false;
    },

    createSuccessfullyLoggedInMessage: () => {
        const div = document.createElement('div');
        div.classList.add('modal-successfully-logged-in-message');
        div.innerHTML = '<h3>登入成功</h3>';
        return div;
    },

    createSuccessfullyLoggedOutMessage: () => {
        const div = document.createElement('div');
        div.classList.add('modal-successfully-logged-out-message');
        div.innerHTML = '<h3>登出成功</h3>';
        return div;
    },

    createSuccessfullySignupMessage: () => {
        const div = document.createElement('div');
        div.classList.add('modal-successfully-signup-message');
        div.innerHTML = '<h3>成功註冊會員</h3>';
        return div;
    },

    hideOrShowTargetDom: (targetDom, show = true) => {
        const targetDomEle = document.querySelector(targetDom);
        if (show) targetDomEle.style.display = 'grid';
        else targetDomEle.style.display = 'none';
    },

    closeModalAfterDelay: (delay = 2000) => {
        setTimeout(() => {
            modal.hideOrShowTargetDom('.modal-container', false);
        }, delay);
    },

    reloadPageAfterDelay: (delay = 2000) => {
        setTimeout(() => {
            window.location.reload();
        }, delay);
    },

    jumpToLoginFormAferDelay: (delay = 2000) => {
        setTimeout(() => {
            modal.hideOrShowTargetDom('.modal-container', true);
            modal.hideOrShowTargetDom(
                '.modal-successfully-logged-in-message',
                false
            );
            modal.hideOrShowTargetDom(
                '.modal-successfully-logged-out-message',
                false
            );
            modal.hideOrShowTargetDom(
                '.modal-successfully-signup-message',
                false
            );
            if (modal.checkIfTargetDomExists('.modal-signup-form-btn-message'))
                modal.hideOrShowTargetDom(
                    '.modal-signup-form-btn-message',
                    false
                );
            if (modal.checkIfTargetDomExists('.modal-form-btn-message'))
                modal.hideOrShowTargetDom('.modal-form-btn-message', false);
            modal.hideOrShowTargetDom('#user-signup-form', false);
            modal.hideOrShowTargetDom('#user-login-form', true);
        }, delay);
    },
};

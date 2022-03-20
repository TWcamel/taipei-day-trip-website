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
        form.setAttribute('action', '/api/user');
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
        modal.createFormInput(emailInput);
        modal.createFormInput(passwordInput);
        modal.createFormSubmitBtn(form, '登入帳戶');
        const linkMessage = {
            link: '#',
            linkMsg: '點此註冊新帳戶',
            onclick: 'modal.switchToSignupFrom()',
        };
        modal.createFormHelpMessageWithLink(form, '還沒有帳戶？', linkMessage);
        return form;
    },

    createSignupForm: () => {
        const form = document.createElement('form');
        form.classList.add('modal-signup-form');
        form.setAttribute('id', 'user-signup-form');
        form.setAttribute('action', '/api/user');
        form.setAttribute('method', 'post');
        modal.createFormTitle(form, '註冊新帳戶');
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
        modal.createFormInput(nameInput);
        modal.createFormInput(emailInput);
        modal.createFormInput(passwordInput);

        modal.createFormSubmitBtn(form, '註冊帳戶');
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

    createFormSubmitBtn: (form, btnName) => {
        const formSubmmitBtn = document.createElement('button');
        formSubmmitBtn.classList.add('modal-form-submmit-btn');
        formSubmmitBtn.innerHTML = btnName;
        form.appendChild(formSubmmitBtn);
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
        const formHelpMessageLink = document.createElement('a');
        formHelpMessageLink.classList.add('modal-form-help-message-link');
        formHelpMessageLink.href = link;
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
};

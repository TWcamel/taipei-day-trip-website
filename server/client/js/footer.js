let footer = {
    footerSection: () => {
        const date = new Date();
        const year = date.getFullYear();
        const footSection = `<footer id='footer'>
            <p>COPYRIGHT © ${year} 台北一日遊</p>
        </footer>`;

        return footSection;
    },

    insertFooterAtLastDomInBody: () => {
        const body = document.querySelector('body');
        body.insertAdjacentHTML('afterend', footer.footerSection());
    },

    checkIfFooterExist: () => {
        const footer = document.querySelector('#footer');
        return footer !== null;
    },
};

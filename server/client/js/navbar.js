let navbar = {
    headSection: async () => {
        const isLoggedIn = await modal.checkUserLoggedIn();
        const navBarItem =
            navbar.changeNavItemsBaseOnUserLoggedInStatus(isLoggedIn);
        const header = `<div id="header-section">
            <nav id="nav-bar">
                <a id="nav-bar-title" href='/'>台北一日遊</a>
                <input
                    class="nav-bar-btn"
                    type="checkbox"
                    id="nav-bar-icon-fn"
                />
                <label class="nav-bar-icon" for="nav-bar-icon-fn">
                    <span id="navicon"></span>
                </label>
                <ul id="nav-bar-item">
                    ${navBarItem}
                </ul>
            </nav>
        </div>
        `;
        return header;
    },

    insertHeaderAtFirstDomInBody: () => {
        const body = document.querySelector('body');
        (async () => {
            const header = await navbar.headSection();
            body.insertAdjacentHTML('afterbegin', header);
        })();
    },

    changeNavItem: (isUserLoggedIn) => {
        const navItem = document.querySelector('#nav-bar-item');
        const userLoggedIn = isUserLoggedIn;
        navItem.innerHTML =
            navbar.changeNavItemsBaseOnUserLoggedInStatus(userLoggedIn);
    },

    changeNavItemsBaseOnUserLoggedInStatus: (isLoggedIn) => {
        return ` ${
            isLoggedIn === true
                ? '<li><a href="javascript:;" onclick="navbar.navToBookingPage()">預定行程</a></li><li><a href="javascript:;" onclick="navbar.navToUserPage()">會員頁面</a></li>'
                : '<li><a href="javascript:;" onclick="modal.modalPopUp()">預定行程</a></li>'
        } <li> ${
            isLoggedIn === true
                ? `<a href="javascript:;" onclick="modal.logOut()">登出</a>`
                : '<a href="javascript:;" onclick="modal.modalPopUp()">登入/註冊</a>'
        }
          </li>
        `;
    },

    checkIfNavbarExist: () => {
        const navbar = document.querySelector('#nav-bar');
        return navbar !== null;
    },

    navToBookingPage: () => {
        window.location.href = '/booking';
    },
    navToUserPage: () => {
        window.location.href = '/user';
    },
};

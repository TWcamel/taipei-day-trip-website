let navbar = {
    headSection: () => {
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
                    <li>
                        <a href="">預定行程</a>
                    </li>
                    <li>
                        <a class="modal-btn" href="javascript:;" onclick="modal.modalPopUp()">登入/註冊</a>
                    </li>
                </ul>
            </nav>
        </div>
        `;
        return header;
    },

    insertHeaderAtFirstDomInBody: () => {
        const body = document.querySelector('body');
        body.insertAdjacentHTML('afterbegin', navbar.headSection());
    },
};

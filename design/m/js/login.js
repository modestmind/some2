/**
 * Login UI Layer
 */
class LoginUI {
    constructor() {
        this.btnKakao = document.getElementById('btnKakaoLogin');
        this.btnGoogle = document.getElementById('btnGoogleLogin');
    }
}

/**
 * Login Controller
 */
class LoginController {
    constructor(ui) {
        this.ui = ui;
        this.bindEvents();
    }

    bindEvents() {
        if(this.ui.btnKakao) {
            this.ui.btnKakao.addEventListener('click', () => {
                alert('카카오 간편 로그인으로 연결됩니다.');
            });
        }
        
        if(this.ui.btnGoogle) {
            this.ui.btnGoogle.addEventListener('click', () => {
                alert('구글 간편 로그인으로 연결됩니다.');
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new LoginUI();
    new LoginController(ui);
});

/**
 * Payment UI Layer
 */
class PaymentUI {
    constructor() {
        this.lockIcon = document.getElementById('lockIcon');
        this.priceArea = document.getElementById('priceArea');
        this.btnActivate = document.getElementById('btnActivate');
    }

    animateLock() {
        if (this.lockIcon) {
            this.lockIcon.classList.add('pulse');
        }
    }

    animatePriceFadeIn() {
        if (this.priceArea) {
            // 약간의 지연 후 등장하도록 설정하여 사용자의 시선을 유도
            setTimeout(() => {
                this.priceArea.classList.add('fade-in');
            }, 500);
        }
    }
}

/**
 * Payment Controller Layer
 */
class PaymentController {
    constructor(ui) {
        this.ui = ui;
        this.bindEvents();
    }

    bindEvents() {
        if (this.ui.btnActivate) {
            this.ui.btnActivate.addEventListener('click', () => {
                this.triggerPaymentModule();
            });
        }
    }

    triggerPaymentModule() {
        // 복잡한 인증창 대신 간편결제 모듈 팝업을 즉각 트리거하는 것을 시뮬레이션
        alert('카카오페이 / 토스페이 / 네이버페이 결제 모듈이 실행됩니다.\n\n(테스트: 열람 권한이 활성화되었습니다.)');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new PaymentUI();
    ui.animateLock();
    ui.animatePriceFadeIn();
    
    new PaymentController(ui);
});

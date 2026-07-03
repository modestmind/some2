/**
 * UI Layer
 */
class UILayer {
	constructor() {
		this.bars = document.querySelectorAll('.chart-bar');
		this.chatCard = document.getElementById('chatCard');
		this.capsules = document.querySelectorAll('.capsule-fill');
		this.sCards = document.querySelectorAll('.s-anim');
		this.baBars = document.querySelectorAll('.ba-anim');
		this.futurePath = document.getElementById('futurePath');
		this.chartWarn = document.getElementById('chartWarn');
		this.vcBars = document.querySelectorAll('.vc-anim');
		this.energyBox = document.getElementById('energyBox');
		this.tSec = document.getElementById('t-sec');
		
		this.modal = document.getElementById('infoModal');
		this.modalText = document.getElementById('modalText');
		
		this.btnHamburger = document.getElementById('btnHamburger');
		this.sideMenu = document.getElementById('sideMenu');
		this.menuOverlay = document.getElementById('menuOverlay');
	}

	animatePainPoint() {
		this.bars.forEach(bar => {
			bar.style.width = bar.getAttribute('data-width') + '%';
		});
		this.chatCard.classList.add('visible');
	}

	animateSolution() {
		this.sCards.forEach(card => card.classList.add('visible'));
		this.capsules.forEach(cap => cap.style.height = '100%');
		this.baBars.forEach(bar => bar.style.width = bar.getAttribute('data-width') + '%');
	}

	animatePreview() {
		this.futurePath.style.strokeDashoffset = '0';
		setTimeout(() => { this.chartWarn.style.opacity = '1'; }, 1000);
	}

	animateBenefit() {
		this.vcBars.forEach(bar => bar.style.width = bar.getAttribute('data-width') + '%');
		this.energyBox.classList.add('active');
	}

	updateTimer(sec) {
		this.tSec.innerText = sec < 10 ? '0'+sec : sec;
	}

	openModal(text) {
		this.modalText.innerText = text;
		this.modal.classList.add('active');
	}
	closeModal() {
		this.modal.classList.remove('active');
	}

	toggleMenu(show) {
		if(show) {
			this.sideMenu.classList.add('active');
			this.menuOverlay.classList.add('active');
			document.body.style.overflow = 'hidden';
		} else {
			this.sideMenu.classList.remove('active');
			this.menuOverlay.classList.remove('active');
			document.body.style.overflow = '';
		}
	}
}

/**
 * Controller Layer
 */
class ControllerLayer {
	constructor(uiLayer) {
		this.ui = uiLayer;
		this.seconds = 59;
		this.initObservers();
		this.bindEvents();
		this.startTimer();
	}

	initObservers() {
		// 스크롤 이벤트 옵저버
		const observerOptions = { threshold: 0.3 };
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if(entry.isIntersecting) {
					if(entry.target.id === 'painPointSec') this.ui.animatePainPoint();
					if(entry.target.id === 'solutionSec') this.ui.animateSolution();
					if(entry.target.id === 'previewSec') this.ui.animatePreview();
					if(entry.target.id === 'benefitSec') this.ui.animateBenefit();
					observer.unobserve(entry.target);
				}
			});
		}, observerOptions);

		observer.observe(document.getElementById('painPointSec'));
		observer.observe(document.getElementById('solutionSec'));
		observer.observe(document.getElementById('previewSec'));
		observer.observe(document.getElementById('benefitSec'));
	}

	bindEvents() {
		// 토글 버튼 제어 (시각적 피드백)
		document.querySelectorAll('.toggle-group').forEach(group => {
			const btns = group.querySelectorAll('.tgl-btn');
			btns.forEach(btn => {
				btn.addEventListener('click', (e) => {
					btns.forEach(b => b.classList.remove('active'));
					e.target.classList.add('active');
				});
			});
		});

		// 햄버거 메뉴 제어
		if(this.ui.btnHamburger) {
			this.ui.btnHamburger.addEventListener('click', () => {
				this.ui.toggleMenu(true);
			});
		}
		if(this.ui.menuOverlay) {
			this.ui.menuOverlay.addEventListener('click', () => {
				this.ui.toggleMenu(false);
			});
		}

		// 필터 칩 제어
		const chips = document.querySelectorAll('.chip');
		chips.forEach(chip => {
			chip.addEventListener('click', (e) => {
				chips.forEach(c => c.classList.remove('active'));
				e.target.classList.add('active');
			});
		});

		// 툴팁 클릭 이벤트
		const tooltipBtns = document.querySelectorAll('.tooltip-btn');
		tooltipBtns.forEach(btn => {
			btn.addEventListener('click', (e) => {
				const info = e.target.getAttribute('data-info');
				this.ui.openModal(info);
			});
		});

		document.getElementById('closeModal').addEventListener('click', () => {
			this.ui.closeModal();
		});

		// CTA 클릭 시 스크롤
		const scrollToForm = () => {
			document.querySelector('.cta-section').scrollIntoView({behavior:'smooth'});
		};
		document.getElementById('heroCtaBtn').addEventListener('click', scrollToForm);
		document.getElementById('blurCtaBtn').addEventListener('click', scrollToForm);
		
		document.getElementById('finalCtaBtn').addEventListener('click', () => {
			alert('데이터를 분석 중입니다...');
		});
	}

	startTimer() {
		setInterval(() => {
			this.seconds--;
			if(this.seconds < 0) this.seconds = 59;
			this.ui.updateTimer(this.seconds);
		}, 1000);
	}
}

/**
 * Injector Layer
 */
class AppInjector {
	static init() {
		const ui = new UILayer();
		const controller = new ControllerLayer(ui);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	AppInjector.init();
});
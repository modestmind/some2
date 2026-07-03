class MyInfoController {
    constructor() {
        this.initSelectBoxes();
        this.bindEvents();
    }

    initSelectBoxes() {
        const currentYear = new Date().getFullYear();
        
        // 연도 세팅 (1950 ~ 현재)
        const selYear = document.getElementById('selYear');
        if (selYear) {
            for (let i = currentYear; i >= 1950; i--) {
                const option = document.createElement('option');
                option.value = i;
                option.text = `${i}년`;
                selYear.appendChild(option);
            }
        }

        // 월 세팅
        const selMonth = document.getElementById('selMonth');
        if (selMonth) {
            for (let i = 1; i <= 12; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.text = `${i}월`;
                selMonth.appendChild(option);
            }
        }

        // 일 세팅
        const selDay = document.getElementById('selDay');
        if (selDay) {
            for (let i = 1; i <= 31; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.text = `${i}일`;
                selDay.appendChild(option);
            }
        }

        // 시간 세팅
        const selHour = document.getElementById('selHour');
        if (selHour) {
            for (let i = 0; i <= 23; i++) {
                const option = document.createElement('option');
                const hourStr = String(i).padStart(2, '0');
                option.value = i;
                option.text = `${hourStr}시`;
                selHour.appendChild(option);
            }
        }

        // 분 세팅 (1분 단위)
        const selMinute = document.getElementById('selMinute');
        if (selMinute) {
            for (let i = 0; i <= 59; i++) {
                const option = document.createElement('option');
                const minStr = String(i).padStart(2, '0');
                option.value = i;
                option.text = `${minStr}분`;
                selMinute.appendChild(option);
            }
        }
    }

    bindEvents() {
        // 태어난 시간 모름 체크박스 토글
        const chkUnknownTime = document.getElementById('chkUnknownTime');
        const selHour = document.getElementById('selHour');
        const selMinute = document.getElementById('selMinute');

        if (chkUnknownTime) {
            chkUnknownTime.addEventListener('change', (e) => {
                const isUnknown = e.target.checked;
                if (selHour) selHour.disabled = isUnknown;
                if (selMinute) selMinute.disabled = isUnknown;
                
                if (isUnknown) {
                    selHour.value = "";
                    selMinute.value = "";
                }
            });
        }

        // 저장 버튼
        const btnSaveInfo = document.getElementById('btnSaveInfo');
        if (btnSaveInfo) {
            btnSaveInfo.addEventListener('click', () => {
                // 유효성 검사 (간단하게 이름만)
                const name = document.getElementById('inputName').value;
                if(!name) {
                    alert('이름을 입력해주세요.');
                    return;
                }
                
                // 추후 서버로 데이터 전송 로직 추가 가능
                alert('내 정보가 성공적으로 저장되었습니다.');
                
                // 뒤로가기
                history.back();
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MyInfoController();
});

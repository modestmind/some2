# 시스템 디자인 가이드라인 (Design System Specification)

본 문서는 프로젝트의 시각적 일관성을 유지하기 위한 디자인 가이드입니다. AI는 프론트엔드 UI(HTML/CSS) 및 컴포넌트를 생성할 때 반드시 이 문서에 정의된 컬러 토큰과 폰트 시스템을 준수해야 합니다.

---

## 1. 글로벌 컬러 토큰 (Color Tokens)
모든 스타일시트(CSS) 작성 시 하드코딩을 지양하고, 아래 정의된 브랜드 컬러 체계를 최우선으로 반영합니다.

### 1) 시스템 핵심 컬러 (Brand Colors)
- **Primary (주요 강조색)**: #F2889B (베리 밀크 핑크) - 메인 버튼, 핵심 링크, 활성화 상태 등에 사용
- **Secondary (보조 컬러)**: #FFB382 (소프트 오렌지 계열) - 서브 가이드, 뱃지 등에 사용
- **엑센트**: #FFE14D - (강조, 행운, 전구, 별빛을 상징할 때 사용.)


---

## 2. 타이포그래피 및 폰트 시스템 (Typography)

### 1) 기본 폰트 패밀리 (Font Family)
- **기본 설정**: `Pretendard, Roboto, Helvetica, Arial, sans-serif;`
- **웹 폰트 임포트 주소**: `@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css");`


---

## 3. AI 개발 구현 지침 (Developer AI Instruction)

1. 프론트엔드 빌드 시작 시, 최상위 CSS 파일(예: `common.css`)에 위의 컬러와 폰트를 **CSS Custom Properties(변수)로 전역 선언(`:root`)한** 뒤 적용하십시오.
2. 홈페이지를 모바일용으로 만들려고해. 모바일에 최적화된 구조로 설계하고 디자인 해줘.
    가로 사이즈는 360px부터 480px까지 자동으로 조절되는 반응형으로 해줘.
    480px보다 큰 화면에서는 480px 사이즈로 화면 중앙에 노출될 수 있도록 해줘.
    480px보다 큰 나머지 빈 배경이 허전하지 않도록 메인 컬러와 잘 어울리는 아주 연한 색상으로 배경 효과를 추가해줘.
import { useState, useEffect } from "react";
import classnames from "classnames/bind";
import styles from "./report-screen.module.css";
import ReportSectionComponent from "../components/report-section-component";
import type { StateType } from "../store/store";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import MainHeaderComponent from "../components/main-header-component";
import SideMenuComponent from "../components/side-menu-component";

const cx = classnames.bind(styles);

type SectionColor = {
  mainColor: string;
  mainColorRgb: string;
  bgColor: string;
};

const SECTION_COLORS: SectionColor[] = [
  { mainColor: "#FF8A8A", mainColorRgb: "255, 138, 138", bgColor: "#FFF5F5" },
  { mainColor: "#FFA970", mainColorRgb: "255, 169, 112", bgColor: "#FFF8F0" },
  { mainColor: "#F2C94C", mainColorRgb: "242, 201, 76",  bgColor: "#FFFFF0" },
  { mainColor: "#6FCF97", mainColorRgb: "111, 207, 151", bgColor: "#F0FFF4" },
  { mainColor: "#56CCF2", mainColorRgb: "86, 204, 242",  bgColor: "#F0F8FF" },
  { mainColor: "#7B61FF", mainColorRgb: "123, 97, 255",  bgColor: "#F4F0FF" },
  { mainColor: "#BB6BD9", mainColorRgb: "187, 107, 217", bgColor: "#FAF0FF" },
  { mainColor: "#A0AEC0", mainColorRgb: "160, 174, 192", bgColor: "#F8F9FA" },
];

const ReportScreen = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = useSelector((state: StateType) => state.auth.token);

  if (token === null) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const [expandedSections, setExpandedSections] = useState<boolean[]>(
    Array(8).fill(true),
  );

  const isAllExpanded = expandedSections.every(Boolean);

  const handleToggle = (index: number) => {
    setExpandedSections((prev) => {
      const isCurrentlyExpanded = prev[index];
      if (isCurrentlyExpanded) {
        return prev.map((v, i) => (i === index ? false : v));
      }
      return prev.map((_, i) => i === index);
    });
  };

  const handleToggleAll = () => {
    setExpandedSections(Array(8).fill(!isAllExpanded));
  };

  const sectionProps = (index: number) => ({
    ...SECTION_COLORS[index],
    isExpanded: expandedSections[index],
    onToggle: () => handleToggle(index),
  });

  return (
    <div className={styles.page}>
      <MainHeaderComponent
        onLoginClick={() => navigate("/login")}
        onMenuOpen={() => setIsMenuOpen(true)}
      />
      <SideMenuComponent
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <div className={styles.appContainer}>

        {/* ── 1페이지. 표지 ── */}
        <ReportSectionComponent
          {...sectionProps(0)}
          bannerSrc="https://dbco.kr/aa/images/01/sec1/3.png"
          bannerAlt="썸 손절 판별 리포트 표지"
          bannerHeight={280}
          isFirst
          onExpandAll={handleToggleAll}
          isAllExpanded={isAllExpanded}
        >
          <h1>썸 손절 판별 리포트</h1>
          <div className={cx("quote")}>
            "호감은 분명하지만 속도가 다른 두 사람의 관계 흐름"
          </div>

          <div className={styles.coverInfo}>
            <div className={styles.coverInfoRow}>
              <span className={styles.coverInfoLabel}>의뢰인</span>
              <span className={styles.coverInfoValue}>김서연 님</span>
            </div>
            <div className={styles.coverInfoRow}>
              <span className={styles.coverInfoLabel}>상대방</span>
              <span className={styles.coverInfoValue}>이준호 님</span>
            </div>
            <div className={styles.coverInfoRow}>
              <span className={styles.coverInfoLabel}>관계</span>
              <span className={styles.coverInfoValue}>썸</span>
            </div>
            <div className={styles.coverInfoRow}>
              <span className={styles.coverInfoLabel}>기간</span>
              <span className={styles.coverInfoValue}>약 2개월</span>
            </div>
            <hr className={styles.divider} style={{ margin: "12px 0" }} />
            <div className={styles.coverInfoRow}>
              <span className={styles.coverInfoLabel}>작성일</span>
              <span className={styles.coverInfoValue}>2026년 5월 29일</span>
            </div>
          </div>

          <p>
            김서연 님과 이준호 님의 현재 관계를 살펴보면, 서로에 대한 관심과
            호감은 이미 충분히 형성된 상태로 보입니다. 연락이 매일 이어지고
            있고 정기적으로 만나고 있다는 점은 단순한 호감 단계를 넘어{" "}
            <span className={styles.highlight}>
              서로의 일상 안으로 자연스럽게 들어가고 있는 흐름
            </span>
            입니다. 다만 아직 관계를 명확하게 정의하는 대화가 나오지 않았다는
            점이 현재 두 사람의 가장 중요한 특징입니다.
          </p>
          <p>
            서연 님은 감정이 생기면 상대를 깊게 관찰하면서도{" "}
            <span className={styles.highlight}>
              쉽게 자신의 속마음을 모두 드러내지 않는 성향
            </span>
            이 강합니다. 반면 준호 님은 관계를 시작할 때 신중하게 상대를
            검증하는 경향이 있으며{" "}
            <span className={styles.highlight}>
              확신이 생긴 뒤에야 행동으로 옮기는 스타일
            </span>
            이 나타납니다. 따라서 두 사람 모두 관심은 있지만 먼저 결정적인 말을
            꺼내지 않는 구조가 형성되기 쉽습니다.
          </p>
          <p>
            궁합 자체는 나쁘지 않습니다. 서로 부족한 부분을 보완해 줄 수 있는
            요소가 존재하며{" "}
            <span className={styles.highlight}>
              함께 있을 때 편안함과 안정감
            </span>
            을 느끼는 흐름도 확인됩니다. 특히 처음에는 가볍게 시작되더라도
            시간이 흐를수록 정서적 유대감이 강해질 수 있는 특징이 있습니다.
          </p>
          <p>
            다만 현재 운의 흐름에서는 감정보다{" "}
            <span className={styles.highlight}>
              현실적인 판단이 강하게 작용하는 시기
            </span>
            입니다. 그래서 한쪽은 관계 진전을 원하고 있는데 다른 한쪽은 아직
            상황을 더 지켜보려는 모습이 나타날 수 있습니다. 이런 속도 차이가
            반복되면 답답함이 커질 수 있으므로 앞으로 몇 개월 동안의 관계 운영
            방식이 매우 중요합니다.
          </p>
          <p>
            이번 리포트에서는 두 사람의 기본 성향, 연애 스타일, 앞으로 예상되는
            관계 리스크, 그리고 실제로 연인이 되었을 경우 어떤 흐름으로 전개될
            가능성이 높은지 종합적으로 분석해 드리겠습니다.
          </p>
        </ReportSectionComponent>

        {/* ── 2페이지. 나의 연애운 ── */}
        <ReportSectionComponent
          {...sectionProps(1)}
          bannerSrc="https://dbco.kr/aa/images/01/sec2/7.png"
          bannerAlt="나는 어떤 사람인가? (김서연 님 연애운)"
        >
          <h2>나는 어떤 사람인가? (김서연 님 연애운)</h2>
          <p>
            서연 님은 기본적으로 매우 영리하고 상황 판단이 빠른 사람입니다.
            사람을 만날 때도 단순히 설렘만으로 접근하기보다{" "}
            <span className={styles.highlight}>
              상대의 말과 행동을 꾸준히 관찰하며 신뢰 여부를 확인
            </span>
            하는 특징이 있습니다.
          </p>
          <p>
            겉으로는 밝고 사교적으로 보일 수 있지만 실제 내면은 생각이 깊고
            예민한 편입니다. 그래서 인간관계에서 상처를 받으면 오래 기억하는
            경향이 있습니다. 특히 연애에서는{" "}
            <span className={styles.highlight}>
              감정이 깊어질수록 상대를 더 중요하게 여기기 때문에
            </span>{" "}
            쉽게 시작하지 않는 모습이 나타납니다.
          </p>
          <p>
            서연 님의 가장 큰 장점은 배려심입니다. 좋아하는 사람이 생기면
            상대의 기분과 상황을 먼저 고려하려고 하며 상대가 힘들 때 큰 힘이
            되어주는 스타일입니다. 반대로 자신의 감정은 뒤로 미루는 경우가
            많아 마음속 부담이 쌓이는 경우도 있습니다.
          </p>
          <p>
            연애에서는 친구 같은 편안함과 연인으로서의 설렘을 동시에
            추구합니다. 외적인 조건만 보는 스타일이 아니라{" "}
            <span className={styles.highlight}>
              대화가 잘 통하고 가치관이 맞는 사람
            </span>
            에게 더 크게 끌립니다.
          </p>
          <p>
            현재 운의 흐름은 새로운 인연을 받아들이는 기운이 비교적 강하게
            들어와 있습니다. 다만 상대를 너무 오래 관찰하려 하거나{" "}
            <span className={styles.highlight}>
              확신을 얻기 전까지 감정을 표현하지 않으면
            </span>{" "}
            기회를 놓칠 수도 있는 시기입니다.
          </p>
          <p>
            2026년 전후의 흐름은 인간관계 변화가 활발하게 나타나는 시기로
            보입니다. 좋은 사람을 만날 가능성도 있지만 관계를 지나치게
            분석하려는 경향이 강해질 수 있으므로{" "}
            <span className={styles.highlight}>
              감정과 이성을 균형 있게 사용하는 것
            </span>
            이 중요합니다.
          </p>
          <p>
            종합적으로 보면 서연 님은 한 번 마음을 열면 오래 가는 연애를
            선호하는 사람이며 가벼운 만남보다는{" "}
            <span className={styles.highlight}>
              진지한 관계에 더 적합한 성향
            </span>
            입니다.
          </p>
        </ReportSectionComponent>

        {/* ── 3페이지. 상대방 연애운 ── */}
        <ReportSectionComponent
          {...sectionProps(2)}
          bannerSrc="https://dbco.kr/aa/images/01/sec3/2.png"
          bannerAlt="상대방은 어떤 사람인가? (이준호 님 연애운)"
        >
          <h2>상대방은 어떤 사람인가? (이준호 님 연애운)</h2>
          <p>
            준호 님은{" "}
            <span className={styles.highlight}>
              안정성과 책임감을 중요하게 생각하는 사람
            </span>
            입니다. 새로운 사람을 만날 때도 충동적으로 행동하기보다는 충분한
            시간을 두고 상대를 알아가는 스타일입니다.
          </p>
          <p>
            처음에는 감정 표현이 많지 않아 무뚝뚝하게 보일 수 있지만 실제로는
            정이 깊은 편입니다. 자신이 믿는 사람에게는 꾸준하게 잘해주며{" "}
            <span className={styles.highlight}>
              관계를 오래 유지하려는 성향
            </span>
            도 강합니다.
          </p>
          <p>
            준호 님의 가장 큰 특징은 현실 감각입니다. 연애를 할 때도 단순히
            좋아하는 감정보다는 앞으로 잘 맞을 사람인지,{" "}
            <span className={styles.highlight}>
              서로에게 도움이 되는 관계인지
            </span>{" "}
            등을 생각하는 경향이 있습니다.
          </p>
          <p>
            그래서 썸 단계가 비교적 길어질 수 있습니다. 마음이 없어서가 아니라{" "}
            <span className={styles.highlight}>
              확신을 얻기 위한 과정이 필요한 사람
            </span>
            입니다.
          </p>
          <p>
            연애에서는 자신을 이해해주고 감정 기복이 심하지 않은 사람에게
            안정감을 느낍니다. 반대로 지나친 압박이나 빠른 결정을 요구받으면
            오히려 뒤로 물러서는 모습이 나타날 수 있습니다.
          </p>
          <p>
            현재 운의 흐름은 인간관계에서 선택과 판단이 중요한 시기로
            보입니다. 새로운 인연 자체는 들어와 있지만{" "}
            <span className={styles.highlight}>
              관계를 결정하기까지 시간이 필요한 흐름
            </span>
            입니다.
          </p>
          <p>
            준호 님은 상대에게 관심이 생기면 연락이나 만남을 꾸준히 이어가는
            방식으로 표현하는 편인데 현재 서연 님과의 관계에서도 이러한 모습이
            나타나고 있습니다.
          </p>
          <p>
            종합하면 준호 님은 가볍게 사람을 만나는 타입이 아니며{" "}
            <span className={styles.highlight}>
              신뢰가 쌓이면 오히려 오래 가는 관계
            </span>
            를 만들어가는 성향이 강한 사람으로 해석됩니다.
          </p>
        </ReportSectionComponent>

        {/* ── 4페이지. 연애 리스크 분석 ── */}
        <ReportSectionComponent
          {...sectionProps(3)}
          bannerSrc="https://dbco.kr/aa/images/01/sec4/8.png"
          bannerAlt="우리에게 생길 수 있는 문제? (연애 리스크 분석)"
        >
          <h2>우리에게 생길 수 있는 문제? (연애 리스크 분석)</h2>
          <p>
            두 사람은 서로에게 안정감과 호감을 느끼기 쉬운 조합입니다. 특히
            서연 님은 준호 님의 성실함에 끌리고, 준호 님은 서연 님의 센스와
            배려심에 호감을 느끼는 흐름이 나타납니다.
          </p>

          <h3>첫 번째 리스크 : 관계 진전 속도의 차이</h3>
          <p>
            서연 님은 어느 정도 확신이 생기면{" "}
            <span className={styles.highlight}>
              관계를 명확하게 하고 싶어하는 경향
            </span>
            이 있습니다. 반면 준호 님은 충분한 검토 후 움직이는 타입입니다.
          </p>
          <p>
            따라서 앞으로 2~4개월 사이에 "우리 관계가 뭐지?"라는 고민이 커질
            수 있습니다. 이 시기에 대화가 부족하면 서연 님은 답답함을 느끼고
            준호 님은 부담을 느끼는 구조가 형성될 수 있습니다.
          </p>

          <h3>두 번째 리스크 : 감정 표현 방식의 차이</h3>
          <p>
            서연 님은{" "}
            <span className={styles.highlight}>
              상대의 표현을 통해 사랑을 확인
            </span>
            하려는 편입니다. 반면 준호 님은{" "}
            <span className={styles.highlight}>행동으로 보여주는 것</span>을 더
            중요하게 생각합니다.
          </p>
          <p>
            그래서 준호 님은 충분히 잘하고 있다고 생각하는데 서연 님은 확신을
            얻지 못하는 상황이 발생할 수 있습니다.
          </p>

          <h3>세 번째 리스크 : 지나친 눈치 보기</h3>
          <p>
            현재 두 사람 모두 상대의 마음을 어느 정도 의식하고 있습니다. 하지만{" "}
            <span className={styles.highlight}>
              먼저 표현했다가 거절당할 가능성
            </span>
            을 걱정하는 모습도 보입니다.
          </p>
          <p>
            이런 상태가 길어지면 실제 감정보다 관계가 느리게 발전할 수
            있습니다.
          </p>

          <p>
            다행히 두 사람은 근본적인 성향 충돌이 큰 편은 아닙니다. 문제의
            대부분이 가치관 차이보다는{" "}
            <span className={styles.highlight}>
              표현 방식과 관계 속도 차이
            </span>
            에서 발생하는 흐름입니다.
          </p>
        </ReportSectionComponent>

        {/* ── 5페이지. 가상 연애 소설 ── */}
        <ReportSectionComponent
          {...sectionProps(4)}
          bannerSrc="https://dbco.kr/aa/images/01/sec5/1.png"
          bannerAlt="우리의 미래는 어떨까? (가상 연애 소설)"
        >
          <h2>우리의 미래는 어떨까? (가상 연애 소설)</h2>
          <p>어느 금요일 저녁이었다.</p>
          <p>서연 님은 평소처럼 준호 님에게서 온 메시지를 확인했다.</p>

          <div className={cx("quote", "quoteSmall")}>
            "오늘 하루 어땠어?"
          </div>

          <p>
            특별한 말은 아니었지만 이상하게 하루를 마무리하는 가장 익숙한
            인사가 되어 있었다.
          </p>
          <p>
            처음 만났을 때만 해도 두 사람은 서로를 조심스럽게 바라봤다. 하지만
            시간이 흐르면서 연락은 자연스러워졌고 일상 이야기를 나누는 것이
            당연해졌다.
          </p>
          <p>그러던 어느 날 서연 님은 문득 생각했다.</p>

          <div className={styles.dialogue}>
            <p>'이 사람도 나를 좋아하는 걸까?'</p>
          </div>

          <p>분명 관심은 느껴졌다. 하지만 확신은 없었다.</p>
          <p>준호 님 역시 비슷했다.</p>

          <div className={styles.dialogue}>
            <p>'좋은 사람인 건 맞는데 조금만 더 알아보고 싶다.'</p>
          </div>

          <p>
            그렇게 두 사람은 서로를 향해 한 걸음씩 다가가면서도 마지막 한
            걸음은 남겨두고 있었다.
          </p>
          <p>몇 주 후 함께 카페에 앉아 있던 날.</p>
          <p>평소보다 긴 대화가 이어졌다.</p>
          <p>
            서연 님은 자신의 고민을 이야기했고 준호 님은 진지하게 들어주었다.
          </p>
          <p>
            그 순간 서연 님은{" "}
            <span className={styles.highlight}>설렘보다 편안함</span>을
            느꼈다.
          </p>
          <p>그리고 준호 님 역시 생각했다.</p>

          <div className={styles.dialogue}>
            <p>'이 사람과는 오래 이야기할 수 있겠다.'</p>
          </div>

          <p>관계는 급격하게 발전하지 않았다.</p>
          <p>하지만 천천히 깊어졌다.</p>
          <p>어느 날 준호 님이 먼저 말했다.</p>

          <div className={styles.dialogue}>
            <p className={styles.dialogueSpeaker}>준호 님</p>
            <p>"우리 이제 조금 더 진지하게 만나볼래?"</p>
          </div>

          <p>서연 님은 웃으며 고개를 끄덕였다.</p>
          <p>
            그 순간은 화려하지 않았지만 오히려 그래서{" "}
            <span className={styles.highlight}>더 진심이 담겨 있었다.</span>
          </p>

          <hr className={styles.divider} />

          <h3>심리 해석</h3>
          <p>
            두 사람의 흐름은 불꽃처럼 빠르게 타오르는 형태보다{" "}
            <span className={styles.highlight}>
              잔잔하게 깊어지는 형태
            </span>
            에 가깝습니다.
          </p>
          <p>
            현재의 썸은 불확실성이 아니라{" "}
            <span className={styles.highlight}>신뢰를 쌓아가는 과정</span>에
            가깝게 보입니다.
          </p>
          <p>
            따라서 성급한 결론보다{" "}
            <span className={styles.highlight}>
              서로의 속도를 존중하는 태도
            </span>
            가 관계 발전의 핵심 열쇠가 될 가능성이 높습니다.
          </p>
        </ReportSectionComponent>

        {/* ── 6페이지. 최종 결론 ── */}
        <ReportSectionComponent
          {...sectionProps(5)}
          bannerSrc="https://dbco.kr/aa/images/01/sec6/6.png"
          bannerAlt="썸 손절 판별 (최종 결론)"
        >
          <h2>썸 손절 판별 (최종 결론)</h2>

          <div className={styles.scoreBox}>
            <p className={styles.scoreBoxTitle}>궁합 점수</p>
            <div className={styles.score}>
              78점{" "}
              <span className={styles.scoreSuffix}>/ 100점</span>
            </div>
            <hr className={styles.divider} style={{ margin: "16px 0" }} />
            <p className={styles.decisionLabel}>최종 판정</p>
            <div className={styles.decision}>HOLD</div>
          </div>

          <p>이 점수는 궁합이 나쁘다는 의미가 아닙니다.</p>
          <p>
            오히려{" "}
            <span className={styles.highlight}>연인으로 발전할 가능성</span>은
            충분하지만 현재 시점에서는 아직 최종 판단을 내리기 이른 상태라는
            의미입니다.
          </p>
          <p>
            두 사람은 서로에게 안정감을 줄 수 있는 요소가 많습니다. 연락
            빈도와 만남 빈도를 보더라도 관심 없는 관계에서는 나오기 어려운
            흐름입니다.
          </p>
          <p>
            다만 현재 가장 큰 변수는 감정의 크기가 아니라{" "}
            <span className={styles.highlight}>관계를 발전시키는 속도</span>
            입니다.
          </p>
          <p>
            서연 님은 어느 정도 마음이 정해지면 방향성을 확인하고
            싶어합니다.
          </p>
          <p>
            반면 준호 님은 확신이 생길 때까지 시간을 두는 성향이 강합니다.
          </p>
          <p>
            따라서 지금 당장 GO라고 말하기에는 아직 검증 과정이 남아
            있습니다.
          </p>
          <p>
            그렇다고 CUT을 선택할 정도의 위험 신호도 보이지 않습니다.
          </p>
          <p>
            오히려 지금 관계는{" "}
            <span className={styles.highlight}>
              "조금 더 지켜볼 가치가 충분한 관계"
            </span>
            에 가깝습니다.
          </p>
          <p>
            심리적으로도 서연 님은 상대의 마음을 확인받고 싶어하는 상태로
            보입니다.
          </p>
          <p>
            하지만 현재 가장 필요한 것은 상대의 감정을 추측하는 것이 아니라{" "}
            <span className={styles.highlight}>
              실제 행동의 일관성을 확인
            </span>
            하는 것입니다.
          </p>
          <p>
            연락이 꾸준한지, 만남을 계속 이어가려 하는지, 미래 이야기를
            자연스럽게 꺼내는지 등을 살펴보신다면 더 명확한 답을 얻을 수
            있습니다.
          </p>
          <p>
            현재 결론은{" "}
            <span className={styles.highlight}>손절이 아니라 관찰</span>
            입니다.
          </p>
        </ReportSectionComponent>

        {/* ── 7페이지. 행동 가이드 ── */}
        <ReportSectionComponent
          {...sectionProps(6)}
          bannerSrc="https://dbco.kr/aa/images/01/sec7/9.png"
          bannerAlt="김서연 님을 위한 행동 가이드"
        >
          <h2>김서연 님을 위한 행동 가이드</h2>

          <div className={styles.actionItem}>
            <h3 className={styles.actionItemTitle}>
              <span className={styles.actionItemCheck}>✓</span>
              <span>상대의 말보다 행동의 지속성을 확인하세요.</span>
            </h3>
            <p>
              지금 단계에서는 "좋아해"라는 말보다{" "}
              <span className={styles.highlight}>실제 행동</span>이 중요합니다.
              준호 님은 원래 행동으로 표현하는 비중이 높은 사람입니다. 매일
              연락을 이어가는지, 바쁜 상황에서도 시간을 만들려고 하는지, 다음
              만남을 스스로 제안하는지를 확인해 보세요. 이런 행동이 2~3개월
              이상 꾸준히 이어진다면 진정성 있는 관계로 발전할 가능성이
              높습니다.
            </p>
          </div>

          <div className={styles.actionItem}>
            <h3 className={styles.actionItemTitle}>
              <span className={styles.actionItemCheck}>✓</span>
              <span>관계 정의를 서두르기보다 대화의 깊이를 늘리세요.</span>
            </h3>
            <p>
              지금 당장 고백이나 확답을 요구하기보다는 가치관, 미래 계획,
              연애관 같은 주제로 대화를 넓혀 보세요.{" "}
              <span className={styles.highlight}>
                서로를 이해하는 과정이 충분히 쌓이면
              </span>{" "}
              준호 님도 훨씬 자연스럽게 관계를 결정하게 됩니다.
            </p>
          </div>

          <div className={styles.actionItem}>
            <h3 className={styles.actionItemTitle}>
              <span className={styles.actionItemCheck}>✓</span>
              <span>감정을 숨기지만 말고 작은 표현은 해주세요.</span>
            </h3>
            <p>
              준호 님은 상대가 자신에게 호감이 있는지 확인하고 싶어하는 성향도
              있습니다. "오늘 만나서 좋았어", "같이 있으면 편해" 같은 표현은
              부담 없이 전달해 보세요.{" "}
              <span className={styles.highlight}>
                관계 발전 속도가 눈에 띄게 빨라질 수
              </span>{" "}
              있습니다.
            </p>
          </div>

          <div className={styles.actionItem}>
            <h3 className={styles.actionItemTitle}>
              <span className={styles.actionItemCheck}>✓</span>
              <span>3개월 후에도 같은 자리라면 점검이 필요합니다.</span>
            </h3>
            <p>
              현재는 HOLD가 맞지만 시간이 충분히 지났는데도 관계가 계속
              제자리라면 그때는 진지한 대화가 필요합니다. 관계는{" "}
              <span className={styles.highlight}>
                기다림 자체보다 방향성이 중요
              </span>
              하기 때문입니다.
            </p>
          </div>
        </ReportSectionComponent>

        {/* ── 8페이지. 마지막 안내 말씀 ── */}
        <ReportSectionComponent
          {...sectionProps(7)}
          bannerSrc="https://dbco.kr/aa/images/01/sec8/4.png"
          bannerAlt="마지막 안내 말씀"
        >
          <h2>마지막 안내 말씀</h2>
          <p>
            사주는 정해진 운명을 단정하는 도구가 아닙니다. 사람 안에 반복적으로
            나타나는 감정의 패턴과 관계의 흐름을 이해하는{" "}
            <span className={styles.highlight}>지도에 가깝습니다.</span> 같은
            성향을 가진 사람이라도 어떤 환경을 만나고 어떤 선택을 하느냐에 따라
            전혀 다른 삶을 살아가게 됩니다.
          </p>
          <p>
            이번 리포트는 단순히 두 사람의 타고난 기질만 해석한 것이 아닙니다.
            현재 썸의 상태, 연락 패턴, 만남의 흐름까지 함께 고려하여 실제
            관계에서{" "}
            <span className={styles.highlight}>
              왜 끌리고 왜 고민이 생기는지
            </span>
            를 중심으로 분석한 내용입니다.
          </p>
          <p>
            사주는 미래를 맞히기 위한 예언서가 아니라 지금의 관계를 더 깊이
            이해하기 위한 참고 자료입니다. 관계 속에서 반복되는 감정과 행동을
            이해할 때 더 좋은 선택을 할 수 있으며, 그것이 사주가 가진 가장 큰
            의미입니다.
          </p>
          <p>
            김서연 님의 현재 흐름은 "포기해야 할 관계"보다{" "}
            <span className={styles.highlight}>
              "조금 더 확인해 볼 가치가 있는 관계"
            </span>
            에 가깝습니다. 너무 조급해하지 마시고, 상대의 진심을 행동으로
            확인해 보시기 바랍니다. 좋은 인연은 빠르게 결정되는 경우보다
            서로를 이해하는 시간을 거치며 더 단단하게 만들어지는 경우가
            많습니다. 응원하겠습니다. 🌷
          </p>
        </ReportSectionComponent>

        <footer className={styles.footer}>
          © 2026 연애판별소. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default ReportScreen;

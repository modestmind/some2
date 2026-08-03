import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import styles from "./report-screen.module.css";
import ReportSectionComponent from "../components/report-section-component";
import MainHeaderComponent from "../components/main-header-component";
import SideMenuComponent from "../components/side-menu-component";
import { useGetReport } from "../hooks/use-get-report";
import { toastActions } from "../shared/store/toast-slice";
import type { StateType } from "../shared/store/store";

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

const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
};

const renderHtml = (text: string | null | undefined) =>
  text ? <div dangerouslySetInnerHTML={{ __html: text }} /> : null;

const ReportScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get("reportId") ?? "";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = useSelector((state: StateType) => state.auth.token);

  const { data, isLoading, isError } = useGetReport(reportId);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isError) {
      dispatch(toastActions.show({ message: "리포트를 불러오는 데 실패했습니다.", code: 500 }));
      navigate("/", { replace: true });
    }
  }, [isError]);

  const [expandedSections, setExpandedSections] = useState<boolean[]>(Array(8).fill(true));
  const isAllExpanded = expandedSections.every(Boolean);

  if (token === null) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const handleToggle = (index: number) => {
    setExpandedSections((prev) => {
      const isCurrentlyExpanded = prev[index];
      if (isCurrentlyExpanded) return prev.map((v, i) => (i === index ? false : v));
      return prev.map((_, i) => i === index);
    });
  };

  const handleToggleAll = () => setExpandedSections(Array(8).fill(!isAllExpanded));

  const sectionProps = (index: number) => ({
    ...SECTION_COLORS[index],
    isExpanded: expandedSections[index],
    onToggle: () => handleToggle(index),
  });

  const report = data?.report;

  return (
    <div className={styles.page}>
      <MainHeaderComponent
        onLoginClick={() => navigate("/login")}
        onMenuOpen={() => setIsMenuOpen(true)}
      />
      <SideMenuComponent isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className={styles.appContainer}>

        {/* ── 1페이지. 표지 ── */}
        <ReportSectionComponent
          {...sectionProps(0)}
          bannerSrc="https://dbco.kr/aa/images/01/sec1/3.png"
          bannerAlt="썸 손절 판별 리포트"
          bannerHeight={280}
          isFirst
          onExpandAll={handleToggleAll}
          isAllExpanded={isAllExpanded}
        >
          <h1>썸 손절 판별 리포트</h1>
          {isLoading ? (
            <p>불러오는 중...</p>
          ) : (
            <>
              <div className={styles.coverInfo}>
                <div className={styles.coverInfoRow}>
                  <span className={styles.coverInfoLabel}>의뢰인</span>
                  <span className={styles.coverInfoValue}>{report?.client_name} 님</span>
                </div>
                <div className={styles.coverInfoRow}>
                  <span className={styles.coverInfoLabel}>상대방</span>
                  <span className={styles.coverInfoValue}>{report?.partner_name} 님</span>
                </div>
                <div className={styles.coverInfoRow}>
                  <span className={styles.coverInfoLabel}>관계</span>
                  <span className={styles.coverInfoValue}>{report?.partner_relationship_type}</span>
                </div>
                <hr className={styles.divider} style={{ margin: "12px 0" }} />
                <div className={styles.coverInfoRow}>
                  <span className={styles.coverInfoLabel}>작성일</span>
                  <span className={styles.coverInfoValue}>{formatDate(report?.created_at)}</span>
                </div>
              </div>
              {renderHtml(report?.report_section1)}
            </>
          )}
        </ReportSectionComponent>

        {/* ── 2페이지. 나의 연애운 ── */}
        <ReportSectionComponent
          {...sectionProps(1)}
          bannerSrc="https://dbco.kr/aa/images/01/sec2/7.png"
          bannerAlt="나는 어떤 사람인가? (나의 연애운)"
        >
          <h3>나는 어떤 사람인가? (나의 연애운)</h3>
          {isLoading ? <p>불러오는 중...</p> : renderHtml(report?.report_section2)}
        </ReportSectionComponent>

        {/* ── 3페이지. 상대방 연애운 ── */}
        <ReportSectionComponent
          {...sectionProps(2)}
          bannerSrc="https://dbco.kr/aa/images/01/sec3/2.png"
          bannerAlt="상대방은 어떤 사람인가? (상대방 연애운)"
        >
          <h3>상대방은 어떤 사람인가? (상대방 연애운)</h3>
          {isLoading ? <p>불러오는 중...</p> : renderHtml(report?.report_section3)}
        </ReportSectionComponent>

        {/* ── 4페이지. 연애 리스크 분석 ── */}
        <ReportSectionComponent
          {...sectionProps(3)}
          bannerSrc="https://dbco.kr/aa/images/01/sec4/8.png"
          bannerAlt="우리에게 생길 수 있는 문제? (연애 리스크 분석)"
        >
          <h3>우리에게 생길 수 있는 문제? (연애 리스크 분석)</h3>
          {isLoading ? <p>불러오는 중...</p> : renderHtml(report?.report_section4)}
        </ReportSectionComponent>

        {/* ── 5페이지. 가상 연애 소설 ── */}
        <ReportSectionComponent
          {...sectionProps(4)}
          bannerSrc="https://dbco.kr/aa/images/01/sec5/1.png"
          bannerAlt="우리의 미래는 어떨까? (가상 연애 소설)"
        >
          <h3>우리의 미래는 어떨까? (가상 연애 소설)</h3>
          {isLoading ? <p>불러오는 중...</p> : renderHtml(report?.report_section5)}
        </ReportSectionComponent>

        {/* ── 6페이지. 최종 결론 ── */}
        <ReportSectionComponent
          {...sectionProps(5)}
          bannerSrc="https://dbco.kr/aa/images/01/sec6/6.png"
          bannerAlt="썸 손절 판별 (최종 결론)"
        >
          <h3>썸 손절 판별 (최종 결론)</h3>
          {isLoading ? <p>불러오는 중...</p> : renderHtml(report?.report_section6)}
        </ReportSectionComponent>

        {/* ── 7페이지. 행동 가이드 ── */}
        <ReportSectionComponent
          {...sectionProps(6)}
          bannerSrc="https://dbco.kr/aa/images/01/sec7/9.png"
          bannerAlt="행동 가이드"
        >
          <h3>행동 가이드</h3>
          {isLoading ? <p>불러오는 중...</p> : renderHtml(report?.report_section7)}
        </ReportSectionComponent>

        {/* ── 8페이지. 마지막 안내 말씀 ── */}
        <ReportSectionComponent
          {...sectionProps(7)}
          bannerSrc="https://dbco.kr/aa/images/01/sec8/4.png"
          bannerAlt="마지막 안내 말씀"
        >
          <h3>마지막 안내 말씀</h3>
          {isLoading ? <p>불러오는 중...</p> : renderHtml(report?.report_section8)}
        </ReportSectionComponent>

        <footer className={styles.footer}>
          © 2026 연애판별소. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default ReportScreen;

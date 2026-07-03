import styles from "./preview-section-component.module.css";
import useIntersectionObserver from "../hooks/use-intersection-observer";

type PreviewSectionComponentProps = {
  onTagClick: (info: string) => void;
  onCtaClick: () => void;
};

const tags = [
  { label: "#회피형사주", info: "책임지는 관계를 피하려는 기운이 강합니다." },
  { label: "#겉촉속바삭", info: "겉으로는 무뚝뚝하지만 속은 여린 성향입니다." },
  { label: "#어장주의", info: "여러 명에게 여지를 두는 도화살이 강합니다." },
];

const PreviewSectionComponent = (props: PreviewSectionComponentProps) => {
  const { onTagClick, onCtaClick } = props;
  const { ref, isVisible } = useIntersectionObserver(0.3);

  return (
    <section
      id="previewSec"
      className={styles.preview}
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className={styles.introText}>
        <div className={styles.emoji}>👁️</div>
        <span>이미 3,249명의 20대 여성이 받아봤어요.</span>
        <h2>미리 보는 [썸 손절 판별 리포트]</h2>
      </div>

      <div className={styles.mockupCard}>
        <div className={styles.mockupHeader}>
          <h3>👤 판별 대상: 썸남 &apos;민우&apos; 사주</h3>
        </div>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span
              key={tag.label}
              className={styles.tag}
              onClick={() => onTagClick(tag.info)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onTagClick(tag.info)}
            >
              {tag.label}
            </span>
          ))}
        </div>
        <p className={styles.desc}>
          &quot;태어난 일주(日柱) 분석 결과, 이 사람은 겉으로는 다정하지만 관계를 규정짓는 것을 두려워합니다...&quot;
        </p>

        <div className={styles.chartContainer}>
          <svg className={styles.lineChartSvg} viewBox="0 0 300 100" preserveAspectRatio="none">
            <path className={styles.chartPathPast} d="M 0 90 Q 50 80 150 20" />
            <path
              className={styles.chartPathFuture}
              d="M 150 20 Q 250 80 300 90"
              style={{ strokeDashoffset: isVisible ? "0" : "100" }}
            />
          </svg>
          <div
            className={styles.chartWarning}
            style={{ opacity: isVisible ? "1" : "0", transition: "opacity 1s 1s" }}
          >
            ⚠️ 현재 기운: 급하강 기류
          </div>
        </div>
        <div className={styles.chartLabels}>
          <span>1주차</span>
          <span>3주차(현재)</span>
          <span>5주차(미래)</span>
        </div>

        <div className={styles.blurBox}>
          <h4>🧭 연판소의 최종 판별 가이드</h4>
          <p className={styles.blurGuideTitle}>이 관계를 계속 유지할 경우 자존감 보호 수칙:</p>
          <div className={styles.blurText}>
            1. 먼저 선톡하지 말고 상대방 패턴 관찰하기<br />
            2. 이번 주말 약속은 거절하여 텐션 역전하기<br />
            3. 3주 뒤 공망 시기에 과감하게 손절 통보하기
          </div>
          <div
            className={styles.lockBadge}
            onClick={onCtaClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onCtaClick()}
          >
            🔒 결제 후 1초 만에 열람
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreviewSectionComponent;

import cn from "classnames";
import styles from "./solution-section-component.module.css";
import useIntersectionObserver from "../hooks/use-intersection-observer";

const solutionCards = [
  { icon: "👤", title: "상대의 연애 성향", desc: "어장관리 사주 vs 뚝딱이 사주", titleColor: "var(--secondary)" },
  { icon: "📈", title: "현재 관계 흐름", desc: "두 사람의 기운이 맞물리는 타이밍", titleColor: "var(--primary)" },
  { icon: "⚡️", title: "위험 신호", desc: "미리 걸러내는 똥차 시그널 3가지", titleColor: "#e6c200" },
  { icon: "🧭", title: "맞춤형 행동 가이드", desc: "고백 타이밍 vs 단호한 손절 가이드", titleColor: "var(--text-main)" },
];

const capsules = ["年", "月", "日", "時"];

const SolutionSectionComponent = () => {
  const { ref, isVisible } = useIntersectionObserver(0.3);

  return (
    <section
      id="solutionSec"
      className={styles.solution}
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className={styles.iconTop}>💡</div>
      <p className={styles.subTitle}>이제 혼자만의 의미 부여는 끝낼 시간.</p>
      <h2 className={styles.mainTitle}>
        연판소가 제안하는 과학적 명리 분석<br />[썸 손절 판별 리포트]
      </h2>

      <div className={styles.gridCards}>
        {solutionCards.map((card, i) => (
          <div
            key={card.title}
            className={cn(styles.sCard, { [styles.sCardVisible]: isVisible })}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <div className={styles.sCardIcon}>{card.icon}</div>
            <h3 style={{ color: card.titleColor }}>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>

      <div className={styles.capsuleWrapper}>
        {capsules.map((char, i) => (
          <div key={char} className={styles.capsule}>
            <span>{char}</span>
            <div
              className={styles.capsuleFill}
              style={{
                height: isVisible ? "100%" : "0%",
                transitionDelay: `${i * 0.2}s`,
              }}
            />
          </div>
        ))}
      </div>
      <p className={styles.capsuleNote}>Python 데이터 기반 60갑자 정밀 분석 완료</p>

      <div className={styles.beforeAfterBox}>
        <div className={styles.baRow}>
          <span className={cn(styles.label, styles.labelBefore)}>Before: 열람 전</span>
          <p>상대방 답장 1개에 하루 종일 불안함</p>
          <div className={styles.baBarBg}>
            <div
              className={styles.baBarFill}
              style={{ width: isVisible ? "45%" : "0%", background: "#999" }}
            />
          </div>
        </div>
        <div className={styles.baRow}>
          <span className={cn(styles.label, styles.labelAfter)}>After: 열람 후</span>
          <p>정확한 사주 파악으로 멘탈 케어 &amp; 확신</p>
          <div className={styles.baBarBg}>
            <div
              className={styles.baBarFill}
              style={{ width: isVisible ? "100%" : "0%", background: "var(--primary)" }}
            />
          </div>
        </div>
      </div>

      <div className={styles.arrowDown}>👇</div>
    </section>
  );
};

export default SolutionSectionComponent;

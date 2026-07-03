import cn from "classnames";
import styles from "./pain-point-section-component.module.css";
import useIntersectionObserver from "../hooks/use-intersection-observer";

const barData = [
  { label: "1위 상대의 애매한 태도", pct: 89, color: "var(--primary)" },
  { label: "2위 어장관리인지 헷갈릴 때", pct: 72, color: "var(--secondary)" },
  { label: "3위 언제까지 기다려야 할지", pct: 55, color: "var(--secondary)" },
];

const flowItems = [
  { icon: "❓", label: "애매한 관계" },
  { icon: "💭", label: "혼자 의미 부여" },
  { icon: "⏳", label: "시간 낭비" },
  { icon: "💔", label: "자존감 하락" },
];

const PainPointSectionComponent = () => {
  const { ref, isVisible } = useIntersectionObserver(0.3);

  return (
    <section
      id="painPointSec"
      className={styles.painPoint}
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className={styles.introText}>
        <div className={styles.emoji}>💔</div>
        <span>원래 썸 탈 때 이렇게 마음이 아픈가요?</span>
        <h2>당신이 밤마다 잠 못 들고<br />앓아누운 진짜 이유</h2>
      </div>

      <div className={styles.barChart}>
        {barData.map((bar) => (
          <div key={bar.label} className={styles.barItem}>
            <div className={styles.barLabel}>
              <span>{bar.label}</span>
              <span style={{ color: bar.color }}>{bar.pct}%</span>
            </div>
            <div className={styles.barBg}>
              <div
                className={styles.barFill}
                style={{ width: isVisible ? `${bar.pct}%` : "0%", background: bar.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={cn(styles.chatCard, { [styles.chatCardVisible]: isVisible })}>
        <div className={styles.bubbleLeft}>나 어제 친구들이랑 술 마시다 일찍 잠들었어ㅎㅎ</div>
        <div className={styles.chatMeta}>오후 1:00</div>
        <div className={styles.bubbleRight}>아 하하 그렇구나! 푹 잤어??</div>
        <div className={styles.chatMeta}>
          <span className={styles.unread}>1</span> 오후 11:45 - 읽지 않음
        </div>
        <div className={styles.warningText}>
          <span>🔍</span>
          <span>
            &apos;나한테 마음이 있나?&apos; 혼자 온갖 의미 부여를 하고 계신가요?
            상대는 이미 당신을 애매한 경계선에 두었을 확률이 높습니다.
          </span>
        </div>
      </div>

      <div className={styles.flowDiagram}>
        {flowItems.map((item) => (
          <div key={item.label} className={styles.flowCircle}>
            <i>{item.icon}</i>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.bannerDark}>
        <p>&quot;사귀는 것도 아니고, 끝난 것도 아닌 방치된 시간은 결국 상처로 돌아옵니다.&quot;</p>
        <p className={styles.bannerHighlight}>단 1분 만에 판별하세요.</p>
      </div>
    </section>
  );
};

export default PainPointSectionComponent;

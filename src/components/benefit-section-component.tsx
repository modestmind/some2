import cn from "classnames";
import styles from "./benefit-section-component.module.css";
import useIntersectionObserver from "../hooks/use-intersection-observer";

const compareItems = [
  { label: "💔 감정 소모 (우울감)", price: "150,000원 상당", width: 90 },
  { label: "⏳ 시간 낭비 (기다림)", price: "100,000원 상당", width: 70 },
  { label: "☕ 무의미한 데이트", price: "70,000원 상당", width: 50 },
];

const benefitCards = [
  {
    icon: "⏳",
    title: "시간세이브",
    desc: "애매한 관계에 황금 같은 시간을 쓰지 않도록 딱 잘라 드립니다.",
    highlight: false,
  },
  {
    icon: "🛡️❤️",
    title: "자존감 철벽 보호",
    desc: "의미 부여하며 자책하는 시간을 끝냅니다.",
    highlight: true,
  },
  {
    icon: "⚡",
    title: "빠른 의사결정",
    desc: "직진할 인연인지 안전하게 정리할지 판단해 드립니다.",
    highlight: false,
  },
  {
    icon: "🔮",
    title: "미래 리스크 차단",
    desc: "몇 달 뒤 눈물 흘릴 유독한 관계를 미리 걸러냅니다.",
    highlight: false,
  },
];

const BenefitSectionComponent = () => {
  const { ref, isVisible } = useIntersectionObserver(0.3);
  const { ref: energyRef, isVisible: isEnergyVisible } = useIntersectionObserver(0.5);

  return (
    <section
      id="benefitSec"
      className={styles.benefit}
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className={styles.introText}>
        <div className={styles.emoji}>🕊️</div>
        <h2 className={styles.title1}>
          지나고 나서 후회하면<br />내 시간은 누가 보상해주나요?
        </h2>
        <h2 className={styles.title2}>연판소와 함께하는 스마트한 연애</h2>
      </div>

      <div className={styles.valueCompare}>
        {compareItems.map((item) => (
          <div key={item.label} className={styles.vcRow}>
            <div className={styles.vcTitle}>
              <span>{item.label}</span>
              <span>{item.price}</span>
            </div>
            <div className={styles.vcBarWrap}>
              <div className={styles.vcBarGray} style={{ width: `${item.width}%` }} />
            </div>
          </div>
        ))}
        <div className={styles.vcDivider} />
        <div className={styles.vcRow}>
          <div className={cn(styles.vcTitle, styles.vcTitlePrimary)}>
            <span>💖 연판소 판별 리포트</span>
            <span>커피 한 잔 값!</span>
          </div>
          <div className={styles.vcBarWrap}>
            <div
              className={styles.vcBarPink}
              style={{ width: isVisible ? "15%" : "0%" }}
            />
          </div>
        </div>
      </div>

      <div className={styles.gridCards}>
        {benefitCards.map((card) => (
          <div
            key={card.title}
            className={cn(styles.sCard, { [styles.sCardHighlight]: card.highlight })}
          >
            <div className={styles.sCardIcon}>{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>

      <div
        className={cn(styles.energyBox, { [styles.energyBoxActive]: isEnergyVisible })}
        ref={energyRef as React.RefObject<HTMLDivElement>}
      >
        <p className={styles.energyTitle}>리포트 열람 후 나의 자존감 기운</p>
        <div className={styles.batteryWrap}>
          <div className={styles.batteryLevel} />
        </div>
        <div className={styles.statusText}>✨ 주도적인 연애 확신 100%!</div>
      </div>
    </section>
  );
};

export default BenefitSectionComponent;

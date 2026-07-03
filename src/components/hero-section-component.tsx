import cn from "classnames";
import styles from "./hero-section-component.module.css";

type HeroSectionComponentProps = {
  onCtaClick: () => void;
};

const HeroSectionComponent = (props: HeroSectionComponentProps) => {
  const { onCtaClick } = props;

  return (
    <section className={styles.hero}>
      <video
        className={styles.heroVideo}
        src="/img/hero_bg.mp4"
        poster="/img/hero_bg.jpg"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.heroOverlay} />
      <div className={styles.badge}># 썸 손절 판별기</div>
      <h1 className={styles.heroTitle}>
        그 사람 마음을 모르겠어💬<br />
        밤마다 혼자 의미 부여하는 썸은 <br />
        <span className={styles.highlight}>이제 그만.</span>
      </h1>
      <button
        className={cn(styles.btnCta, styles.bounce)}
        type="button"
        onClick={onCtaClick}
      >
        내 썸 상대 분석하고 손절 리포트 받기 ➔
      </button>
    </section>
  );
};

export default HeroSectionComponent;

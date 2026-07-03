import { useState, useEffect } from "react";
import cn from "classnames";
import styles from "./cta-section-component.module.css";

type CtaSectionComponentProps = {
  ctaRef: React.RefObject<HTMLElement | null>;
  onFinalCtaClick: () => void;
};

type TimeState = {
  h: number;
  m: number;
  s: number;
};

const CtaSectionComponent = (props: CtaSectionComponentProps) => {
  const { ctaRef, onFinalCtaClick } = props;

  const [time, setTime] = useState<TimeState>({ h: 2, m: 14, s: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 2, m: 14, s: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className={styles.ctaSection} ref={ctaRef}>
      <div className={styles.timerBanner}>
        <div className={styles.timerTitle}>⏰ 선착순 76% 특별 할인가 마감 직전!</div>
        <div className={styles.timeBlocks}>
          <div className={styles.tBlock}>{pad(time.h)}</div>
          <div className={styles.tSep}>:</div>
          <div className={styles.tBlock}>{pad(time.m)}</div>
          <div className={styles.tSep}>:</div>
          <div className={styles.tBlock}>{pad(time.s)}</div>
        </div>
        <p className={styles.timerNote}>지금 신청하면 커피 한 잔 가격으로 열람 가능</p>
      </div>

      <div className={cn(styles.formCard, styles.ctaNewCard)}>
        <h3 className={styles.ctaNewTitle}>
          우리의 진짜 관계,<br />
          <span className={styles.highlightPink}>사주 분석으로 확실하게 판별해 볼까요?</span>
        </h3>

        <p className={styles.ctaNewDesc}>
          더 이상 밤새 혼자 의미 부여하며 앓아눕지 마세요.{" "}
          <strong>커피 한 잔 값(3,300원)</strong>의 가벼운 리포트 열람 절차로 당신의 소중한 시간과 자존감을 확실하게 지켜낼 정답지를 확인하세요.
        </p>

        <button
          className={cn(styles.btnCta, styles.bounce, styles.btnCtaLock)}
          type="button"
          onClick={onFinalCtaClick}
        >
          🔒 1초 만에 잠금 해제하고 리포트 확인하기
        </button>

        <ul className={styles.ctaTips}>
          <li>* 본 절차는 카카오페이/토스/네이버페이로 3초 만에 간편하게 완료됩니다.</li>
          <li>* 상대방에게는 사주 조회 및 리포트 열람 사실이 절대 알림으로 가지 않으니 안심하세요.</li>
        </ul>
      </div>
    </section>
  );
};

export default CtaSectionComponent;

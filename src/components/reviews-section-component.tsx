import { useState } from "react";
import cn from "classnames";
import styles from "./reviews-section-component.module.css";

const filterChips = ["#어장관리_탈출", "#회피형_대처법", "#짝사랑_종결"];

const toastReviews = [
  { avatar: "👩‍🦰", text: '"커피 한 잔 값으로 몇 달 삽질 끝냈습니다."' },
  { avatar: "👧", text: '"소름돋게 성격이 다 맞아서 놀랐어요."' },
  { avatar: "👩", text: '"덕분에 미련 없이 깔끔하게 손절했습니다!"' },
];

const ReviewsSectionComponent = () => {
  const [activeChip, setActiveChip] = useState(0);

  return (
    <section className={styles.reviews}>
      <div className={styles.reviewDash}>
        <div className={styles.stars}>✦✦✦✦✦</div>
        <div className={styles.dashStat}>종합 만족도 평점: 4.9 / 5.0</div>
        <p>
          리포트 누적 발행 건수: 12,400+ 건<br />
          <strong className={styles.strong}>98.4%가 자존감 회복에 도움을 받음</strong>
        </p>
      </div>

      <div className={styles.filterChips}>
        {filterChips.map((chip, i) => (
          <div
            key={chip}
            className={cn(styles.chip, { [styles.chipActive]: activeChip === i })}
            onClick={() => setActiveChip(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveChip(i)}
          >
            {chip}
          </div>
        ))}
      </div>

      <div className={styles.timelineCard}>
        <div className={styles.reviewer}>👤 지은님 (24세, 대학생) | ⭐⭐⭐⭐⭐</div>
        <div className={cn(styles.tlItem, styles.tlBefore)}>
          <div className={styles.tlLine} />
          <span className={cn(styles.badge, styles.badgeBefore)}>Before</span>
          <p>&quot;선톡은 오는데 데이트 신청은 안 하던 썸남... 매일 프사 의미 부여하느라 불면증 폭발&quot;</p>
        </div>
        <div className={cn(styles.tlItem, styles.tlAfter)}>
          <span className={cn(styles.badge, styles.badgeAfter)}>After</span>
          <p>&quot;사주 성향대로 연락 끊고 숨고르기 했더니, 장문 카톡 오고 현재 1일 차!🥰&quot;</p>
        </div>
      </div>

      <div className={styles.toastWrap}>
        {toastReviews.map((review, i) => (
          <div
            key={review.avatar}
            className={styles.toast}
            style={{ top: `${i * 50}px`, zIndex: 3 - i }}
          >
            <div className={styles.toastImg}>{review.avatar}</div>
            <div className={styles.toastTxt}>{review.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsSectionComponent;

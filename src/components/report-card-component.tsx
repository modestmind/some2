import type { ProfileListItem } from "../api/saju-profile-api";
import styles from "./report-card-component.module.css";

const GENDER_LABEL: Record<string, string> = {
  F: "여성",
  M: "남성",
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
};

type ReportCardComponentProps = {
  item: ProfileListItem;
  onViewReport: (id: number) => void;
};

const ReportCardComponent = ({ item, onViewReport }: ReportCardComponentProps) => {
  const hasReport = item.report_yn === "Y";

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.cardName}>{item.name}</span>
        <span className={`${styles.genderBadge} ${item.gender === "F" ? styles.genderF : styles.genderM}`}>
          {GENDER_LABEL[item.gender] ?? item.gender}
        </span>
      </div>

      <div className={styles.cardMeta}>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>본인과의 관계</span>
          <span className={styles.metaValue}>{item.relationship_type || "-"}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>생성일</span>
          <span className={styles.metaValue}>{formatDate(item.created_at)}</span>
        </div>
      </div>

      <hr className={styles.divider} />

      <button
        type="button"
        className={`${styles.btnReport} ${hasReport ? styles.btnReportActive : styles.btnReportDisabled}`}
        disabled={!hasReport}
        onClick={() => hasReport && onViewReport(item.saju_profile_id)}
      >
        {hasReport ? "리포트 보기" : "리포트 준비중"}
      </button>
    </div>
  );
};

export default ReportCardComponent;

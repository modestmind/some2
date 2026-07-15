import type { CSSProperties, ReactNode } from "react";
import classnames from "classnames/bind";
import styles from "./report-section-component.module.css";

const cx = classnames.bind(styles);

type ReportSectionComponentProps = {
  bannerSrc: string;
  bannerAlt: string;
  bannerHeight?: number;
  mainColor: string;
  mainColorRgb: string;
  bgColor: string;
  isFirst?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onExpandAll?: () => void;
  isAllExpanded?: boolean;
  children: ReactNode;
};

const ReportSectionComponent = (props: ReportSectionComponentProps) => {
  const {
    bannerSrc,
    bannerAlt,
    bannerHeight = 220,
    mainColor,
    mainColorRgb,
    bgColor,
    isFirst = false,
    isExpanded,
    onToggle,
    onExpandAll,
    isAllExpanded,
    children,
  } = props;

  const sectionStyle = {
    "--section-main-color": mainColor,
    "--section-main-color-rgb": mainColorRgb,
    "--section-bg-color": bgColor,
  } as CSSProperties;

  const collapsedClass = isFirst ? "collapsedFirst" : "collapsed";

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  const handleExpandAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpandAll?.();
  };

  return (
    <div
      className={cx("section", isExpanded ? "expanded" : collapsedClass)}
      style={sectionStyle}
    >
      <div
        className={cx(
          "sectionOverlay",
          isFirst && "overlayFirst",
          isExpanded && "overlayHidden",
        )}
      >
        <span className={styles.overlayText}>{bannerAlt}</span>
      </div>

      {onExpandAll !== undefined && (
        <button
          type="button"
          className={styles.expandAllBtn}
          onClick={handleExpandAll}
        >
          {isAllExpanded ? "전체닫기" : "전체열기"}
        </button>
      )}

      <button
        type="button"
        className={styles.toggleBtn}
        onClick={handleToggle}
      >
        {isExpanded ? "닫기" : "열기"}
      </button>

      <img
        className={styles.sectionBanner}
        src={bannerSrc}
        alt={bannerAlt}
        style={{ height: bannerHeight }}
        onClick={handleToggle}
      />

      <div className={styles.sectionContent}>{children}</div>
    </div>
  );
};

export default ReportSectionComponent;

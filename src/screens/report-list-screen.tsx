import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { StateType } from "../shared/store/store";
import MainHeaderComponent from "../components/main-header-component";
import SideMenuComponent from "../components/side-menu-component";
import ReportCardComponent from "../components/report-card-component";
import { useGetMyReports } from "../hooks/use-get-my-reports";
import styles from "./report-list-screen.module.css";

const ReportListScreen = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = useSelector((state: StateType) => state.auth.token);

  const { data, isLoading } = useGetMyReports();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  if (token === null) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const reports = data?.reports ?? [];

  const handleViewReport = (reportId: string) => {
    navigate(`/report?reportId=${reportId}`);
  };

  return (
    <div className={styles.page}>
      <MainHeaderComponent
        onLoginClick={() => navigate("/login")}
        onMenuOpen={() => setIsMenuOpen(true)}
      />
      <SideMenuComponent
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <header className={styles.header}>
        <button type="button" className={styles.btnBack} onClick={() => navigate(-1)}>
          ←
        </button>
        <span className={styles.headerTitle}>마이 리포트</span>
        <div className={styles.spacer} />
      </header>

      {isLoading ? (
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
        </div>
      ) : reports.length === 0 ? (
        <div className={styles.emptyWrap}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyTitle}>아직 리포트가 없어요</p>
          <p className={styles.emptyDesc}>
            썸 손절 리포트를 받으면<br />이 곳에서 확인할 수 있어요.
          </p>
        </div>
      ) : (
        <div className={styles.content}>
          {reports.map((item) => (
            <ReportCardComponent
              key={item.report_id}
              item={item}
              onViewReport={handleViewReport}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportListScreen;

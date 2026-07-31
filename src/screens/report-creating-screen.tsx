import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import classnames from "classnames/bind";
import styles from "./report-creating-screen.module.css";
import { toastActions } from "../shared/store/toast-slice";
import { generateReportRequest } from "../api/report-api";

const cx = classnames.bind(styles);

const ReportCreatingScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get("reportId") ?? "";
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    if (!reportId) {
      navigate("/", { replace: true });
      return;
    }
    generateReportRequest(reportId)
      .then(({ report_id }) => navigate(`/report?reportId=${report_id}`, { replace: true }))
      .catch(() => {
        dispatch(toastActions.show({ message: "리포트 생성에 실패했습니다.", code: 500 }));
        navigate("/", { replace: true });
      });
  }, [reportId]);

  return (
    <div className={cx("pageWrapper")}>
      <div className={cx("container")}>
        <div className={cx("spinner")} />
        <p className={cx("message")}>
          <h3>리포트 작성중입니다.</h3><br />
          잠시만 기다려 주세요.<br />
          ( 1~2분정도 소요됩니다 )<br /><br />
          작성이 완료되면 리포트 페이지로 이동합니다.
        </p>
      </div>
    </div>
  );
};

export default ReportCreatingScreen;

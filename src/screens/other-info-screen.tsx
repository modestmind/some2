import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import z from "zod";
import classnames from "classnames/bind";
import styles from "./other-info-screen.module.css";
import CustomCheckboxComponent from "../components/custom-checkbox-component";
import ToastComponent from "../components/toast-component";
import { toastActions } from "../store/toast-slice";
import { parseZodError } from "../utils/zod-error";
import useOtherInfoMutation from "../hooks/use-other-info-mutation";
import type { StateType } from "../store/store";

const cx = classnames.bind(styles);

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

const relationOptions = [
  "애매하게 연락만 하는 썸",
  "어장관리가 의심되는 썸",
  "내가 일방적으로 좋아하는 짝사랑",
  "연인",
  "기타",
];

const reportSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
});

const OtherInfoScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state: StateType) => state.token.token);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"F" | "M">("M");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [isLunar, setIsLunar] = useState(false);
  const [isLunarLeap, setIsLunarLeap] = useState(false);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [isUnknownTime, setIsUnknownTime] = useState(false);
  const [relation, setRelation] = useState("");
  const [worry, setWorry] = useState("");
  const [zodError, setZodError] = useState<z.ZodError | null>(null);

  const { isPending, mutate: saveOtherInfoMutate } = useOtherInfoMutation();

  if (token === null) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const handleLunarChange = (checked: boolean) => {
    setIsLunar(checked);
    if (!checked) setIsLunarLeap(false);
  };

  const handleLunarLeapChange = (checked: boolean) => {
    setIsLunarLeap(checked);
    if (checked) setIsLunar(true);
  };

  const handleUnknownTimeChange = (checked: boolean) => {
    setIsUnknownTime(checked);
    if (checked) {
      setHour("");
      setMinute("");
    }
  };

  const handleSubmitReport = () => {
    const result = reportSchema.safeParse({ name });
    if (result.success === false) {
      setZodError(result.error);
      return;
    }
    setZodError(null);

    const birth_date =
      year && month && day
        ? `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
        : "";
    const calendar_type = isLunarLeap ? "lunar_leap" : isLunar ? "lunar" : "solar";
    const birth_time =
      isUnknownTime || !hour || !minute
        ? ""
        : `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;

    saveOtherInfoMutate(
      {
        name: result.data.name,
        gender,
        birth_date,
        calendar_type,
        birth_time,
        relationship_type: relation,
        relation_duration: "",
        relationship_status: worry,
      },
      {
        onSuccess: () => {
          dispatch(toastActions.show({ message: "데이터 분석을 시작합니다...", code: 200 }));
          navigate("/payment");
        },
        onError: () => {
          dispatch(toastActions.show({ message: "저장 중 오류가 발생했습니다. 다시 시도해 주세요.", code: 500 }));
        },
      },
    );
  };

  return (
    <div className={cx("infoApp")}>
      <ToastComponent />

      <header className={cx("infoHeader")}>
        <button type="button" className={cx("btnBack")} onClick={() => navigate(-1)}>
          ←
        </button>
        <div className={cx("logo")}>연애판별소</div>
        <div className={cx("spacer")} />
      </header>

      <section className={cx("infoSection")}>
        <div className={cx("infoTitleWrap")}>
          <h1 className={cx("infoTitle")}>상대방 정보 입력</h1>
          <p className={cx("infoDesc")}>상대방의 고유한 기운을 불러올 차례예요.</p>
        </div>

        <div className={cx("formContainer")}>
          <div className={cx("formGroup")}>
            <label className={cx("formLabel")}>이름</label>
            <input
              type="text"
              className={cx("inputBox", { inputBoxError: zodError !== null })}
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {zodError !== null && (
              <p className={cx("errorText")}>{parseZodError(zodError, "name")}</p>
            )}
          </div>

          <div className={cx("formGroup")}>
            <label className={cx("formLabel")}>성별</label>
            <div className={cx("toggleGroup")}>
              <button
                type="button"
                className={cx("tglBtn", { tglBtnActive: gender === "F" })}
                onClick={() => setGender("F")}
              >
                여성 👩
              </button>
              <button
                type="button"
                className={cx("tglBtn", { tglBtnActive: gender === "M" })}
                onClick={() => setGender("M")}
              >
                남성 👦
              </button>
            </div>
          </div>

          <div className={cx("formGroup")}>
            <label className={cx("formLabel")}>생년월일</label>
            <div className={cx("selectGroup")}>
              <select
                className={cx("selectBox")}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">연도</option>
                {years.map((y) => (
                  <option key={y} value={String(y)}>{y}년</option>
                ))}
              </select>
              <select
                className={cx("selectBox")}
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">월</option>
                {months.map((m) => (
                  <option key={m} value={String(m)}>{m}월</option>
                ))}
              </select>
              <select
                className={cx("selectBox")}
                value={day}
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="">일</option>
                {days.map((d) => (
                  <option key={d} value={String(d)}>{d}일</option>
                ))}
              </select>
            </div>
            <div className={cx("checkboxWrap")}>
              <CustomCheckboxComponent
                label="음력"
                checked={isLunar}
                onChange={handleLunarChange}
              />
              <CustomCheckboxComponent
                label="음력(윤달)"
                checked={isLunarLeap}
                onChange={handleLunarLeapChange}
              />
            </div>
          </div>

          <div className={cx("formGroup")}>
            <label className={cx("formLabel")}>태어난 시간</label>
            <div className={cx("selectGroup")}>
              <select
                className={cx("selectBox")}
                value={hour}
                disabled={isUnknownTime}
                onChange={(e) => setHour(e.target.value)}
              >
                <option value="">시</option>
                {hours.map((h) => (
                  <option key={h} value={String(h)}>
                    {String(h).padStart(2, "0")}시
                  </option>
                ))}
              </select>
              <select
                className={cx("selectBox")}
                value={minute}
                disabled={isUnknownTime}
                onChange={(e) => setMinute(e.target.value)}
              >
                <option value="">분</option>
                {minutes.map((min) => (
                  <option key={min} value={String(min)}>
                    {String(min).padStart(2, "0")}분
                  </option>
                ))}
              </select>
            </div>
            <div className={cx("checkboxWrap")}>
              <CustomCheckboxComponent
                label="시간을 정확히 모름"
                checked={isUnknownTime}
                onChange={handleUnknownTimeChange}
              />
            </div>
          </div>

          <div className={cx("formGroup")}>
            <label className={cx("formLabel")}>나와의 관계 🧭</label>
            <select
              className={cx("selectBox", "selectBoxFull")}
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
            >
              <option value="">선택해주세요</option>
              {relationOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className={cx("formGroup")}>
            <label className={cx("formLabel")}>현재 고민 상태</label>
            <textarea
              className={cx("textareaBox")}
              placeholder="현재 관계 상태나 고민을 적어주시면 알고리즘에 반영됩니다. (선택사항)"
              value={worry}
              onChange={(e) => setWorry(e.target.value)}
            />
          </div>

          <button
            type="button"
            className={cx("btnCta", { bounce: !isPending })}
            disabled={isPending}
            onClick={handleSubmitReport}
          >
            {isPending ? "분석 중..." : "진단 후 리포트 확인하기"}
          </button>
        </div>

        <div className={cx("infoFooter")}>
          <p>
            🔒 연애판별소는 개인정보 보호를 최우선으로 합니다.<br />
            수집된 정보는 암호화되어 안전하게 관리됩니다.
          </p>
        </div>
      </section>
    </div>
  );
};

export default OtherInfoScreen;

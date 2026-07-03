import { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import z from "zod";
import classnames from "classnames/bind";
import styles from "./my-profile-screen.module.css";
import CustomCheckboxComponent from "../components/custom-checkbox-component";
import { toastActions } from "../store/toast-slice";
import { parseZodError } from "../utils/zod-error";
import useSaveMyProfile from "../hooks/use-save-my-profile";
import type { StateType } from "../store/store";
import useGetMyProfile from "../hooks/use-get-my-profile";

const cx = classnames.bind(styles);

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

const saveProfileSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
});

const MyProfileScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const token = useSelector((state: StateType) => state.auth.token);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"F" | "M">("F");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [isLunar, setIsLunar] = useState(false);
  const [isLunarLeap, setIsLunarLeap] = useState(false);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [isUnknownTime, setIsUnknownTime] = useState(false);
  const [zodError, setZodError] = useState<z.ZodError | null>(null);

  const { data: profileData } = useGetMyProfile();
  const { isPending, mutate: saveMyProfileMutate } = useSaveMyProfile();

  useEffect(() => {
    const profile = profileData?.myProfile;
    if (!profile) return;

    setName(profile.name);
    setGender(profile.gender);

    if (profile.birth_date) {
      const [y, m, d] = profile.birth_date.split("-");
      setYear(y);
      setMonth(String(parseInt(m)));
      setDay(String(parseInt(d)));
    }

    if (profile.calendar_type === "lunar_leap") {
      setIsLunar(true);
      setIsLunarLeap(true);
    } else if (profile.calendar_type === "lunar") {
      setIsLunar(true);
      setIsLunarLeap(false);
    } else {
      setIsLunar(false);
      setIsLunarLeap(false);
    }

    if (profile.birth_time) {
      const [h, min] = profile.birth_time.split(":");
      setHour(String(parseInt(h)));
      setMinute(String(parseInt(min)));
      setIsUnknownTime(false);
    } else {
      setIsUnknownTime(true);
    }
  }, [profileData]);

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

  const handleSaveProfile = () => {
    const result = saveProfileSchema.safeParse({ name });
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

    saveMyProfileMutate(
      { name: result.data.name, gender, birth_date, calendar_type, birth_time },
      {
        onSuccess: () => {
          dispatch(toastActions.show({ message: "내 정보가 성공적으로 저장되었습니다.", code: 200 }));
          navigate("/other-profile");
        },
        onError: () => {
          dispatch(toastActions.show({ message: "저장 중 오류가 발생했습니다. 다시 시도해 주세요.", code: 500 }));
        },
      },
    );
  };

  return (
    <div className={cx("profileApp")}>

      <header className={cx("profileHeader")}>
        <button type="button" className={cx("btnBack")} onClick={() => navigate(-1)}>
          ←
        </button>
        <div className={cx("logo")}>연애판별소</div>
        <div className={cx("spacer")} />
      </header>

      <section className={cx("profileSection")}>
        <div className={cx("profileTitleWrap")}>
          <h1 className={cx("profileTitle")}>나의 정보 입력</h1>
          <p className={cx("profileDesc")}>
            우주가 준 고유한 기운을 분석하기 위해 꼭 필요한 정보예요.<br />
            입력하신 정보는 오직 사주 분석을 위해서만 소중히 사용되니 안심하세요.
          </p>
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

          <button
            type="button"
            className={cx("btnCta", { bounce: !isPending })}
            disabled={isPending}
            onClick={handleSaveProfile}
          >
            {isPending ? "저장 중..." : "내 정보 저장"}
          </button>
        </div>

        <div className={cx("profileFooter")}>
          <p>
            🔒 연애판별소는 개인정보 보호를 최우선으로 합니다.<br />
            수집된 정보는 암호화되어 안전하게 관리됩니다.
          </p>
        </div>
      </section>
    </div>
  );
};

export default MyProfileScreen;

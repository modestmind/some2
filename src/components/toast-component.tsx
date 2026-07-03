import { useDispatch, useSelector } from "react-redux";
import type { StateType } from "../store/store";
import { useEffect } from "react";
import { toastActions } from "../store/toast-slice";

const ToastComponent = () => {
  const dispatch = useDispatch();

  const { message, code } = useSelector((state: StateType) => state.toast);

  useEffect(() => {
    if (message === null) {
      return;
    }

    const timer = setTimeout(() => {
      dispatch(toastActions.hide());
    }, 3000);

    return () => {
      // 클린업
      clearTimeout(timer);
    };
  }, [message, dispatch]);

  return (
    <div>
      {message === null ? null : (
        <div
          style={{
            position: "fixed",
            zIndex: 1100,
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            minWidth: 320,
            padding: 16,
            borderRadius: 8,
            backgroundColor: "var(--primary)",
            color: "#fff",
            fontSize: 16,
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          {`${message}`}
        </div>
      )}
    </div>
  );
};

export default ToastComponent;

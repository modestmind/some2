import { useState, type SubmitEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import z from "zod";
import { parseZodError } from "../utils/zod-error";
import InputComponent from "../components/input-component";
import TextareaComponent from "../components/textarea-component";
import ButtonComponent from "../components/button-component";
import useMemoMutation from "../hooks/use-memo-mutation";
import { useSelector } from "react-redux";
import type { StateType } from "../store/store";

const writeMemoSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z
    .string()
    .min(1, "내용을 입력해주세요.")
    .max(300, "내용은 300자를 초과할 수 없습니다."),
});

const WriteMemoScreen = () => {
  const token = useSelector((state: StateType) => state.token.token);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [zodError, setZodError] = useState<z.ZodError | null>(null);
  const { isPending, mutate } = useMemoMutation();

  if (token === null) {
    return <Navigate to={"/signin"} replace={true} />;
  }

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const { success, data, error } = writeMemoSchema.safeParse({
      title,
      content,
    });
    if (success === false) {
      setZodError(error);
      return;
    }

    mutate(data, {
      onSuccess: () => {
        navigate("/memo");
      },
    });
  };

  return (
    <div>
      <h2>메모 작성</h2>
      <div style={{ height: 20 }} />
      <form onSubmit={handleSubmit}>
        <InputComponent
          label="제목"
          id="title"
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          errorMessage={
            zodError === null ? "" : parseZodError(zodError, "title")
          }
        />
        <TextareaComponent
          label="내용"
          id="content"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          errorMessage={
            zodError === null ? "" : parseZodError(zodError, "content")
          }
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginTop: 8,
          }}
        >
          <ButtonComponent
            text={isPending ? "저장 중..." : "작성 완료"}
            type="submit"
          />
          <ButtonComponent
            text="취소"
            type="button"
            onClick={() => navigate("/memo")}
          />
        </div>
      </form>
    </div>
  );
};

export default WriteMemoScreen;

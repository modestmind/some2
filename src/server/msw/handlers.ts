import { http, delay, HttpResponse } from "msw";
import { loadDatabase, saveDatabase } from "../../utils/local-storage";
import { type Database, type User, type SajuProfile } from "./database";
import { getNextProfileId, getNextUserId } from "../../utils/id-util";
import { getDateTime } from "../../utils/date-util";

const lsDatabase: Database = loadDatabase();

const handlers = [

  http.post("/api/login", async ({ request }) => {
    const body = await request.json();
    await delay(500);

    const { sns_provider_code, sns_user_key, nickname } = 
        body as { sns_provider_code: string; sns_user_key: string; nickname: string; };

    // TODO. sns_user_key 유효성 검사.

    const foundUser = lsDatabase.users.find((user) => 
        user.sns_provider_code === sns_provider_code && user.sns_user_key === sns_user_key);

    let loginUser: User;

    // 가입 안된 회원 가입시키기
    if (!foundUser) {

      const user_id = getNextUserId(lsDatabase.users);

      const newUser: User = {
        user_id,
        sns_provider_code,
        sns_user_key,
        nickname,
        status: 'Y',
        created_at: getDateTime(),
        last_login_at: '',
      }

      lsDatabase.users.push(newUser);

      loginUser = newUser;
    } else {
      loginUser = foundUser;
    }

    const token = crypto.randomUUID();

    lsDatabase.sessions = lsDatabase.sessions.filter((s) => s.user_id !== loginUser.user_id);
    lsDatabase.sessions.push({ token, user_id: loginUser.user_id });

    saveDatabase(lsDatabase);

    return HttpResponse.json({ token });
  }),

  http.post("/api/logout", async ({ request }) => {
    await delay(500);

    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    lsDatabase.sessions = lsDatabase.sessions.filter(
      (session) => session.token !== token,
    );
    saveDatabase(lsDatabase);

    return HttpResponse.json({});
  }),

  http.post("/api/saju-profiles", async ({ request }) => {
    await delay(500);

    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    const foundSession = lsDatabase.sessions.find(
      (session) => session.token === token,
    );
    if (foundSession == null) {
      return HttpResponse.json({ errorCode: "INVALID_TOKEN" }, { status: 401 });
    }

    const body = await request.json();
    const {
      is_self,
      name,
      gender,
      birth_date,
      calendar_type,
      birth_time,
      relationship_type,
      relation_duration,
      relationship_status,
    } = body as Omit<SajuProfile, "saju_profile_id" | "user_id" | "created_at" | "updated_at">;

    const newProfile: SajuProfile = {
      saju_profile_id: getNextProfileId(lsDatabase.saju_profiles),
      user_id: foundSession.user_id,
      is_self,
      name,
      gender,
      birth_date,
      calendar_type,
      birth_time,
      relationship_type,
      relation_duration,
      relationship_status,
      created_at: getDateTime(),
      updated_at: getDateTime(),
    };

    lsDatabase.saju_profiles.push(newProfile);
    saveDatabase(lsDatabase);

    return HttpResponse.json({ saju_profile: newProfile }, { status: 201 });
  }),

];

export default handlers;

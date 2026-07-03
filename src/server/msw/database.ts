export type Session = {
  user_id: string;
  token: string;
}

export type User = {
  user_id: string;
  sns_provider_code: string;
  sns_user_key: string;
  nickname: string;
  status: string;
  created_at: string;
  last_login_at: string;
}

export type SajuProfile = {
  saju_profile_id: number;
  user_id: string;
  is_self: string;
  name: string;
  gender: string;
  birth_date: string;
  calendar_type: string;
  birth_time: string;
  relationship_type: string;
  relation_duration: string;
  relationship_status: string;
  created_at: string;
  updated_at: string;
}

export type Database = {
  sessions: Session[];
  users: User[];
  saju_profiles: SajuProfile[];
}

export const database = {
  sessions: [],
  users: [],
  saju_profiles: [],
}
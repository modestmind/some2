import type { SajuProfile, User } from "../server/msw/database";

export function getNextUserId(users: User[]): string {
  const startId = 10101010;

  if (!users || users.length === 0) return String(startId);
  
  const maxId = Math.max(...users.map(u => Number(u.user_id) || startId));
  return String(maxId + 1);
}

export function getNextProfileId(profiles: SajuProfile[]): number {
  const maxId = profiles.length > 0 ? Math.max(...profiles.map(p => p.saju_profile_id)) : 0;
  return maxId + 1;
}

import { database, type Database } from "../server/msw/database";

const DATABASE = "database";

export const loadDatabase = () => {
  return getLocalStorage<Database>(DATABASE) ?? database;
}

export const saveDatabase = (database: Database) => {
  setLocalStorage<Database>(DATABASE, database);
}

export const setLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorage = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  if (item === null) return null;
  return JSON.parse(item) as T;
};

export const removeLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};
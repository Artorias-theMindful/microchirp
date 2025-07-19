export type AuthPayload = {
  id: number;
  username: string;
};

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthPayload;
  }
}

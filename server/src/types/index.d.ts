export { };

declare global {
  namespace Express {
    export interface Request {
      isAuthenticated: () => boolean;
    }
  }
}

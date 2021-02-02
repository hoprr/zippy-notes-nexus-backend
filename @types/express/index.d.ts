export {};

declare global {
  namespace Express {
    interface Request {
      userSession: any;
    }
    interface Response {
      userSession: any;
    }
  }
}

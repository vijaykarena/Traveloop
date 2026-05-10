declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userEmail?: string;
      userRole?: string;
    }
  }
}

export {};

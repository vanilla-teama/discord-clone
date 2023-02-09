import session from "express-session-types";

declare module "express-session" {
    export interface SessionData {
        returnTo: string;
    }
}

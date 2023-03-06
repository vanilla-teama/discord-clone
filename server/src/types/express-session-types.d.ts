import session from "express-session-types";
import { HydratedDocument } from "mongoose";
import { UserDocument } from "../models/user";

declare module "express-session" {
    export interface SessionData {
        returnTo: string;
        user: HydratedDocument<UserDocument>;
    }
}

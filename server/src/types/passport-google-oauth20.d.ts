declare module 'passport-google-oauth20' {
  import { Strategy as PassportStrategy } from 'passport-strategy';
  
  export interface Profile {
    id: string;
    displayName: string;
    name?: {
      familyName: string;
      givenName: string;
    };
    emails?: Array<{
      value: string;
      verified: boolean;
    }>;
    photos?: Array<{
      value: string;
    }>;
    provider: string;
    _raw: string;
    _json: any;
  }

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
  }

  export type VerifyCallback = (
    error: any,
    user?: any,
    info?: any
  ) => void;

  export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => void;

  export class Strategy extends PassportStrategy {
    constructor(options: StrategyOptions, verify: VerifyFunction);
    name: string;
    authenticate(req: any, options?: any): void;
  }
}

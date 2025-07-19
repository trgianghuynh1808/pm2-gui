import { ProcessDescription } from "pm2";

export type TAppConfig = {
  name: string;
  script: string;
  cwd?: string;
};

export interface IEcosystemFile {
  apps: TAppConfig[];
}

export interface IProcessDetails extends ProcessDescription {
  git_branch_name?: string;
}

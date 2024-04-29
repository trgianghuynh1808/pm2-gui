export type TAppConfig = {
  name: string;
  script: string;
};

export interface IEcosystemFile {
  apps: TAppConfig[];
}

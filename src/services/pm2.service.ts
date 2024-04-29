import pm2, { ProcessDescription } from "pm2";
import fs from "fs";
import { promisify } from "util";
import { IEcosystemFile } from "../interfaces";
import { getValidArray } from "../utils";

class _PM2Service {
  private ecosystemData: IEcosystemFile = {} as IEcosystemFile;

  constructor() {
    this.ecosystemData = this.readEcosystemFile();
  }

  // *INFO: private methods
  private readEcosystemFile(): IEcosystemFile {
    const data = JSON.parse(
      fs.readFileSync(process.env.ECOSYSTEM_PATH || "", "utf8"),
    );

    return data;
  }

  private getAppNames(): string[] {
    return getValidArray(this.ecosystemData.apps).map((app) => app.name);
  }

  // *INFO: public methods
  public async getProcesses(): Promise<ProcessDescription[]> {
    const appNames = this.getAppNames();

    const promises = appNames.map((name) => {
      return promisify(pm2.describe).call(pm2, name);
    });

    const response = await Promise.all(promises);

    return response.map((item) => {
      const [proc] = item ?? {};

      return proc;
    });
  }
}

export const PM2Service = new _PM2Service();

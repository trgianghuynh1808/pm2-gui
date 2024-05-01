import pm2, { ProcessDescription } from "pm2";
import fs from "fs";
import { promisify } from "util";

// *INFO: internal modules
import { IEcosystemFile } from "../interfaces";
import { getValidArray } from "../utils";
import { EProcessStatus } from "../enums";

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

    return response.map((item, index) => {
      const [proc] = item ?? {};

      if (!proc) {
        return {
          name: appNames[index],
          // *INFO: -1 has mean the process not available
          pm_id: -1,
          status: EProcessStatus.NOT_START,
        };
      }

      return {
        ...proc,
        status:
          proc.pid !== 0 ? EProcessStatus.STARTED : EProcessStatus.STOPPED,
      };
    });
  }
}

export const PM2Service = new _PM2Service();

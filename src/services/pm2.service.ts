import pm2, { ProcessDescription } from "pm2";
import fs from "fs";
import { promisify } from "util";
import path from "path";

// *INFO: internal modules
import { IEcosystemFile, TAppConfig } from "../interfaces";
import { getValidArray } from "../utils";
import { EProcessAction, EProcessStatus } from "../enums";

class _PM2Service {
  constructor() {}

  // *INFO: private methods
  private _readEcosystemFile(): IEcosystemFile {
    const data = JSON.parse(
      fs.readFileSync(process.env.ECOSYSTEM_PATH || "", "utf8"),
    );

    return data;
  }

  private _getAppNames(): string[] {
    const ecosystemData = this._readEcosystemFile();

    return getValidArray(ecosystemData.apps).map((app) => app.name);
  }

  private _getAppConfig(
    appName: string,
    _env?: string,
  ): TAppConfig | undefined {
    const ecosystemData = this._readEcosystemFile();

    const appConfig = getValidArray(ecosystemData.apps).find(
      (app) => app.name === appName,
    );

    return appConfig;
  }

  private _getScriptPath(relScriptPath: string): string {
    const execPath = process.cwd();
    const ecosystemPath = process.env.ECOSYSTEM_PATH || "";

    return path.join(execPath, ecosystemPath, "..", relScriptPath);
  }

  private async _startProcess(config: object, env?: string): Promise<void> {
    const startAsync = promisify(pm2.start.bind(pm2));

    await startAsync(config as any);
  }

  private async _stopProcess(appName: string): Promise<void> {
    const stopAsync = promisify(pm2.stop.bind(pm2));

    await stopAsync(appName);
  }

  private async _restartProcess(appName: string): Promise<void> {
    const restartAsync = promisify(pm2.restart.bind(pm2));

    await restartAsync(appName);
  }

  private async _deleteProcess(appName: string): Promise<void> {
    const deleteAsync = promisify(pm2.delete.bind(pm2));

    await deleteAsync(appName);
  }

  private async _reloadProcess(appName: string): Promise<void> {
    const reloadAsync = promisify(pm2.reload.bind(pm2));

    await reloadAsync(appName);
  }

  // *INFO: public methods
  public async getProcesses(): Promise<ProcessDescription[]> {
    const appNames = this._getAppNames();
    const describeAsync = promisify(pm2.describe.bind(pm2));

    const promises = appNames.map((name) => {
      return describeAsync(name);
    });

    const response = await Promise.all(promises);

    return getValidArray(response).map((item, index) => {
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

  public async excProcessAction(
    action: EProcessAction,
    appName: string,
    env?: string,
  ): Promise<void> {
    const appConfig = this._getAppConfig(appName, env);

    if (!appConfig) {
      throw new Error("App config not found!");
    }

    // *INFO: get absoulte path to script
    const scriptPath = this._getScriptPath(appConfig.script);

    const customConfig = {
      ...appConfig,
      script: scriptPath,
    };

    switch (action) {
      case EProcessAction.START:
        await this._startProcess(customConfig);
        break;
      case EProcessAction.STOP:
        await this._stopProcess(customConfig.name);
        break;
      case EProcessAction.RESTART:
        await this._restartProcess(customConfig.name);
        break;
      case EProcessAction.DELETE:
        await this._deleteProcess(customConfig.name);
        break;

      default:
        throw new Error("Action not found");
    }
  }

  public async reloadAll(): Promise<void> {
    const appNames = this._getAppNames();

    const promises = appNames.map((name) => {
      return this._reloadProcess(name);
    });

    await Promise.all(promises);
  }
}

export const PM2Service = new _PM2Service();

import { EventEmitter } from "events";
import fs from "fs";
import path from "path";
import pm2, { ProcessDescription } from "pm2";
import { promisify } from "util";

// *INFO: internal modules
import { EProcessAction, EProcessStatus } from "../enums";
import { IEcosystemFile, IProcessDetails, TAppConfig } from "../interfaces";
import { getValidArray } from "../utils";
import { GitService } from "./git.service";
import PM2ConfigService from "./pm2_config.service";

export interface IProcessOutLog {
  data: string;
  at: number;
  process: {
    namespace: string;
    rev: string;
    name: string;
    pm_id: number;
  };
}

class _PM2Service {
  private bus: EventEmitter | undefined;

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
    try {
      const startAsync = promisify(pm2.start.bind(pm2));

      await startAsync(config as any);
    } catch (error) {
      PM2ConfigService.startProcessByCmd((config as any).name);
    }
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
  public async getProcesses(): Promise<IProcessDetails[]> {
    const apps = this._readEcosystemFile().apps;
    const appNames = getValidArray(apps).map((app) => app.name);

    const describeAsync = promisify(pm2.describe.bind(pm2));

    const promises = appNames.map((name) => {
      return describeAsync(name);
    });

    const response = await Promise.all(promises);

    return getValidArray(response).map((item, index) => {
      const [proc] = item ?? {};
      const appName = appNames[index];
      const appConfig = apps.find((app) => app.name === appName);
      const cwd = appConfig?.cwd;
      let gitBranchName: string | undefined;

      if (cwd) {
        const scriptPath = this._getScriptPath(cwd);
        gitBranchName = GitService.getBranchFromGitHead(scriptPath);
      }

      if (!proc) {
        return {
          name: appName,
          // *INFO: -1 has mean the process not available
          pm_id: -1,
          status: EProcessStatus.NOT_START,
          git_branch_name: gitBranchName,
        };
      }

      return {
        ...proc,
        status:
          proc.pid !== 0 ? EProcessStatus.STARTED : EProcessStatus.STOPPED,
        git_branch_name: gitBranchName,
      };
    });
  }

  public async getProcessDetails(appName: string): Promise<ProcessDescription> {
    const appConfig = this._getAppConfig(appName);

    const describeAsync = promisify(pm2.describe.bind(pm2));

    const res = await describeAsync(appName);
    const [proc] = res ?? {};

    if (!proc) {
      return {
        name: appName,
        // *INFO: -1 has mean the process not available
        pm_id: -1,
        status: EProcessStatus.NOT_START,
      } as ProcessDescription;
    }

    return {
      ...proc,
      status: proc.pid !== 0 ? EProcessStatus.STARTED : EProcessStatus.STOPPED,
    } as ProcessDescription;
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

  async onLogOut(onLog: (logObj: IProcessOutLog) => void): Promise<void> {
    if (!this.bus) {
      this.bus = await promisify<EventEmitter>(pm2.launchBus).call(pm2);
    }
    this.bus.on("log:out", (procLog: IProcessOutLog) => {
      onLog(procLog);
    });
  }
}

export const PM2Service = new _PM2Service();

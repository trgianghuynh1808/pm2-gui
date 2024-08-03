import path from "path";
import fs from "fs";
import shelljs from "shelljs";
import { getValidArray } from "../utils";
import { TAppConfig } from "../interfaces";

// *INFO: internal modules

class _PM2ConfigService {
  constructor() {}

  // *INFO: private methods
  private _getConfigPath(): string {
    const execPath = process.cwd();
    const ecosystemPath = process.env.ECOSYSTEM_PATH || "";
    const configPath = path.join(execPath, ecosystemPath);

    return configPath;
  }

  private _reloadConfig(appName?: string): void {
    const execPath = process.cwd();
    const configPath = this._getConfigPath();
    const folderPath = configPath
      .split("/")
      .slice(0, configPath.split("/").length - 1)
      .join("/");

    const configFileName = configPath.split("/").slice(-1);

    shelljs.cd("~");
    shelljs.cd(folderPath);
    // *INFO: clear all logs file
    shelljs.exec(`pm2 flush`);

    if (appName) {
      shelljs.exec(`pm2 reload ${configFileName} --only ${appName}`);
    } else {
      shelljs.exec(`pm2 restart ${configFileName}`);
    }
    shelljs.cd("~");
    shelljs.cd(execPath);
  }

  // *INFO: public methods
  public loadContent(): string {
    const configPath = this._getConfigPath();
    const rawContent = fs.readFileSync(configPath).toString();

    return rawContent;
  }

  public loadProcessContent(appName: string): string {
    const configPath = this._getConfigPath();
    const rawContent = fs.readFileSync(configPath).toString();

    const configData = JSON.parse(rawContent);
    const appConfigs = getValidArray(configData.apps) as TAppConfig[];
    const processConfig = appConfigs.find(
      (item: TAppConfig) => item.name === appName,
    );

    if (!processConfig) {
      throw new Error("Process not found");
    }

    const processConfigContent = JSON.stringify(processConfig, null, 2);

    return processConfigContent;
  }

  public async writeContent(content: string): Promise<boolean> {
    try {
      const configPath = this._getConfigPath();

      fs.writeFileSync(
        configPath,
        JSON.stringify(JSON.parse(content), null, 2),
        "utf8",
      );

      this._reloadConfig();

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public async writeProcessContent(
    appName: string,
    content: string,
  ): Promise<boolean> {
    try {
      const configPath = this._getConfigPath();
      const rawContent = fs.readFileSync(configPath).toString();

      let configData = JSON.parse(rawContent);
      let appConfigs = getValidArray(configData.apps) as TAppConfig[];
      const processConfigIndex = appConfigs.findIndex(
        (item: TAppConfig) => item.name === appName,
      );

      if (processConfigIndex < 0) {
        throw new Error("Process not found");
      }

      appConfigs[processConfigIndex] = JSON.parse(content);
      configData.apps = appConfigs;

      fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), "utf8");

      this._reloadConfig(appName);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

const PM2ConfigService = new _PM2ConfigService();

export default PM2ConfigService;

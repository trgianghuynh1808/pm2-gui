import path from "path";
import fs from "fs";
import shelljs from "shelljs";

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

  private _reloadConfig(): void {
    const configPath = this._getConfigPath();
    const folderPath = configPath
      .split("/")
      .slice(0, configPath.split("/").length - 1)
      .join("/");

    const configFileName = configPath.split("/").slice(-1);

    shelljs.cd("~");
    shelljs.cd(folderPath);
    shelljs.exec(`pm2 reload ${configFileName}`);
  }

  // *INFO: public methods
  public loadContent(): string {
    const configPath = this._getConfigPath();
    const rawContent = fs.readFileSync(configPath).toString();

    return rawContent;
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
}

const PM2ConfigService = new _PM2ConfigService();

export default PM2ConfigService;

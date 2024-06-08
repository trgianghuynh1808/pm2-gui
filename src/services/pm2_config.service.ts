import path from "path";
import fs from "fs";

class _PM2ConfigService {
  constructor() {}

  // *INFO: private methods
  private _getConfigPath(): string {
    const execPath = process.cwd();
    const ecosystemPath = process.env.ECOSYSTEM_PATH || "";
    const configPath = path.join(execPath, ecosystemPath);

    return configPath;
  }

  // *INFO: public methods
  public loadContent(): string {
    const configPath = this._getConfigPath();
    const rawContent = fs.readFileSync(configPath).toString();

    return rawContent;
  }
}

const PM2ConfigService = new _PM2ConfigService();

export default PM2ConfigService;

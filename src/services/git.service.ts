import fs from "fs";
import path from "path";

class _GitService {
  public getBranchFromGitHead(repoPath: string): string | undefined {
    const headFile = path.join(repoPath, ".git", "HEAD");
    try {
      const data = fs.readFileSync(headFile, "utf-8").trim();
      // Usually: "ref: refs/heads/main"
      const match = data.match(/^ref: refs\/heads\/(.+)$/);

      return match ? match[1] : data || undefined; // if detached, returns SHA
    } catch (err) {
      console.error("Error reading HEAD:", (err as Error).message);

      return undefined;
    }
  }
}

export const GitService = new _GitService();

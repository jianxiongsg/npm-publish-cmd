
import spawn from "cross-spawn";
import fs from "fs";
import path from "path";
import { getLogger } from "../logger";

const logger = getLogger("app");
const cwd = path.resolve(__dirname, "../..");
const GitPath = "ssh://git@gswl.lovigame.com:7884/diffusion/109/gstemplates.git";

async function gitClone(source: string, pathName: string) {
  return new Promise(resolve => {
    const child = spawn("git", ["clone", source, pathName], {stdio: "inherit", cwd});
    child.on("exit", resolve);
  });
}

async function gitPull(source: string, pathName: string) {
    return new Promise(resolve => {
      const child = spawn("git", ["pull"], {stdio: "inherit", cwd: cwd + "/" + pathName});
      child.on("exit", resolve);
    });
}
export default async () => {
    if (fs.existsSync(cwd + "/" + "templates")) {
       await gitPull(GitPath, "templates");
       console.log("更新模板库成功");
    } else {
        await gitClone(GitPath, "templates");
        console.log("添加模板库成功");
    }
};

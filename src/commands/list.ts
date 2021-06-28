import path  from 'path';
import chalk from "chalk";
import fs from "fs";
import { getLogger } from "../logger";
import { getTemplates } from "../utils";
const logger = getLogger("app");

export default () => {
  const templates = getTemplates();
  const srcPath = path.resolve(__dirname, "../..");
  console.log(chalk.green(`项目目录:${srcPath}`));
  if (templates.length === 0) {
    console.log(chalk.yellow("模版列表为空"));
  } else {
    console.log("模版列表，初始化项目: gswl init <name>\n");
    templates.forEach((t: any) => {
      console.log(chalk.green(t.name) + " - " + t.desc);
    });
  }
};

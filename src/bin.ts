#!/usr/bin/env node
import program from "commander";
import fs from "fs";
import init from "./commands/init";
import list from "./commands/list";
import publish from "./commands/publish";
import upgrade from "./commands/upgrade";
import { configure } from "./logger";
import { getPackage } from "./utils";

const pkg = getPackage(); 

program
  .version(pkg.version)
  .usage("<command> [options]")
  .option("-v, --verbose", "显示详细执行过程");
console.log(".....version",pkg.version)
program.on("option:verbose", () => configure("debug"));

program
  .command("init (template)")
  .description("创建新模版项目")
  .alias("i")
  .option("-n, --name [name]", "项目名称")
  .action(init);

program
  .command("list")
  .description("显示所有模版")
  .alias("l")
  .action(list);

program
  .command("upgrade")
  .description("升级模板库")
  .alias("u")
  .action(upgrade);

program
  .command("publish")
  .description("发布页面")
  .alias("p")
  .action(publish);

program.parse(process.argv);
if (program.args.length === 0) {
  program.help();
}

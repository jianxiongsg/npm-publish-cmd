import chalk from "chalk";
import fs from "fs";
import _ from "lodash";
import ora from "ora";
import path from "path";
import prompts from "prompts";
import rimraf from "rimraf";
import through2 from "through2";
const copy = require("recursive-copy");
import { isBinaryFile } from "isbinaryfile";
import { getLogger } from "../logger";
import { getTemplates } from "../utils";
import list from "./list";
const logger = getLogger("app");

export interface TemplateInfo {
  name: string;
  desc: string;
  path: string;
}

_.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;

/**
 * 从本地模版创建项目
 */
async function buildFromLocalTemplate(name: string, info: TemplateInfo) {
  // gulp.src(info.path);
  const dirname = process.cwd();
  const projPath = path.resolve(dirname, name);
  const spanner = ora(`   正在构建...... `);
  spanner.start();

  return new Promise(resolve => {
    const srcPath = path.resolve(__dirname, "../..", info.path);
    if (!fs.existsSync(srcPath)) {
      spanner.fail(chalk.redBright(`模版目录不存在:${srcPath}`));
      resolve();
      return;
    }
    fs.exists(projPath, exists => {
      if (exists) {
        spanner.fail(chalk.redBright(`目录已被占用:${projPath}`));
        resolve();
        return;
      }
      copy(srcPath, projPath, {
        dot: true,
        transform: (src: string, desc: string, stats: any) => {
          console.log(src);
          return through2(async (chunk, enc, done) => {
            if (await isBinaryFile(chunk)) {
              done(null, chunk);
              return;
            }
            const output = chunk.toString();

            try {
              done(null, _.template(output)({ name }));
            } catch (e) {
              done({ message: `模版错误${src} ${e.message}` });
            }
          });
        }
      })
        .on(copy.events.COPY_FILE_START, (op: any) => {
          spanner.start(op.dest);
        })
        .on(copy.events.COPY_FILE_COMPLETE, (op: any) => {
          // spanner.text = op.dest;
          spanner.succeed(op.dest.replace(projPath + "/", ""));
        })
        .on(copy.events.ERROR, (err: any, op: any) => {
          // console.log(chalk.redBright(`拷贝文件失败${op.dest} ${err.message}`));
        })
        .then((results: any) => {
          spanner.succeed(chalk(`处理文件数${results.length}`));
          spanner.succeed(
            `构建${chalk(info.name)}模版项目成功:${chalk.green(projPath)}`
          );
        })
        .catch((err: any) => {
          spanner.fail(chalk.redBright(`构建失败${err.message}`));
          rimraf(projPath, () => {
            spanner.warn(chalk.yellow(`删除目录${projPath}`));
          });
        })
        .finally(resolve);
    });
  });
}

async function inputTemplateName():Promise<string>{
  list();
  const res = await prompts({
    type: "text",
    name: "name",
    message: `输入模版名称`
  });
  logger.info(`输入了模版名称${res.name}`);
  const info = getTemplates().find((t: any) => t.name === res.name);
  if(!info){
    console.log(chalk.redBright(`未找到模版:${res.name}`));
    return await inputTemplateName();
  }
  return res.name;
}

export default async (template: string, args: { [index: string]: string }) => {
  let info = getTemplates().find((t: any) => t.name === template);
  if (!info) {
    // console.log(chalk.redBright(`未找到模版:${template}`));
    // console.log(chalk.green("使用命令: gswl list 显示所有可用模版"));
    // return;
    template = await inputTemplateName();
    info = getTemplates().find((t: any) => t.name === template);
  }

  const res = await prompts({
    type: "text",
    name: "name",
    message: `新${template}项目名称`
  });
  logger.info(`输入了新项目名称${res.name}`);

  await buildFromLocalTemplate(res.name, info);
};

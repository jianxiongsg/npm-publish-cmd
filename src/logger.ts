import log4js from "log4js";
// log4js.configure({
//   appenders: { normal: { type: "Console" } },
//   categories: {
//     app: { appenders: ["normal"], level: "debug" },
//     default: { appenders: ["normal"], level: "debug" }
//   }
// });
// import * as log4js from "@log4js2/core";

/**
 * 配置日志是否显示详细信息
 */
export function configure(level: string) {
  log4js.configure({
    appenders: { normal: { type: "Console" } },
    categories: {
      app: { appenders: ["normal"], level },
      default: { appenders: ["normal"], level }
    }
  });
  // let level = log4js.LogLevel.WARN;
  // if (detail) {
  //   level = log4js.LogLevel.ALL;
  // }
  // log4js.configure({
  //   appenders: ["Console"],
  //   layout: "[%d] [%p] %c - %m %ex",
  //   loggers: [
  //     {
  //       level,
  //       tag: "app"
  //     }
  //   ],
  //   virtualConsole: false
  // });
}
/**
 * 获得对应模块的logger
 */
export function getLogger(name: "app") {
  return log4js.getLogger(name);
}

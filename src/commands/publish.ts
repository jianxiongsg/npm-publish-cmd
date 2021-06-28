import path  from 'path';
import prompts from "prompts";
import chalk from "chalk";
import { getGswlConfig, getTemplates, hasGswlFile, hasPath, saveGswlCongig } from "../utils";
import { getLogger } from "../logger";
import fs from 'fs';
import { chekServerPathRepeat, uploadFiles } from '../mtop/mtop';
const logger = getLogger("app");
async function input(message:string):Promise<string>{
    const res = await prompts({
      type: "text",
      name: 'name',
      message: message
    });
    logger.info(`输入了${message}:${res.name}`);
    if(!res.name){
        return await input(message);
    }
    return res.name;
}

async function readyUp(revise?:boolean) {
    let config = {} as any;
    if(hasGswlFile()){
        config = getGswlConfig();
    }
    if(!config.url){
        const url = await input('发布url');
        config.url = url;
    }
    if(!config.workName){
        const workName = await input('业务名');
        config.workName = workName;
    }
    if(!config.pageName || revise){
        const pageName = await input('页面名');
        config.pageName = pageName;
    }
    saveGswlCongig(config);
    let hasdir = await chekServerPathRepeat(config);
    if(hasdir){
        console.warn("服务器上存在相同的文件路径确认是否覆盖");
        const result = await input("确认覆盖服务器上对应路径吗？YES/NO");
        if(result !== "YES"){
            await readyUp(true);
        }
    }
}
  
export default async function(){
    const dirname = process.cwd();
    
    const filePath = path.join(dirname,'/build/web');
    if(!await hasPath(filePath)){
        console.error('文件目录不存在',filePath);
        return;
    }
    await readyUp();
    // return
    console.log('开始上传')
    let success = await uploadFiles(filePath);
    if(success){
        console.log('上传成功')
    }else{
        console.log('上传失败')
    }
}
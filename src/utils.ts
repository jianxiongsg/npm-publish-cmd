import fs from "fs";
import path from "path";

/**
 * 获得模板列表
 */
export function getTemplates() {
    try {
        return JSON.parse(fs.readFileSync(path.resolve(__dirname, "../templates/index.json")).toString());
    } catch (e) {
        console.log("加载模板库失败");
    }
}

/**
 * 获得package.json内容
 */
export function getPackage() {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json")).toString());
}

/**
 * 获得gswl.json内容
 */
const gswlFilePath = path.resolve(__dirname, "../.gswl.json");
export function getGswlConfig() {
    try {
        return JSON.parse((fs.readFileSync(gswlFilePath)).toString());
    } catch (error) {
        return {}
    }
}

/**
 * 判断是否存在gswl.json文件
 */

export function hasGswlFile(){
    try {
        let stat = fs.statSync(gswlFilePath);
        return stat?.isFile();
    } catch (error) {
        return false
    }
    
}

export function saveGswlCongig(info:{[key:string]:string}){
    try {
        fs.writeFileSync(gswlFilePath,JSON.stringify(info))
    } catch (error) {
        console.log(error)
    }
    
}


/**
 * 读取路径信息
 * @param {string} filePath 路径
 */
 function getStat(filePath:string):Promise<fs.Stats>{
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
            if(err){
                resolve(null);
            }else{
                resolve(stats);
            }
        })
    })
}
 
/**
 * 创建路径
 * @param {string} dir 路径
 */
function mkdir(dir:string):Promise<boolean>{
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            if(err){
                resolve(false);
            }else{
                resolve(true);
            }
        })
    })
}

/**
 * 是否存在路径
 * @param {string} dir 路径
 */
export async function hasPath(dir:string){
    let isExists = await getStat(dir);
    //如果该路径且不是文件，返回true
    if(isExists && (isExists.isDirectory() || isExists.isFile())){
        return true;
    }
    return false;
}

/**
 * 路径是否存在，不存在则创建
 * @param {string} filePath 路径
 */
export async function dirExists(dir:string){
    let isExists = await getStat(dir);
    //如果该路径且不是文件，返回true
    if(isExists && isExists.isDirectory()){
        return true;
    }else if(isExists){     //如果该路径存在但是文件，返回false
        return false;
    }
    //如果该路径不存在
    let tempDir = path.parse(dir).dir;      //拿到上级路径
    //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
    let status = await dirExists(tempDir);
    let mkdirStatus;
    if(status){
        mkdirStatus = await mkdir(dir);
    }
    return mkdirStatus;
}


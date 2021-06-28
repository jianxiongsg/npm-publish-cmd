import getInstance from "./www";
import fs from 'fs';
import path from 'path';
import { getGswlConfig } from "../utils";
const FormData = require('form-data');

function createFormDataByPath(path:string){
    try {
        const formdata = new FormData();
        function readyDir(nextPath:string) {
            let pa = fs.readdirSync(nextPath);
            pa.forEach(function(pname,index){
                let filename = nextPath+"/"+pname;
                let stat = fs.statSync(filename)	
                if(stat.isDirectory()){
                    readyDir(filename);
                }else{
                    let newpath = filename.replace(path,'');
                    console.log('.........will up file',newpath)
                    formdata.append(newpath, fs.createReadStream(filename));
                }	
            })
        }
        readyDir(path);
        return formdata
    } catch (error) {
        console.log(error)
        return null;
    }
	
}

function convertData(options:{[key:string]:string}) {
    let params = '?'
    for(let key in options){
        params += key + '=' + options[key]+"&";
    }
    params = params.substr(0,params.length-1);
    return params;
}


export async function chekServerPathRepeat(data:any){
    return new Promise((resove,reject)=>{
    getInstance().get(`/pub/checkPath${convertData(data)}`).then((res:any)=>{
        if(res?.msg === "success" && res?.data?.hasDir){
            resove(true);
        }else{
            resove(false)
        }
        
    }).catch((err)=>{
        console.log("...............err",err)
        resove(false);
    })
    })
}

export async function uploadFiles(filePath:any){
    return new Promise((resove,reject)=>{
        const formData = createFormDataByPath(filePath)
        if(!formData){
            resove(false);
            return
        }
        getInstance().post(
            '/pub/upfiles',
            formData, 
            { headers: formData.getHeaders()}
        ).then((res:any)=>{
            console.log('..............upfiles res',res)
            if(res.msg === "success"){
                resove(true);
            }else{
                resove(false);
            }
        }).catch((err)=>{
            resove(false)
        })
    })
}
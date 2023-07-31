// getFile.mjs
// 
// get newest or oldest file in directory

import fs from 'node:fs';
import path from 'node:path';

function getFileNewest (dirname, extension) {
    let matchedFiles = [];

    for (const file of fs.readdirSync(dirname)) {
        if (file.endsWith(`${extension}`)) {
            let fullpath = path.join(dirname, file)
            let modtime = fs.statSync(fullpath).mtimeMs;
            matchedFiles.push(fullpath);
            // console.log(modtime);
        }
    }
    
    // order by modification time
    matchedFiles.sort((f1, f2) => fs.statSync(f1).mtimeMs - fs.statSync(f2).mtimeMs);
    
    const newestFile = matchedFiles[0];
    // console.log("\n", `newest file: ${newestFile}`);
    return newestFile;
}

function getFilesSorted(dirname, extension) {
    let fileList = fs.readdirSync(dirname)
        .filter( (fname) => (path.extname(fname) == extension))
        .map( (fname) => path.join(dirname, fname));
    // sort by modification time
    fileList.sort((file1, file2) => -(fs.statSync(file1).mtimeMs - fs.statSync(file2).mtimeMs));
    let out = fileList.map( (fn) => [fs.statSync(fn).mtimeMs/1000, fn]);
    return out;
}

export { getFileNewest, getFilesSorted };



// tst_getFile.js
import fs from "fs";
import path from "path";
import { getFileNewest, getFilesSorted } from "./getFile.js";

const dirname = "C:/Users/micha/projects/nodejs/server_experiments/NodeJS/public/images/gallery";
const extension = ".jpg";

let newestFile = getFileNewest(dirname, extension);

console.log(newestFile);
console.log(`does it exist: ${fs.existsSync(newestFile)}`);
console.log(`modification time: ${fs.statSync(newestFile).mtimeMs/1000}`);

// list ordered files
let sortedFiles = getFilesSorted(dirname, extension);

console.log('\n');
for (let item of sortedFiles) {
    console.log(item);
}

// newest entry -> largest mtime value comes first:
console.log(`\nnewest file [mtime_s, file]: ${sortedFiles[0][0]} :: ${sortedFiles[0][1]}}`);
// accessing elements via destructuring
let mt, fn;
[mt, fn] = sortedFiles[0];
console.log(`mt: ${mt} , fn: ${fn}`);

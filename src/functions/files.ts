const path = require('path');
const fs = require('fs');

export const moveFile = ({
                           oldFolder,
                           oldFile,
                           newFolder,
                           newFile
                         }: { oldFolder: string, oldFile: string, newFolder: string, newFile: string }) => {

  const oldPath = path.join(__dirname, '../../uploads', oldFolder, oldFile);
  const newPath = path.join(__dirname, '../../uploads', newFolder, newFile);

  // check if file exists in oldPath
  if (!(fs.existsSync(oldPath))) return {errMsg: 'Cannot find file to move'};

  try {
    fs.renameSync(oldPath, newPath);
    return {path: path.join(newFolder, newFile)};
  } catch (err) {
    console.error(err);
    return {errMsg: `Error in moving file to "${newFolder}" folder`};
  }
};

export const formatFileName = (fileName: string | number): string => {
    // replaces everything which is not letter or number to underscore _
    return String(fileName).replace(/[^a-z0-9]/gi, '_');
}
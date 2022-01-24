import express from 'express';
import DocCtrl from '../controllers/document.controller';
const path = require('path');
const formidable = require('formidable');

const router = express.Router();

router.get('/', async (req, res) => {
  const ctrl = new DocCtrl();
  const response = await ctrl.getDocuments(req.query.transactionId);
  return res.json(response);
});

router.post('/', async (req, res) => {

  const folder = path.join(__dirname, '../../uploads/temp');
  console.log('-- folder:', folder);

  const form = formidable({
    keepExtensions: true,
    uploadDir: folder,
    allowEmptyFiles: false,
    // @ts-ignore
    filename: function (name, ext, part, form) {
      // console.log('-- name:', name);
      // console.log('-- part.name:', part.name);
      // console.log('-- ext:', ext);

      // part.name needed on return, should not be empty
      if (!part.name.trim()) part.name = name;
      // replace all spaces with _
      part.name = part.name.trim().replace(/\s+/g, '_');
      // append with random string to prevent overriding
      part.name = `${(Math.random() + 1).toString(36).substring(5)}.${part.name}`;

      const fileNameWithExt = `${part.name}${ext}`;

      // if (fs.existsSync(path.join(folder, fileNameWithExt))) {
      //   console.log('!!!!!! EXISTS');
      // } else {
      //   console.log('!!!!!! does not exist');
      // }

      return fileNameWithExt;
    },
  });

  // @ts-ignore
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('** ERROR:', err);
      return res.json({errMsg: 'Failed to save file!'});
    }

    const firstFileKey = Object.keys(files)[0];
    const newFilename = files[firstFileKey].newFilename;

    return res.json({fileInTemp: newFilename})
  });


});

export default router;
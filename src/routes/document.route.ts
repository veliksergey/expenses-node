import express from 'express';
import DocCtrl from '../controllers/document.controller';

const path = require('path');
// const formidable = require('formidable');
import formidable, {errors as formidableErrors} from 'formidable';
import {formatFileName} from "../functions/files";

const router = express.Router();

interface IncomingFormWithFields {
	fields: {
		fileName: string[],
		amount: string[],
		transactionId: string[],
		projectName: string[],
	},
}

router.get('/', async (req, res) => {
	const ctrl = new DocCtrl();
	const response = await ctrl.getDocuments(req.query.transactionId);
	return res.json(response);
});

router.post('/', async (req, res) => {

	return res.json({
		message: 'code deleted',
	});

	/*const folder = path.join(__dirname, '../../uploads/temp');

	const form = formidable({
		keepExtensions: true,
		uploadDir: folder,
		allowEmptyFiles: false,
		// @ts-ignore
		filename: function (name, ext, part, form) {

			// part.name needed on return, should not be empty
			if (!part.name.trim()) part.name = name;
			// replace all spaces with _
			part.name = part.name.trim().replace(/\s+/g, '_');
			// append with random string to prevent overriding
			part.name = `${(Math.random() + 1).toString(36).substring(5)}.${part.name}`;

			const fileNameWithExt = `${part.name}${ext}`;

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
	});*/


});

router.post('/upload', async (req, res) => {

	const tempFolder = path.join(__dirname, '../../uploads/temp');

  const form = formidable({
		uploadDir: tempFolder,
		keepExtensions: true,
    // @ts-ignore
		filename: function (name, ext, part, form: IncomingFormWithFields) {

      // transactionId.fileName.amount.random7characters.ext 123.some_file_name.34_56.npq21er.pdf
			const fileName: string =
`${form.fields.transactionId[0]}.
${formatFileName(form.fields.fileName[0] || name)}.
${formatFileName(form.fields.amount[0])}.
${(Math.random() + 1).toString(36).substring(5)}
${ext}`;
      return fileName;
		},
	});

	form.parse(req, (err, fields, files) => {
		if (err) {
      console.error('** ERROR:', err);
			return res.status(err?.httpCode || 400)
				.json({errMsg: String(err)});
		}
		res.json({fields, files});
	})

	/*const form = formidable({});
	let fields;
	let files;
	try {
		[fields, files] = await form.parse(req);
		console.log('-- try fields:', fields);
		console.log('-- try files:', files);
	} catch (err) {
		console.error(err);
		// @ts-ignore
		return res.status(err?.httpCode || 400)
				.json({errMsg: String(err)});
	}*/

});

export default router;
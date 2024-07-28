import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Configure multer for S3 upload
const upload = multer({
	storage: multerS3({
		s3: s3Client,
		bucket: "novel-bucket",
		key: function (req, file, cb) {
			cb(null, "novels/" + Date.now().toString() + "-" + file.originalname);
		},
	}),
});

export default upload;

import AWS from 'aws-sdk'
import multer from 'multer';
import multerS3 from 'multer-s3';

import {config} from 'dotenv'

config()

const bucket = process.env.DO_BUCKET_NAME || "";
const endpoint = process.env.DO_BUCKET_ENDPOINT || "";
const accessKeyId = process.env.DO_SPACE_KEY
const secretAccessKey = process.env.DO_SPACE_SECRET_KEY

const spacesEndpoint = new AWS.Endpoint(endpoint);
export const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId,
  secretAccessKey
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket,
        acl: "public-read",
        key: function (req, file, cb) {
            const imageName = "profile-" + req.profile.id + "/" + file.originalname;

            req.imageName = imageName;

            cb(null, imageName);
        }
    })
}).array('image', 1);

export default upload;
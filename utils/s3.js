require("dotenv").config();
const FS = require("fs");
const S3 = require("aws-sdk/clients/s3");

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const SECRET_KEY = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region: BUCKET_REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
});

// Upload file to S3
function uploadFile(file) {
  const UPLOAD_PARAMS = {
    Bucket: BUCKET_NAME,
    Body: file.file.data,
    Key: file.file_name,
    ACL: "public-read"
  };
  return new Promise((resolve, reject) => {
    s3.upload(UPLOAD_PARAMS)
    .promise()
    .then(data => {
      resolve(data.Location)
    })
    .catch(error => {
      reject(error);
    });
  }) 
}

// Download a file from S3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}

module.exports = {
  getFileStream,
  uploadFile
}

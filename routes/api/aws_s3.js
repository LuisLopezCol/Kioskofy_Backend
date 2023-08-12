const AWS_S3 = require("../../controllers/aws_s3_controller");

module.exports = function (router) {
  router.post(
    "/aws_s3/portfolio",
    //passport.authenticate('jwt', { session: false }),
    AWS_S3.uploadImages
  );
};

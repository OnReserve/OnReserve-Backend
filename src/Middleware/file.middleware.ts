import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
});

export const companyFilesMiddleware = upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "coverPic", maxCount: 1 },
]);

export const profileFilesMiddleware = upload.fields([
  { name: "profilePic", maxCount: 1 },
]);

export const eventFilesMiddleware = upload.array("images");
import multer from "multer";

export const upload = multer({
	storage: multer.memoryStorage(),
});

export const companyFilesMiddleware = upload.fields([
	{ name: "profilePic", maxCount: 1 },
	{ name: "coverPic", maxCount: 1 },
]);

export const eventFilesMiddleware = upload.array("images");

export type ICompanyFiles = {
	coverPic?: Express.Multer.File[];
	profilePic?: Express.Multer.File[];
};

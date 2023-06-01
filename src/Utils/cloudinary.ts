import cloudinary from "cloudinary";
import DataURIParser from "datauri/parser.js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const parser = new DataURIParser();

export const uploadImage = async (
	image: Express.Multer.File,
	folder: string
) => {
	const base64Image = parser.format(
		path.extname(image.originalname).toString(),
		image.buffer
	);
	if (base64Image.content) {
		const uploadImage = await cloudinary.v2.uploader.upload(
			base64Image.content,
			{
				folder,
				resource_type: "auto",
			}
		);
		return uploadImage;
	}
	return undefined;
};

export const uploadQR = async (qr: string, folder: string) => {
	const uploadImage = await cloudinary.v2.uploader.upload(qr, {
		folder,
		resource_type: "auto",
	});

	return uploadImage;
};

export { cloudinary };

import cloudinary from 'cloudinary';
import asyncHandler from '../functions/asyncHandler.js';

import fetchVideoMeta from "../functions/fetchVideoMeta.js";

import Category from '../models/categoryModel.js';
import Video from '../models/videoModel.js';


export const saveLink = asyncHandler(async (req, res) => {
	const { url, categoryName } = req.body;

	console.log(categoryName + ' - ' + url);

	const category = await Category.findOne({ name: categoryName });
	if (!category) throw new Error(404);

	const meta = await fetchVideoMeta(url);

	const createdVideo = new Video({ ...meta, categories: [category._id] });
	category.items.push(createdVideo._id);

	const uploadedImage = await cloudinary.v2.uploader.upload(
		meta.video.cover,
		{ public_id: 'tiktok-saver/' + createdVideo._id }
	);

	createdVideo.video.cover = uploadedImage.secure_url;

	console.log(createdVideo);

	await createdVideo.save();
	await category.save();

	res.status(200).send(createdVideo);
});




export const getAllCategories = asyncHandler(async (req, res) => {
	const { onlyNames, onlyIds } = req.query;
	const categories = await Category.find({});

	let data;

	if (onlyNames) data = categories.map(cat => cat.name);
	else if (onlyIds) data = categories.map(cat => cat._id);
	else data = categories;

	res.send(data);
});




export const getVideosFromCategory = asyncHandler(async (req, res) => {
	const { name } = req.params;
	if (!name) throw new Error(400);

	const { onlyLinks, start = 0, amnt = 20 } = req.query;

	const category = await Category.findOne({ name });
	if (!category) throw new Error(404);

	const data = [];
	await Promise.all(category.items.map(videoId => new Promise(async (resolve, reject) => {
		try {
			const video = await Video.findById(videoId);

			if (onlyLinks === 'true') data.push(video.url);
			else data.push(video);

			resolve();
		} catch (err) {
			console.error(err);
			reject();
		}
	})));

	res.send(data);
})




export const createCategory = asyncHandler(async (req, res) => {
	const {
		name,
		items = [],
	} = req.body;

	const createdCategory = await Category.create({
		name,
		items,
	});

	res.send(createdCategory);
})

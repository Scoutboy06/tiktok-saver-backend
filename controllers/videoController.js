import asyncHandler from 'express-async-handler';

import fetchVideoMeta from "../functions/fetchVideoMeta.js";
import { removeCache } from '../middlewares/cache.js';

import Category from '../models/categoryModel.js';
import Video from '../models/videoModel.js';



export const getVideoMeta = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const video = await Video.findById(id);
	if (!video) throw new Error(404);

	const category = await Category.findById(video.categories[0]);

	const data = await fetchVideoMeta(video.url);
	res.send({ ...data, _id: video._id, category: { _id: category._id, name: category.name } });
});




export const deleteVideo = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const video = await Video.findById(id).catch(err => { throw new Error(404) });
	if (!video) throw new Error(404);

	const category = await Category.findById(video.categories[0]);
	const index = category.items.indexOf(video._id);
	if (index > -1) {
		category.items.splice(index, 1);
		await category.save();
	}

	await video.delete();
	res.sendStatus(200);

	console.log(req.originalUrl);
	removeCache('__express__' + (req.originalUrl || req.url));
	removeCache('__express__' + '/api/categories/' + category.name);
});
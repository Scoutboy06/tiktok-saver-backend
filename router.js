import { Router } from 'express';
import {
	saveLink,
	getAllCategories,
	createCategory,
	getVideosFromCategory,
} from './controllers/categoryController.js';
import {
	getVideoMeta,
	deleteVideo,
} from './controllers/videoController.js';
import cache from './middlewares/cache.js';

const router = Router();

router.get('/', (req, res) => res.send('Hello there!'));

router.route('/videos')
	.post(saveLink);

router.route('/videos/:id')
	.get(cache(60 * 60), getVideoMeta)
	.delete(deleteVideo);

router.route('/categories')
	.get(cache(60 * 60), getAllCategories)
	.post(createCategory);

router.route('/categories/:name')
	.get(cache(60 * 60), getVideosFromCategory);


export default router;
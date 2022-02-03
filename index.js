import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cloudinary from 'cloudinary';
import cors from 'cors';

import connectDB from './config/db.js';
import router from './router.js';

dotenv.config();

connectDB();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const whitelist = ['http://localhost:3000', 'https://tiktok-saver-frontend.vercel.app'];

app.use(cors({
	origin: (origin, callback) => {
		if (whitelist.indexOf(origin) !== -1) callback(null, true);
		else callback(new Error('Not allowed by CORS'));
	}
}));

app.use(morgan('dev'));
app.use(express.json());
app.use('/', router);


const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
	console.log(`Server running on http://127.0.0.1:${PORT}`);
});

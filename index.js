// import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cloudinary from 'cloudinary';

import connectDB from './config/db.js';
import router from './router.js';

// const __dirname = path.resolve();

dotenv.config();
// dotenv.config({ path: path.resolve(__dirname, 'local.env') });

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/api', router);


const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
	console.log(`Server running on http://127.0.0.1:${PORT}`);
});
import mongoose from 'mongoose';


const MODEL_NAME = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		items: [
			{ type: mongoose.Types.ObjectId }
		],
	},
	{
		timestamps: false,
	}
);


const Category = mongoose.model('Category', MODEL_NAME);

export default Category;
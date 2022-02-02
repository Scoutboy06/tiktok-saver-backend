import mongoose from 'mongoose';


const string_required = { type: String, required: true };
const number_required = { type: Number, required: true };
const boolean_required = { type: Boolean, required: true };

const string_optional = { type: String, required: false };
const number_optional = { type: Number, required: false };


const videoSchema = mongoose.Schema(
	{
		url: string_required,
		id: string_required,
		desc: string_optional,
		createTime: string_required,
		video: {
			id: string_required,
			height: number_required,
			width: number_required,
			duration: number_required,
			ratio: string_required,
			cover: string_required,
			// dynamicCover: string_required,
			// playAddr: string_required,
			// downloadAddr: string_required,
			format: string_required,
		},
		author: {
			id: string_required,
			nickname: string_required,
			// avatarThumb: string_required,
		},
		music: {
			id: string_required,
			title: string_required,
			playUrl: string_required,
			authorName: string_required,
			original: boolean_required,
			duration: number_required,
		},
		stats: {
			diggCount: number_optional,
			shareCount: number_optional,
			commentCount: number_optional,
			playCount: number_optional,
		},
		categories: [
			{ type: mongoose.Types.ObjectId }
		],
	},
	{
		timestamps: true,
	}
);


const Video = mongoose.model('Video', videoSchema);

export default Video;
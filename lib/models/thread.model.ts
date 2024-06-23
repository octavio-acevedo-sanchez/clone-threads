import mongoose, { type Date, type Types } from 'mongoose';

export interface IThread {
	_id: string;
	text: string;
	author: Types.ObjectId;
	community: Types.ObjectId;
	createdAt: Date;
	parentId: string;
	children: Types.ObjectId[];
}

const threadSchema = new mongoose.Schema<IThread>({
	text: { type: String, required: true },
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	community: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Community'
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	parentId: {
		type: String
	},
	children: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Thread'
		}
	]
});

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);

export default Thread;

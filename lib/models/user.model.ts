import mongoose, { type Types } from 'mongoose';

export interface IUser {
	_id: string;
	id: string;
	username: string;
	name: string;
	image: string;
	bio: string;
	threads: Types.ObjectId[];
	onboarded: boolean;
	communities: Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>({
	id: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	image: String,
	bio: String,
	threads: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Thread'
		}
	],
	onboarded: { type: Boolean, default: false },
	communities: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Community'
		}
	]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

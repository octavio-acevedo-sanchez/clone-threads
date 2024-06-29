'use server';

import User, { type IUser } from '@/lib/models/user.model';
import { connectToDB } from '@/lib/mongoose';
import { revalidatePath } from 'next/cache';
import Thread from '@/lib/models/thread.model';

interface Props {
	userId: string;
	username: string;
	name: string;
	bio: string;
	image: string;
	path: string;
}

export async function updateUser({
	userId,
	username,
	name,
	bio,
	image,
	path
}: Props): Promise<void> {
	await connectToDB();

	try {
		await User.findOneAndUpdate(
			{ id: userId },
			{ username: username.toLowerCase(), name, bio, image, onboarded: true },
			{ upsert: true }
		);

		if (path === '/profile/edit') {
			revalidatePath(path);
		}
	} catch (error: any) {
		throw new Error(`Failed to create/update user: ${error.message}`);
	}
}

export async function fetchUser(userId: string): Promise<IUser | null> {
	try {
		await connectToDB();

		return await User.findOne({ id: userId });
		// .populate({
		// 	path: 'communities',
		// 	model: Community
		// })
	} catch (error: any) {
		throw new Error(`Failed to fetch user: ${error.messange}`);
	}
}

export async function fetchUserPosts(userId: string): Promise<IUser | null> {
	try {
		await connectToDB();

		const threads = await User.findOne({ id: userId }).populate({
			path: 'threads',
			model: Thread,
			populate: {
				path: 'children',
				model: Thread,
				populate: {
					path: 'author',
					model: User,
					select: 'name image id'
				}
			}
		});

		// console.log(threads);
		return threads;
	} catch (error: any) {
		throw new Error(`Failed to fetch user: ${error.messange}`);
	}
}

'use server';

import User, { type IUser } from '@/lib/models/user.model';
import { connectToDB } from '@/lib/mongoose';
import { revalidatePath } from 'next/cache';
import Thread, { type IThreadInfo } from '@/lib/models/thread.model';
import type { SortOrder, FilterQuery } from 'mongoose';

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
		console.error('Failed to create/update user:', error);
		throw error;
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
		console.error('Failed to fetch user:', error);
		throw error;
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
		console.error('Failed to fetch user:', error);
		throw error;
	}
}

export async function fetchUsers({
	userId,
	searchString = '',
	pageNumber = 1,
	pageSize = 20,
	sortBy = 'desc'
}: {
	userId: string;
	searchString?: string;
	pageNumber?: number;
	pageSize?: number;
	sortBy?: SortOrder;
}): Promise<{ users: IUser[]; isNext: boolean } | null> {
	try {
		await connectToDB();

		const skipAmount = (pageNumber - 1) * pageSize;

		const regex = new RegExp(searchString, 'i');

		const query: FilterQuery<typeof User> = {
			id: { $ne: userId }
		};

		if (searchString.trim() !== '') {
			query.$or = [
				{ username: { $regex: regex } },
				{ name: { $regex: regex } }
			];
		}

		const sortOptions = { createdAt: sortBy };

		const usersQuery = User.find(query)
			.sort(sortOptions)
			.skip(skipAmount)
			.limit(pageSize);

		const totalUsersCount = await User.countDocuments(query);

		const users = await usersQuery.exec();

		const isNext = totalUsersCount > skipAmount + users.length;

		console.log(users);
		return { users, isNext };
	} catch (error: any) {
		console.error('Error fetching users:', error);
		throw error;
	}
}

export async function getActivity(
	userId: string
): Promise<IThreadInfo[] | null> {
	try {
		await connectToDB();

		const userThreads = await Thread.find({ author: userId });

		const childThreadIds = userThreads.reduce((acc, userThread) => {
			return acc.concat(userThread.children);
		}, []);

		const replies = await Thread.find({
			_id: { $in: childThreadIds },
			author: { $ne: userId }
		}).populate({
			path: 'author',
			model: User,
			select: 'name image _id'
		});

		return replies;
	} catch (error) {
		console.error('Error fetching replies: ', error);
		throw error;
	}
}

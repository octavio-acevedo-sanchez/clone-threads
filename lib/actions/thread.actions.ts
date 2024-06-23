'use server';

import { connectToDB } from '@/lib/mongoose';
import Thread, { type IThread } from '@/lib/models/thread.model';
import User from '@/lib/models/user.model';
import { revalidatePath } from 'next/cache';

interface Params {
	text: string;
	author: string;
	communityId: string | null;
	path: string;
}

export async function createThread({
	text,
	author,
	communityId,
	path
}: Params): Promise<void> {
	try {
		await connectToDB();

		const createdThread = await Thread.create({
			text,
			author,
			community: null
		});

		// Update user model
		await User.findByIdAndUpdate(author, {
			$push: { threads: createdThread._id }
		});

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Error creating thread: ${error.message}`);
	}
}

export async function fetchPosts(
	pageNumber = 1,
	pageSize = 2
): Promise<{ posts: IThread[]; isNext: boolean }> {
	await connectToDB();

	const skipAmount = (pageNumber - 1) * pageSize;

	const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
		.sort({
			createdAt: 'desc'
		})
		.skip(skipAmount)
		.limit(pageSize)
		.populate({ path: 'author', model: User })
		.populate({
			path: 'children',
			populate: {
				path: 'author',
				model: User,
				select: '_id name parentId image'
			}
		});

	const totalPostCount = await Thread.countDocuments({
		parentId: { $in: [null, undefined] }
	});

	const posts = await postQuery.exec();

	const isNext = totalPostCount > skipAmount + posts.length;

	return { posts, isNext };
}

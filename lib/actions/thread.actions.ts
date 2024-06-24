'use server';

import { connectToDB } from '@/lib/mongoose';
import Thread, { type IThreadInfo } from '@/lib/models/thread.model';
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
): Promise<{ posts: IThreadInfo[]; isNext: boolean }> {
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

export async function fetchThreadById(id: string): Promise<IThreadInfo> {
	await connectToDB();

	try {
		const thread = await Thread.findById(id)
			.populate({
				path: 'author',
				model: User,
				select: '_id id name image'
			})
			.populate({
				path: 'children',
				populate: [
					{
						path: 'author',
						model: User,
						select: '_id id name parentId image'
					},
					{
						path: 'children',
						model: Thread,
						populate: {
							path: 'author',
							model: User,
							select: '_id id name parentId image'
						}
					}
				]
			})
			.exec();

		// console.log(thread);
		return thread;
	} catch (error: any) {
		throw new Error(`Error fetching thread: ${error.message}`);
	}
}

export async function addCommentToThread(
	threadId: string,
	commentText: string,
	userId: string,
	path: string
): Promise<void> {
	await connectToDB();

	try {
		const originalThread = await Thread.findById(threadId);

		if (!originalThread) {
			throw new Error('Thread not found');
		}

		const commentThread = new Thread({
			text: commentText,
			author: userId,
			parentId: threadId
		});

		const savedCommentThread = await commentThread.save();

		originalThread.children.push(savedCommentThread._id);

		await originalThread.save();

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Error adding comment to thread: ${error.message}`);
	}
}

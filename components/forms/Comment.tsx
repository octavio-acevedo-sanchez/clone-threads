'use client';

import type * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePathname } from 'next/navigation';
import { CommentValidation } from '@/lib/validations/thread';
import Image from 'next/image';
import { addCommentToThread } from '@/lib/actions/thread.actions';

interface Props {
	threadId: string;
	currentUserImg: string;
	currentUserId: string;
}

const Comment = ({
	threadId,
	currentUserImg,
	currentUserId
}: Props): React.ReactNode => {
	const pathname = usePathname();

	const form = useForm({
		resolver: zodResolver(CommentValidation),
		defaultValues: {
			thread: ''
		}
	});

	const onSubmit = async (
		values: z.infer<typeof CommentValidation>
	): Promise<void> => {
		await addCommentToThread(threadId, values.thread, currentUserId, pathname);

		form.reset();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='comment-form'>
				<FormField
					control={form.control}
					name='thread'
					render={({ field }) => (
						<FormItem className='flex w-full items-center gap-3'>
							<FormLabel>
								<Image
									src={currentUserImg}
									alt='Profile image'
									width={48}
									height={48}
									className='rounded-full object-cover'
								/>
							</FormLabel>
							<FormControl className='border-none bg-transparent'>
								<Input
									type='text'
									placeholder='Comment...'
									className='no-focus text-light-1  outline-none'
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button type='submit' className='comment-form_btn'>
					Reply
				</Button>
			</form>
		</Form>
	);
};

export default Comment;

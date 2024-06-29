import { fetchUserPosts } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import ThreadCard from '../cards/ThreadCard';

interface Props {
	currentUserId: string;
	accountId: string;
	accountType: string;
}
const ThreadsTab = async ({
	currentUserId,
	accountId,
	accountType
}: Props): Promise<JSX.Element> => {
	let result = await fetchUserPosts(accountId);

	if (!result) redirect('/');

	return (
		<section className='mt-9 flex flex-col gap-10'>
			{result.threads.map(thread => (
				<ThreadCard
					key={thread._id}
					id={thread._id}
					currentUserId={currentUserId}
					parentId={thread.parentId}
					content={thread.text}
					author={
						accountType === 'User'
							? { name: result.name, image: result.image, id: result.id }
							: { name: thread.name, image: thread.image, id: thread.author.id }
					}
					community={thread.community}
					createdAt={thread.createdAt}
					comments={thread.children}
				/>
			))}
		</section>
	);
};

export default ThreadsTab;

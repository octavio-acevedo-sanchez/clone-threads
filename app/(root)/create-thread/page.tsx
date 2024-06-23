import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';
import PostThread from '@/components/forms/PostThread';

const Page = async (): Promise<JSX.Element | null> => {
	const user = await currentUser();

	if (!user) return null;

	const userInfo = await fetchUser(user.id);

	if (!userInfo?.onboarded) redirect('/onboarding');

	return (
		<>
			<h1 className='head-text'>Create Thread</h1>

			<PostThread userId={userInfo._id} />
		</>
	);
};

export default Page;

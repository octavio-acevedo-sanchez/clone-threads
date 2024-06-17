import { UserButton } from '@clerk/nextjs';

const OnBoardingPage = () => {
	return (
		<div className='text-white'>
			OnBoardingPage <UserButton afterSignOutUrl='/' />
		</div>
	);
};

export default OnBoardingPage;

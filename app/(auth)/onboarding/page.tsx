import { UserButton } from '@clerk/nextjs';

const OnBoardingPage = (): React.ReactNode => {
	return (
		<div className='text-white'>
			OnBoardingPage <UserButton afterSignOutUrl='/' />
		</div>
	);
};

export default OnBoardingPage;

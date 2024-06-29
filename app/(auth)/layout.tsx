const AuthLayout = ({
	children
}: {
	children: React.ReactNode;
}): React.ReactNode => {
	return (
		<div className='h-full bg-dark-1 w-full flex justify-center items-center'>
			{children}
		</div>
	);
};

export default AuthLayout;

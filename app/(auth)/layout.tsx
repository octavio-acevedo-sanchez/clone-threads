const AuthLayout = ({
	children
}: {
	children: React.ReactNode;
}): React.ReactNode => {
	return <div className='h-full  bg-dark-1'>{children}</div>;
};

export default AuthLayout;

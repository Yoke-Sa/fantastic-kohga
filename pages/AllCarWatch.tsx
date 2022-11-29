import { useRouter } from 'next/router';
import _BaseButton from '../component/atoms/button/_BaseButton';

const AllCarWatch = () => {
	const router = useRouter();
	const onClickBack = () => {
		router.push('/CarManager');
	};
	return (
		<>
			<header>
				<h1>車一覧</h1>

				<_BaseButton
					onClick={onClickBack}
					_class="button exit-btn">
					戻る
				</_BaseButton>
			</header>
		</>
	);
};
export default AllCarWatch;

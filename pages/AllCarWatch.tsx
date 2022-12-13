import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import _BaseButton from '../component/atoms/button/_BaseButton';
import { useModal } from '../component/hooks/useModal';
import { AdminIdContext } from './_app';

const getCarInfoUrl = 'http://saza.kohga.local:3001/getCarInfo';

const AllCarWatch: NextPage = () => {
	const modal = useModal();
	const router = useRouter();
	const { adminId } = useContext(AdminIdContext);

	const onClickBack = () => {
		router.push('/CarManager');
	};
	const getCarInfo = async () => {
		try {
			const res = await fetch(getCarInfoUrl);
			const result = await res.json();
			console.log('result', result);
		} catch (e) {
			modal.setContent(
				<>
					<p>通信エラー</p>
				</>
			);
			modal.open();
		}
	};
	return (
		<>
			{modal.show()}
			<header>
				<h1>車一覧</h1>

				<_BaseButton
					onClick={onClickBack}
					_class="button exit-btn">
					戻る
				</_BaseButton>
			</header>

			<div className="allCar-contents">
				<_BaseButton
					onClick={getCarInfo}
					_class="button allCar-btn">
					表示
				</_BaseButton>
			</div>
		</>
	);
};
export default AllCarWatch;

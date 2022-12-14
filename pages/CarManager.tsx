import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import _BaseButton from '../component/atoms/button/_BaseButton';
import { useModal } from '../component/hooks/useModal';
import { AdminIdContext } from './_app';

const EndAdminUrl = 'http://saza.kohga.local:3001/terminateAdmin';

interface ReqEndAdmin {
	adminId: string;
}
interface ResEndAdmin {
	succeeded: boolean;
}

const CarManager: NextPage = () => {
	const router = useRouter();
	const modal = useModal();
	const { adminId } = useContext(AdminIdContext);
	//adminIdを持ってるかどうかでページの表示を切り替えてください
	//戻を押した時にadmin終了POST
	const pathOkManager = () => {
		router.push('/PathOkManager');
	};
	const AllCarWatch = () => {
		router.push('/AllCarWatch');
	};

	const EndAdminData = {
		adminId: adminId,
	};
	const EndAdmin = async () => {
		try {
			const res = await fetch(EndAdminUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(EndAdminData),
			});
			const result = await res.json();
			if (result.succeeded) {
				router.push('/');
			} else {
				modal.setContent(
					<>
						<p>もう一度ボタンを押してください</p>
					</>
				);
				modal.open();
			}
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
			<div className="manage-page">
				<header>
					<h1>管理ページ</h1>
					<_BaseButton
						onClick={EndAdmin}
						_class="button exit-btn">
						TOPへ
					</_BaseButton>
				</header>

				<section
					onClick={pathOkManager}
					className="manage-btn">
					<h2>通行可能領域管理</h2>
					<p>通行可能領域の設定を行います。</p>
					<div className="img1" />
				</section>

				<section
					onClick={AllCarWatch}
					className="manage-btn">
					<h2>車一覧</h2>
					<p>登録済の車両一覧を表示します。</p>
					<div className="img2" />
				</section>

				{/* 
			<_BaseButton onClick={pathOkManager}>通行可能領域管理</_BaseButton>
			<_BaseButton onClick={AllCarWatch}>車一覧</_BaseButton> */}
			</div>
		</>
	);
};
export default CarManager;

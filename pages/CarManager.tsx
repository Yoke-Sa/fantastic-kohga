import { useRouter } from 'next/router';
import _BaseButton from '../component/atoms/button/_BaseButton';

const CarManager = () => {
	const router = useRouter();

	const pathOkManager = () => {
		router.push('/PathOkManager');
	};
	const allCarWatch = () => {
		router.push('/AllCarWatch');
	};
	const goBack = () => {
		router.push('/');
	};

	return (
		<>
			<div className="manage-page">
				<header>
					<h1>管理ページ</h1>
					<_BaseButton
						onClick={goBack}
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
					onClick={allCarWatch}
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

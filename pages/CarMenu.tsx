import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import _BaseButton from '../component/atoms/button/_BaseButton';
import { CheckBoxForm } from '../component/atoms/checkbox/checkBoxForm';
import { useModal } from '../component/hooks/useModal';
import { UserIdContext } from './_app';

const CarUseCheckUrl = 'http://saza.kohga.local:3001/isAcceptable';
const EndPageUrl = 'http://saza.kohga.local:3001/terminate';

interface Request {
	userId: string;
}
interface Response {
	succeeded: boolean;
	reason?: string;
}

const CarMenu: NextPage = () => {
	const router = useRouter();
	const modal = useModal();
	const { userId, setUserId } = useContext(UserIdContext);
	const PostData: Request = { userId: userId };

	// useEffect(() => {
	// 	if (userId === '') {
	// 		modal.setModalHander(() => router.push('/'));
	// 		modal.setContent(
	// 			<>
	// 				<h1>チートは辞めてください</h1>
	// 			</>
	// 		);
	// 		modal.open();
	// 	}
	// }, []);

	const autoEnd = async (e: BeforeUnloadEvent) => (e.returnValue = '');
	useEffect(() => {
		window.onbeforeunload = autoEnd;
	}, []);

	const onClickGenerator =
		(url: string, postUrl: string) =>
		async (e: React.MouseEvent<HTMLButtonElement>) => {
			const target = e.currentTarget;
			target.disabled = true;
			try {
				const res = await fetch(postUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(PostData),
				});
				const result = (await res.json()) as Response;
				if (result.succeeded) {
					router.push(url);
				} else {
					modal.setContent(
						<>
							<p>受け付けられません</p>
						</>
					);
				}
			} catch (e) {
				modal.setContent(
					<>
						<p>通信エラー</p>
					</>
				);
				console.log(e);
				modal.open();
			} finally {
				target.disabled = false;
			}
		};
	const onClickDesitination = onClickGenerator(
		'/Desitination',
		CarUseCheckUrl
	);

	const onClickExistsRoute = onClickGenerator('/ExistsRoute', CarUseCheckUrl);
	const onClickCarWatch = () => {
		router.push('/CarWatch');
	};
	const onClickEndPage = (e: React.MouseEvent<HTMLButtonElement>) => {
		window.onbeforeunload = () => void 0;
		const onClickEndPageInternal = onClickGenerator('/EndPage', EndPageUrl);
		onClickEndPageInternal(e);
	};

	const AsyncModal = (
		valueGenerator: (
			r: (arg0: any) => void
		) => React.SetStateAction<React.ReactNode>
	) =>
		new Promise<any>((r) => {
			modal.setContent(valueGenerator(r));
			modal.setModalHander(() => {
				modal.close();
				r(false);
			});
			modal.open();
		});
	// cssテスト用
	const goDest = () => {
		router.push('/Desitination');
	};
	const goExist = () => {
		router.push('/ExistsRoute');
	};
	const goWatch = () => {
		router.push('/CarWatch');
	};
	const goEnd = () => {
		router.push('/EndPage');
	};
	return (
		<>
			{modal.show()}
			<header>
				<h1>メニュー</h1>
				<_BaseButton
					// onClick={onClickEndPage}
					onClick={goEnd}
					_class="button exit-btn">
					終わり
				</_BaseButton>
			</header>

			<div className="car-menu">
				{/* <section onClick={onClickDesitination}> */}
				<section onClick={goDest}>
					<h2>新規ルート作成</h2>
					<p>地図上で任意の目的地を指定することができます。</p>
					<div className="img1" />
				</section>

				{/* <section onClick={onClickExistsRoute}> */}
				<section onClick={goExist}>
					<h2>既存ルート選択</h2>
					<p>既に定められた経路を選択して移動することができます。</p>
					<div className="img2" />
				</section>

				{/* <section onClick={onClickCarWatch}> */}
				<section onClick={goWatch}>
					<h2>車の状況確認</h2>
					<p>通信中の車体が現在どこにいるかを確認できます。</p>
					<div className="img3" />
				</section>
			</div>
		</>
	);
};
export default CarMenu;

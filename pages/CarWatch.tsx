import { LatLng } from 'leaflet';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useModal } from '../component/hooks/useModal';
import { UserIdContext } from './_app';
import _BaseButton from '../component/atoms/button/_BaseButton';

interface ReqMonitorCarData {
	userId: string;
}
interface ResMonitorCarData {
	succeeded: boolean;
	route: LatLng[][];
	dest?: LatLng[];
	arrival?: boolean;
	finish?: boolean;
	nowPoint?: LatLng;
	battery?: number;
	status?: boolean;
	arrange?: boolean;
	reserve?: boolean;
}
interface ReqProceedRouteData {
	userId: string;
}
interface ResProceedRouteData {
	succeeded: boolean;
}
interface ReqEndRoute {
	userId: string;
}
interface ResEndRoute {
	succeeded: boolean;
}

export const DynamicCarWatchMap = dynamic(
	() => {
		return import('../component/map/CarWatchMap');
	},
	{ ssr: false }
);

const CarWatchUrl = 'http://saza.kohga.local:3001/monitorCar';
const NextUrl = 'http://saza.kohga.local:3001/proceedRoute';
const endRouteUrl = 'http://saza.kohga.local:3001/endRoute';

const CarWatch: NextPage = () => {
	const router = useRouter();
	const modal = useModal();
	const { userId, setUserId } = useContext(UserIdContext);
	const [poly, setPoly] = useState<LatLng[][]>([]);
	const [dest, setDest] = useState<LatLng[]>([]);
	const [battery, setBattery] = useState<number>(0);
	const [timerId, setTimerId] = useState<NodeJS.Timeout>();
	const [arrival, setArrival] = useState<boolean>(false);
	const [finish, setFinish] = useState<boolean>(false);
	const [reserve, setReserve] = useState<boolean>(false);
	const [arrange, setArrange] = useState<boolean>(false);
	const [status, setStatus] = useState<boolean>(false);

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

	useEffect(() => {
		firstPost();
	}, []);

	const Data: ReqMonitorCarData = {
		userId: userId,
	};

	const firstPost = async () => {
		try {
			const res = await fetch(CarWatchUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(Data),
			});
			const result = (await res.json()) as ResMonitorCarData;
			if (result.succeeded) {
				if (result.route !== undefined) setPoly(result.route);
				if (result.dest !== undefined) setDest(result.dest);
				if (result.battery !== undefined) setBattery(result.battery);
				if (result.finish !== undefined) setFinish(result.finish);
				if (result.arrival !== undefined) setArrival(result.arrival);
				if (result.arrange !== undefined) setArrange(result.arrange);
				if (result.reserve !== undefined) setReserve(result.reserve);
				console.log('result.status', result.status);

				if (result.status) {
					console.log('生きてる');
				} else if (result.status === undefined) {
					modal.setContent(
						<>
							<p>
								車を確保できませんでした
								<br />
								もう一度車を確保します
							</p>
						</>
					);
					modal.open();
				} else {
					modal.setContent(
						<>
							<p>車が死にました</p>
						</>
					);
					modal.open();
					return;
				}
			} else {
				modal.setContent(
					<>
						<p>firstpost失敗</p>
					</>
				);
				modal.open();
				return;
			}
		} catch (e) {}
		console.log('settimeout');
		setTimerId(setTimeout(firstPost, 10000));
	};

	const onClickNextRoute = async () => {
		const NextRouteData: ReqProceedRouteData = {
			userId: userId,
		};
		console.log('onClickNextRoutetimerId', timerId);
		clearTimeout(timerId);
		const target = document.getElementById(
			'nextButton'
		) as HTMLButtonElement;
		target.disabled = true;
		const isok = await AsyncModal((r) => (
			<>
				<p>車両を次の目的地へ進めますか？</p>
				<div>
					<button
						onClick={() => {
							modal.close();
							r(true);
						}}>
						OK
					</button>
				</div>
			</>
		));

		try {
			if (isok) {
				const res = await fetch(NextUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(NextRouteData),
				});
				const result = (await res.json()) as ResProceedRouteData;
				console.log('result', result);
				if (result.succeeded) {
					modal.setContent(
						<>
							<p>次の目的地に進みました</p>
						</>
					);
					modal.open();
				}
			}
		} catch (e) {
			modal.setContent(
				<>
					<p>通信エラー</p>
				</>
			);
			modal.open();
		}
		target.disabled = false;
		firstPost();
	};
	const syousai = async () => {
		console.log('syousaitimerId', timerId);
		clearTimeout(timerId);
		await AsyncModal((r) => (
			<>
				<p>
					バッテリー
					{battery === undefined ? '------' : String(battery)}%
					{battery < 30 ? 'バッテリーやべーよ' : ''}
				</p>
				<p>経路進捗33333%</p>
			</>
		));
		firstPost();
	};
	const CarEnd = async () => {
		clearTimeout(timerId);
		console.log('carendtimerId', timerId);
		const endisOk = await AsyncModal((r) => (
			<>
				<p>車を使うのを本当にやめますか？</p>
				<button
					onClick={() => {
						modal.close();
						r(true);
					}}>
					OK
				</button>
			</>
		));
		if (!endisOk) {
			firstPost();
			return;
		}
		try {
			const EndPostData: ReqEndRoute = {
				userId: userId,
			};
			const res = await fetch(endRouteUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(EndPostData),
			});
			const result = (await res.json()) as ResEndRoute;
			if (result.succeeded) {
				clearTimeout(timerId); //ここ動いてる？
				router.push('/CarMenu');
				return;
			} else {
				modal.setContent(
					<>
						<p>失敗</p>
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
		}
		firstPost();
	};

	const onClickCarMenu = () => {
		clearTimeout(timerId);
		router.push('/CarMenu');
	};

	// バッテリー残量の可視化
	const showBattery = (rem: number) => {
		const charge = Math.max(0, Math.min(100, rem)); // 0~100%までの範囲に圧縮

		if (process.browser) {
			// 30%以下の時は赤色にする
			charge > 30
				? document.documentElement.style.setProperty(
						'--battery-color',
						'rgb(8, 175, 8)' // 通常は緑色
				  )
				: document.documentElement.style.setProperty(
						'--battery-color',
						'rgb(255, 68, 68)' // 赤色
				  );

			document.documentElement.style.setProperty(
				'--charge',
				String(100 - charge)
			); // パーセンテージ表示
		}
		return charge;
	};

	return (
		<>
			<div className="watch-page">
				{modal.show()}

				<header>
					<_BaseButton
						onClick={onClickNextRoute}
						_class="button watch-btn"
						id="nextButton">
						次の目的地に行く
					</_BaseButton>

					<_BaseButton
						onClick={syousai}
						_class="button watch-btn"
						id="statusButton">
						詳細
					</_BaseButton>

					<_BaseButton
						onClick={CarEnd}
						_class="button watch-btn"
						id="stopCarButton">
						使用を停止
					</_BaseButton>

					<span className="battery">
						<p>{`${showBattery(battery)}%`}</p>
					</span>

					<_BaseButton
						onClick={onClickCarMenu}
						_class="button map-exit-btn">
						戻る
					</_BaseButton>
				</header>

				<div className="map">
					<DynamicCarWatchMap
						poly={poly}
						dest={dest}
					/>
				</div>
			</div>
		</>
	);
};
export default CarWatch;

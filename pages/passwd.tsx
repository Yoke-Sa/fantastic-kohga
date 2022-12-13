import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useModal } from '../component/hooks/useModal';
import { AdminIdContext } from './_app';

interface ReqChangePasswd {
	AdminId: string;
	newPasswd: string;
	currentPasswd: string;
}
interface ResChangePasswd {
	succeeded: boolean;
}

const PasswdUrl = 'http://saza.kohga.local:3001/changePasswd';

const Passwd: NextPage = () => {
	const modal = useModal();
	const router = useRouter();
	const [currentPasswd, setCurrentPasswd] = useState<string>('');
	const [newPasswd, setNewPasswd] = useState<string>('');
	const { adminId } = useContext(AdminIdContext);

	useEffect(() => {
		if (adminId !== '') {
			router.push('/');
		}
	}, []);

	const PasswdData: ReqChangePasswd = {
		AdminId: adminId,
		newPasswd: newPasswd,
		currentPasswd: currentPasswd,
	};

	const onClickPasswd = async () => {
		try {
			const res = await fetch(PasswdUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(PasswdData),
			});
			const result = await res.json();
			if (result.succeeded) {
				modal.setContent(
					<>
						<p>パスワードの変更に成功しました</p>
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
	const onClickCancel = () => {
		router.push('/');
	};

	return (
		<>
			{modal.show()}
			<header>
				<h1>パスワード変更</h1>
			</header>

			<div className="pass-page">
				<div className="input-form">
					<div>
						<label
							htmlFor="passwd"
							className="text">
							現在のパスワード
						</label>
						<input
							type="passwd"
							name="passwd"
							id="passwd"
							onChange={(e) => setCurrentPasswd(e.target.value)}
						/>
					</div>
					<div>
						<label
							htmlFor="passwd"
							className="text">
							新しいパスワード
						</label>
						<input
							type="password"
							name="passwd"
							id="passwd"
							onChange={(e) => setNewPasswd(e.target.value)}
						/>
					</div>
				</div>

				<div>
					<button
						onClick={onClickPasswd}
						className="button pass-btn">
						変更
					</button>
				</div>

				<Link
					href="/login"
					className="login-link">
					ログイン画面に戻る
				</Link>
			</div>
		</>
	);
};
export default Passwd;

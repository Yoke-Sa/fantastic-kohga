import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { useModal } from '../component/hooks/useModal';
import { AdminIdContext } from './_app';

interface ReqAdmin {
	adminName: string;
	adminPass: string;
}
interface ResAdmin {
	succeeded: boolean;
	adminId?: string;
}

const AdminUrl = 'http://saza.kohga.local:3001/loginAdmin';

const Login = () => {
	const router = useRouter();
	const modal = useModal();
	const { adminId, setAdminId } = useContext(AdminIdContext);
	const [input, setInput] = useState<string>('');
	const [passwd, setPasswd] = useState<string>('');

	const PostAdminData: ReqAdmin = {
		adminName: input,
		adminPass: passwd,
	};

	const onClickLogin = async () => {
		try {
			const res = await fetch(AdminUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(PostAdminData),
			});
			const result = (await res.json()) as ResAdmin;
			if (result.succeeded) {
				console.log('result.adminId', result.adminId);
				if (result.adminId !== undefined) {
					setAdminId(result.adminId);
				}
				console.log('login', adminId);
				router.push('/CarManager');
			} else {
				console.log('失敗');
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

	// const showPass = () => {
	// 	const pass = document.getElementById('pass');
	// 	if (pass?.type === 'text') {
	// 		pass.type = 'password';
	// 	} else {
	// 		pass.type = 'text';
	// 	}
	// };

	return (
		<>
			<div className="login-page">
				{modal.show()}

				<header>
					<h1>ログイン画面</h1>
					<button
						onClick={onClickCancel}
						className="button exit-btn">
						戻る
					</button>
				</header>

				<div className="input-form">
					<div>
						<label
							htmlFor="name"
							className="text">
							&emsp;&emsp;&emsp;名前
						</label>
						<input
							type="text"
							onChange={(e) => setInput(e.target.value)}
							name="name"
							id="name"
							value={input}
						/>
					</div>
					<div>
						<label
							htmlFor="pass-label"
							className="text">
							パスワード
						</label>
						<input
							type="password"
							onChange={(e) => setPasswd(e.target.value)}
							name="pass"
							id="pass"
							value={passwd}
						/>
						{/* <button
							onClick={showPass}
							id="btn_passview">
							表示
						</button> */}
					</div>
				</div>

				<button
					onClick={onClickLogin}
					className="button login-btn">
					ログイン
				</button>

				<Link
					href="/passwd"
					className="pass-link">
					パスワード変更はこちら
				</Link>
			</div>
		</>
	);
};
export default Login;

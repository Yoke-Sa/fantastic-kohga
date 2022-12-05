fantastic-kohga(develop)にcssを加えたやつ

# 変更点(主にインポートしたライブラリについて)

## 1. next-videos
・背景に動画を流すためにローカルファイルをリモートURLに提供する必要がある。
```linux
npm i next-videos
```
その後、next-config.jsファイルに下記を追加
```js
/***** next-config.js *****/

~~~~~~~~~~省略~~~~~~~~~~

/**
 * next-videos
 */
// 提供先リモートURL切り替え用フラグ
const isDevelopment = process.env.NODE_ENV === 'development';

// 動画をリモートURLに提供
const withVideos = require('next-videos');

// 提供先の選択
module.exports = withVideos({
	assetPrefix: isDevelopment ? 'http://localhost:3000' : 'http://localhost',
});
```
さらに、video.d.tsのような定義用のtsファイルを作り、下記を追加
```ts
/***** video.d.ts *****/

// mp4形式ファイルのモジュール化
declare module '*.mp4' {
	const src: string;
	export default src;
}
```
あとはcss当ててやれば表示される<br>

## 2. sass
・cssでmixinとかネストとか使いたかったから入れた。
```linux
npm i sass
```

# 🚀 ネイルサロン予約システム - 公開手順書

## 概要
このガイドに従って、5-10分でネイルサロン予約システムを無料で公開できます。

## 前提条件
- インターネット接続
- Webブラウザ
- 現在のプロジェクトファイル

## 手順1: GitHubアカウント作成

### 1-1. GitHubサイトへアクセス
- https://github.com にアクセス
- 「Sign up」をクリック

### 1-2. アカウント情報入力
- **Username**: 任意の英数字（例: nailtaro2024）
- **Email**: 個人のメールアドレス
- **Password**: 安全なパスワード

## 手順2: 新しいリポジトリ作成

### 2-1. リポジトリ作成
- GitHubダッシュボードで「New repository」をクリック
- **Repository name**: `nail-salon-booking`
- **Public** を選択（無料）
- 「Create repository」をクリック

### 2-2. ファイルアップロード
**⚠️ 重要: 不要なファイルを除外してアップロード**

**方法A: Webブラウザでアップロード（簡単・推奨）**
1. 「uploading an existing file」をクリック
2. **以下のファイル・フォルダのみ**をドラッグ&ドロップ：
   ```
   📁 src/              ✅ アップロード
   📁 public/           ✅ アップロード (あれば)
   📄 package.json      ✅ アップロード
   📄 package-lock.json ✅ アップロード
   📄 next.config.js    ✅ アップロード
   📄 tailwind.config.ts ✅ アップロード
   📄 tsconfig.json     ✅ アップロード
   📄 postcss.config.js ✅ アップロード
   📄 README.md         ✅ アップロード
   📄 .gitignore        ✅ アップロード
   
   📁 node_modules/     ❌ 除外（重要！）
   📁 .next/           ❌ 除外
   📁 out/             ❌ 除外
   ```
3. Commit message: 「ネイルサロン予約システム」
4. 「Commit changes」をクリック

**方法B: Git コマンド（上級者向け）**
```bash
# .gitignoreファイルを作成済みなら自動で除外される
git init
git add .
git commit -m "ネイルサロン予約システム"
git remote add origin https://github.com/[ユーザー名]/nail-salon-booking.git
git branch -M main
git push -u origin main
```

**💡 ポイント**: `node_modules`フォルダは絶対にアップロードしない！（数万ファイルが含まれているため）

## 手順3: Vercelでデプロイ

### 3-1. Vercelアカウント作成
- https://vercel.com にアクセス
- 「Sign Up」をクリック
- 「Continue with GitHub」を選択

### 3-2. プロジェクトをデプロイ
1. Vercelダッシュボードで「New Project」をクリック
2. 作成したGitHubリポジトリ（nail-salon-booking）を選択
3. 「Deploy」をクリック
4. 2-3分待つ

### 3-3. 公開URL取得
- デプロイ完了画面で公開URLが表示されます
- 例: `https://nail-salon-booking-abc123.vercel.app`

## 手順4: 動作確認

### 4-1. URLアクセステスト
- 発行されたURLにアクセス
- 「お客様」「従業員」ボタンが表示されることを確認

### 4-2. 機能テスト
- **お客様画面**: `/customer` - 予約機能の確認
- **管理者画面**: `/admin` - パスワード `salon2024` で管理機能確認

## 手順5: サイトへの掲載

### 5-1. URLをコピー
```
お客様用予約ページ:
https://your-project-name.vercel.app/customer

管理者画面:
https://your-project-name.vercel.app/admin
```

### 5-2. 自社サイトに掲載
```html
<!-- HTMLの例 -->
<a href="https://your-project-name.vercel.app/customer" target="_blank">
  ネイル予約はこちら
</a>
```

## 料金・制限

### Vercel（無料プラン）
- **帯域幅**: 月100GB
- **ビルド時間**: 月100時間
- **プロジェクト数**: 無制限
- **カスタムドメイン**: 対応（独自ドメイン可）

### 注意事項
- 現在はLocalStorage使用（ブラウザローカル保存）
- 本格運用時はデータベース連携推奨
- SSL/HTTPS自動対応

## トラブルシューティング

### よくある問題

**Q: "Try uploading fewer than 100 files at a time" エラー**
A: `node_modules`フォルダが含まれています。以下のフォルダ・ファイルは除外してください：
- `node_modules/` （最重要！）
- `.next/`
- `out/`
- `.git/` (既存のgitフォルダがある場合)

**Q: ビルドエラーが発生**
A: 必要なファイルが不足している可能性があります。以下を確認：
- `package.json` がアップロードされているか
- `src/` フォルダ全体がアップロードされているか

**Q: ページが表示されない**
A: URLの末尾に `/` があることを確認

**Q: 管理者画面にアクセスできない**
A: パスワード `salon2024` を正確に入力

## サポート連絡先
技術的な問題がある場合は、GitHubのIssuesページで報告してください。

---
**所要時間**: 初回5-10分、2回目以降は2-3分

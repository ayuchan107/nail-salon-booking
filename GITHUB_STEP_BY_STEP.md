# 🚨 GitHubアップロード - 確実な解決方法

## 問題の原因
GitHubのWebインターフェースでは、フォルダ構造を含むファイルのドラッグ&ドロップ時に予期しないファイル数カウントが発生する場合があります。

## ✅ 解決方法：段階的アップロード

### ステップ1: 基本ファイルのみでリポジトリ作成

**📁 最初にアップロードするファイル（7個のみ）：**
```
c:\Users\a2220085\Documents\LINE\LINE Datasolution\nail-salon-upload\
├── package.json          ✅ 必須
├── next.config.js        ✅ 必須
├── tailwind.config.ts    ✅ 必須
├── tsconfig.json         ✅ 必須
├── postcss.config.js     ✅ 必須
├── next-env.d.ts         ✅ 必須
└── README.md             ✅ 説明書
```

### ステップ2: GitHub操作手順

1. **GitHub.com**にアクセス
2. **New repository**をクリック
3. Repository name: `nail-salon-booking`
4. **Public**を選択
5. **Create repository**をクリック
6. **uploading an existing file**をクリック
7. **上記7ファイルのみ**をドラッグ&ドロップ（srcフォルダは後で）
8. Commit message: `初期設定ファイル`
9. **Commit changes**をクリック

### ステップ3: srcフォルダを個別追加

1. リポジトリページで**Add file** → **Upload files**をクリック
2. `src`フォルダ内のファイルを**個別に**ドラッグ&ドロップ：
   ```
   src/app/globals.css
   src/app/layout.tsx
   src/app/page.tsx
   src/app/admin/page.tsx
   src/app/customer/page.tsx
   src/components/ReservationSystem.tsx
   ```
3. Commit message: `アプリケーションコード追加`
4. **Commit changes**をクリック

## 🎯 代替方法：GitHub CLI使用

**GitHub CLIをインストールしている場合：**
```bash
gh repo create nail-salon-booking --public
cd "c:\Users\a2220085\Documents\LINE\LINE Datasolution\nail-salon-upload"
git init
git add .
git commit -m "ネイルサロン予約システム"
git remote add origin https://github.com/[ユーザー名]/nail-salon-booking.git
git push -u origin main
```

## 📊 ファイル数確認
- **基本ファイル**: 7個 → GitHubアップロード成功
- **srcファイル**: 6個 → 個別アップロード成功
- **合計**: 13個 → 100個制限クリア

**この方法で確実にアップロードできます！**

# アップロード対象ファイル一覧

## ✅ アップロードが必要なファイル・フォルダ

### フォルダ
```
📁 src/
  📁 app/
    📄 globals.css
    📄 layout.tsx
    📄 page.tsx
    📁 admin/
      📄 page.tsx
    📁 customer/
      📄 page.tsx
  📁 components/
    📄 ReservationSystem.tsx
```

### 設定ファイル
```
📄 package.json
📄 package-lock.json
📄 next.config.js
📄 tailwind.config.ts
📄 tsconfig.json
📄 postcss.config.js
📄 next-env.d.ts
📄 .gitignore
```

### ドキュメント（オプション）
```
📄 README.md
📄 PUBLIC_DEPLOYMENT_GUIDE.md
📄 DEPLOYMENT_GUIDE.md
```

## ❌ アップロードしてはいけないファイル・フォルダ

```
❌ node_modules/     (数万ファイルが含まれている！)
❌ .next/           (ビルド生成物)
❌ out/             (エクスポート生成物)  
❌ .git/            (既存のgitフォルダ)
❌ .DS_Store        (macOS固有ファイル)
❌ Thumbs.db        (Windows固有ファイル)
```

## 🗑️ 不要フォルダの削除方法

### 安全に削除できるフォルダ
```
✅ 削除OK: node_modules/     (npm installで再生成可能)
✅ 削除OK: .next/           (npm run buildで再生成)
✅ 削除OK: out/             (npm run exportで再生成)
✅ 削除OK: .git/            (既存のgitフォルダがある場合)
```

### 削除手順

**Windows エクスプローラーでの削除:**
1. プロジェクトフォルダを開く
2. `node_modules`フォルダを右クリック
3. 「削除」を選択
4. ごみ箱に移動

**⚠️ 削除時の注意:**
- `node_modules`フォルダは数万ファイルを含むため、削除に時間がかかる場合があります
- 削除中は他の作業を控えてください

### 削除後の復元方法
もし削除したフォルダが必要になった場合：
```bash
# node_modules を復元
npm install

# .next を復元  
npm run build
```

### 削除のメリット
- **ファイル数激減**: 数万→約20ファイル
- **アップロード成功**: GitHubエラー解消
- **容量削減**: 数GB→数MB

### 絶対に削除してはいけないもの
```
❌ src/                 (アプリのソースコード)
❌ package.json         (依存関係の定義)
❌ next.config.js       (Next.js設定)
❌ tailwind.config.ts   (スタイル設定)
```

## 📋 削除前後の比較

### 削除前（エラーが発生する状態）
```
📁 プロジェクトフォルダ/
├── 📁 node_modules/        ←🚨 約30,000ファイル！
├── 📁 .next/              ←🚨 数百ファイル
├── 📁 src/                ←✅ 必要
├── 📄 package.json        ←✅ 必要
└── 📄 next.config.js      ←✅ 必要
```
**結果**: "Try uploading fewer than 100 files" エラー

### 削除後（正常にアップロード可能）
```
📁 プロジェクトフォルダ/
├── 📁 src/                ←✅ 必要
├── 📄 package.json        ←✅ 必要
├── 📄 next.config.js      ←✅ 必要
├── 📄 tailwind.config.ts  ←✅ 必要
├── 📄 tsconfig.json       ←✅ 必要
└── 📄 .gitignore          ←✅ 必要
```
**結果**: 約15-20ファイル → GitHubアップロード成功✅

## 🚀 削除実行コマンド（上級者向け）
PowerShellを使った一括削除：
```powershell
# プロジェクトフォルダに移動
cd "c:\Users\a2220085\Documents\LINE\LINE Datasolution\test"

# 不要フォルダを削除
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue  
Remove-Item -Recurse -Force out -ErrorAction SilentlyContinue
```

## 💡 確認方法
Windowsエクスプローラーで該当フォルダを開いて：
1. `node_modules`フォルダがないことを確認
2. ファイル数が20個程度であることを確認
3. 上記の「✅ アップロードが必要」リストと照合

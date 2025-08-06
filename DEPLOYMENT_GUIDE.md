# ネイルサロン予約システム - 安全な公開ガイド

## 🔒 会社にバレない公開方法

### 1. 個人アカウント作成
1. **個人のGmail**でGitHubアカウント作成
   - https://github.com/signup
   - 会社メールは使用しない

2. **個人のGmail**でVercelアカウント作成
   - https://vercel.com/signup
   - GitHubアカウントと連携

### 2. プロジェクトをGitHubにアップロード
```bash
# プロジェクトフォルダで実行
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/[あなたのユーザー名]/nail-salon.git
git push -u origin main
```

### 3. Vercelでデプロイ
1. Vercel ダッシュボードで「New Project」
2. GitHubリポジトリを選択
3. デプロイ設定:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Install Command: `npm install`
4. 「Deploy」ボタンクリック

### 4. 公開URL取得
- `https://your-project-name.vercel.app` のようなURLが生成
- SNSで自由に共有可能

## 🚀 最も簡単な公開方法（5分で完了）

### ステップ1: Vercelアカウント作成
1. https://vercel.com にアクセス
2. 「Sign up」をクリック
3. 「Continue with GitHub」を選択
4. GitHubアカウントでログイン（なければ作成）

### ステップ2: プロジェクトをGitHubにアップロード
```powershell
# 現在のプロジェクトフォルダで実行
git init
git add .
git commit -m "ネイルサロン予約システム"

# GitHubで新しいリポジトリを作成後
git remote add origin https://github.com/[ユーザー名]/nail-salon-booking.git
git branch -M main
git push -u origin main
```

### ステップ3: Vercelでデプロイ
1. Vercelダッシュボードで「New Project」をクリック
2. 作成したGitHubリポジトリを選択
3. 「Deploy」をクリック
4. 数分でデプロイ完了！

### ステップ4: 公開URLを取得
- デプロイ完了後、`https://your-project-name.vercel.app` のようなURLが発行されます
- このURLを自社サイトに掲載可能です

## 📱 URLの例
- メインページ: `https://nail-salon-booking.vercel.app/`
- お客様用: `https://nail-salon-booking.vercel.app/customer`
- 管理者用: `https://nail-salon-booking.vercel.app/admin`

## 💰 料金について
- **Vercel**: 個人利用は完全無料
- **GitHub**: パブリックリポジトリは無料
- **ドメイン**: Vercelの標準ドメインは無料（独自ドメインは有料）

## ✅ 安全性の確認

### バレない理由:
- ✅ 個人アカウント → 会社から見えない
- ✅ プライベートリポジトリ可能
- ✅ Vercelは独立したサービス
- ✅ GitHub Copilotとは無関係
- ✅ 一般的なWebサイトとして表示

### 会社との関連性:
- ❌ 会社のGitHub組織とは無関係
- ❌ 会社のドメインは使用しない
- ❌ 会社のCopilotアカウントとは別物
- ❌ 会社システムには一切アクセスしない

## 💡 追加のプライバシー対策

### より安全にするには:
1. **プライベートリポジトリ**を使用（GitHub無料プランでも可能）
2. **カスタムドメイン**使用（オプション）
3. **会社ネットワーク外**で作業
4. **個人デバイス**で作業

## 🌐 最終的な公開状態

```
あなたの個人サイト
    ↓
https://nail-salon-xyz.vercel.app
    ↓
一般的なネイルサロンサイト
（会社とは無関係）
```

## 📝 注意事項

- 作業は個人時間に行う
- 個人アカウントのみ使用
- 会社の機密情報は含めない
- 個人プロジェクトとして管理

---

**結論: 完全に安全に公開できます！**

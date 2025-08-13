# EmailJS テンプレート設定ガイド

## EmailJSアカウント作成と設定

1. https://www.emailjs.com/ にアクセス
2. アカウントを作成・ログイン
3. 「Email Services」でGmail/Outlook等を連携
4. 「Email Templates」でテンプレートを作成

## メールテンプレート例

以下の内容でEmailJSにテンプレートを作成してください：

**件名:**
新しい予約が入りました - {{customer_name}}様 ({{reservation_date}} {{reservation_time}})

**本文:**
{{to_name}}様

お疲れ様です！{{salon_name}}からの予約通知です。

新しい予約が入りました：

【お客様情報】
・お名前: {{customer_name}}様
・お電話: {{customer_phone}}

【予約詳細】
・日時: {{reservation_date}} {{reservation_time}}
・メニュー: {{menu_name}} ({{menu_duration}}分)
・料金: ¥{{menu_price}}
・担当者: {{to_name}}

準備をお願いいたします。

---
{{salon_name}}
予約管理システムより自動送信

## テンプレート変数

EmailJSのテンプレートで使用できる変数：
- {{to_name}} - 担当者名
- {{customer_name}} - お客様名
- {{customer_phone}} - お客様電話番号
- {{reservation_date}} - 予約日
- {{reservation_time}} - 予約時間
- {{menu_name}} - メニュー名
- {{menu_duration}} - 施術時間
- {{menu_price}} - 料金
- {{salon_name}} - サロン名

## .env.local設定

EmailJSの設定が完了したら、.env.localファイルに以下を設定：

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

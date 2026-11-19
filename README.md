# TodoApp

カレンダーとタスク一覧で、予定を気楽に見渡すためのToDoアプリです。
React・TypeScript・Viteを使用しています。

## 開発

Node.js 24とnpmを使用します。

```sh
npm ci
npm run dev
```

開発サーバーが表示するURLを開いてください。Viteのベースパスは `/toDoApp/` です。

## コマンド

| コマンド               | 内容                                   |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | 開発サーバーを起動                     |
| `npm run build`        | 型チェックと本番ビルド（`dist/`）      |
| `npm run preview`      | ビルド結果をローカルで確認             |
| `npm run lint`         | ESLintでコードを確認                   |
| `npm test`             | 保存データ・カレンダーの日付計算を検証 |
| `npm run format`       | Prettierで整形                         |
| `npm run format:check` | 整形状況を確認                         |

## ファイル構成

```text
src/
├── app/                         # アプリ全体の画面構成
├── components/
│   ├── layout/                  # ヘッダー
│   └── ui/                      # 共通ダイアログ・アイコン
├── data/                        # 初期タスク・カテゴリ
├── features/
│   ├── calendar/
│   │   ├── components/          # カレンダー・月移動・日付セル
│   │   └── utils/               # ローカル日付の計算
│   ├── categories/components/   # カテゴリの表示・追加・色変更
│   └── todos/
│       ├── components/          # タスク一覧・項目・追加・詳細
│       └── hooks/               # タスク操作・自動保存
├── lib/                         # 保存データの復元・検証
├── styles/                      # 基本設定・レイアウト・各部品のスタイル
├── types/                       # タスク・カテゴリの共通型と表示定義
└── main.tsx                     # エントリーポイント

tests/                           # 保存処理・日付計算のテスト
docs/                            # コンセプト・環境構築時のメモ
public/                          # ファビコン
```

画面の配置は `src/app/App.tsx`、データの更新と保存は `useTodoStore`、保存データの検証は `src/lib/storage.ts` が担当します。
カレンダーにはタスクの追加・削除やカテゴリ管理を持たせず、機能ごとの責務を分けています。

## データ保存

タスクとカテゴリは、ブラウザの `localStorage` に自動保存されます。
保存キーは従来どおり `calendar-todo-app:v1` で、既存の保存データを引き続き読み込めます。
読み込みに失敗した場合は、再試行するまで元のデータを上書きしません。
タスクには任意の説明を追加でき、一覧と詳細に改行を保って表示します。
説明フィールドがない既存データは、説明なしとして読み込みます。

## 開発メモ

- [コンセプト](docs/concept.txt)
- [環境構築時のコマンド](docs/setup-commands.txt)

GitHub Pagesの公開設定は `.github/workflows/deploy.yml` と `vite.config.ts` にあります。

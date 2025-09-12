import type { ServiceMenu } from "../types/menu";

export const services: ServiceMenu[] = [
    // ハンド：ジェル
    {
      id: 'hand-gel-clear',
      name: 'クリアジェル',
      description: '透明感のある艶仕立てで自爪を美しく保護するクリアジェル。',
      duration: 60,
      price: 5600,
      category: 'ハンド',
      type: 'ジェル'
    },
    {
      id: 'hand-gel-onecolor',
      name: 'ワンカラージェル',
      description: '指先を美しく彩るシンプルなワンカラーネイル。上品なツヤ感が魅力。',
      duration: 120,
      price: 6000,
      category: 'ハンド',
      type: 'ジェル'
    },
    {
      id: 'hand-gel-lame',
      name: 'ラメグラデーション',
      description: '繊細なラメが指先を華やかに演出。上品でキラキラ輝く仕上がりに。',
      duration: 75,
      price: 6000,
      category: 'ハンド',
      type: 'ジェル'
    },
    {
      id: 'hand-gel-french',
      name: 'フレンチジェル',
      description: '洗礼されたデザインで指先を美しく。シンプルで上品なフレンチネイル。',
      duration: 75,
      price: 6800,
      category: 'ハンド',
      type: 'ジェル'
    },
    {
      id: 'hand-gel-gradation',
      name: 'カラーグラデーション',
      description: '自然な色の移り変わりが魅力。指先を美しく演出する上品なデザイン。',
      duration: 75,
      price: 7000,
      category: 'ハンド',
      type: 'ジェル'
    },
    //　ハンド：マニキュア

    {
      id: 'hand-polish-clear',
      name: 'クリアマニキュア',
      description: '透明感のある艶仕立てで自爪を美しく保護するクリアジェル。',
      duration: 60,
      price: 5600,
      category: 'ハンド',
      type: 'マニキュア'
    },
    {
      id: 'hand-polish-onecolor',
      name: 'ワンカラーマニキュア',
      description: '指さくを美しくシンプルなワンカラーネイル。上品なツヤ感が魅力',
      duration: 60,
      price: 5500,
      category: 'ハンド',
      type: 'マニキュア'
    },
    {
      id: 'hand-polish-french',
      name: 'フレンチマニキュア',
      description: '上品で洗礼されたデザイン。オフィスや特別なシーンのもおすすめ。',
      duration: 60,
      price: 6000,
      category: 'ハンド',
      type: 'マニキュア'
    },
    // フットメニュー:ジェル
    {
      id: 'foot-gel-clear',
      name: 'クリアジェル',
      description: '透明感のあるクリアジェルで、足元を自然に美しく保護。艶感がある引き立ち、上品な仕上がりに。',
      duration: 90,
      price: 6000,
      category: 'フット',
      type: 'フットジェル'
    },
    {
      id: 'foot-gel-onecolor',
      name: 'ワンカラージェル',
      description: '足元を美しく彩るワンカラーネイル。シンプルながら華やかな仕上がり。',
      duration: 120,
      price: 6500,
      category: 'フット',
      type: 'フットジェル'
    },
    {
      id: 'foot-gel-french',
      name: 'フレンチジェル',
      description: '上品なフレンチネイルで足元をエレガントに。オフィスやお出かけにも◎',
      duration: 60,
      price: 6800,
      category: 'フット',
      type: 'フットジェル'
    },
    // フットメニュー:マニキュア
    {
      id: 'foot-polish-clear',
      name: 'クリアマニキュア',
      description: '透明感のあるクリアジェルで、足元を自然に美しく保護。艶感がある引き立ち、上品な仕上がりに。',
      duration: 90,
      price: 5500,
      category: 'フット',
      type: 'フットマニキュア'
    },
    {
      id: 'foot-polish-onecolor',
      name: 'ワンカラーマニキュア',
      description: '足元を美しく彩るワンカラーネイル。シンプルながら華やかな仕上がり。',
      duration: 120,
      price: 6000,
      category: 'フット',
      type: 'フットマニキュア'
    },
    {
      id: 'foot-polish-french',
      name: 'フレンチマニキュア',
      description: '上品なフレンチデザイン。指先を美しく際立たせ、オフィスや特別なシーンにもおすすめ。',
      duration: 60,
      price: 6500,
      category: 'フット',
      type: 'フットマニキュア'
    },

    // オフ
    {
      id: 'off-own-polish',
      name: '自店マニキュアオフ',
      description: '自爪に優しくマニキュアをオフ。丁寧に除去し、健康的な爪を保ちます。',
      duration: 10,
      price: 1000,
      category: 'オフ',
      type: 'オフ'
    },
    {
      id: 'off-other-polish',
      name: '他店マニキュアオフ',
      description: '自爪に優しくマニキュアをオフ。丁寧に除去し、健康的な爪を保ちます。',
      duration: 10,
      price: 2000,
      category: 'オフ',
      type: 'オフ'
    },
    {
      id: 'off-own-acrylic',
      name: '自店アクリル/スキャルプ/ハードジェルオフ',
      description: '当店施術のアクリル、スカルプ、ハードジェルを丁寧にオフ。自爪を保護しながら優しく除去します。',
      duration: 10,
      price: 3000,
      category: 'オフ',
      type: 'オフ'
    },
    {
      id: 'off-other-acrylic',
      name: '他店アクリル/スキャルプ/ハードジェルオフ',
      description: '当店施術のアクリル、スカルプ、ハードジェルを丁寧にオフ。自爪を保護しながら優しく除去します。',
      duration: 10,
      price: 3500,
      category: 'オフ',
      type: 'オフ'
    },
    {
      id: 'off-own-gel',
      name: '自店ジェルオフ',
      description: '当店施術のジェルを丁寧にオフ。自爪を守りながら優しく除去します。',
      duration: 10,
      price: 2000,
      category: 'オフ',
      type: 'オフ'
    },
    {
      id: 'off-other-gel',
      name: '他店ジェルオフ',
      description: '当店施術のジェルを丁寧にオフ。自爪を守りながら優しく除去します。',
      duration: 10,
      price: 3000,
      category: 'オフ',
      type: 'オフ'
    },

    // その他
    {
      id: 'others-keratin',
      name: '角質除去',
      description: '足裏の硬くなった角質を丁寧にケア。ツルツルで滑らかな仕上がりに。',
      duration: 10,
      price: 1500,
      category: 'その他',
      type: 'その他'
    },
    {
      id: 'others-footcare',
      name: 'フットケア',
      description: '暖かいティー天皮を整えたり、爪の形を整えたり、ネイルシェイプ10分間のローションマッサージ、ホットタオルなどのご提供いたします。スクラブをご希望の方は+500円のオプションを選択してください',
      duration: 10,
      price: 5000,
      category: 'その他',
      type: 'その他'
    },
    {
      id: 'others-handcare',
      name: '【既存のメニューに含まれております】\nハンドケア',
      description: '甘皮処理と爪の形を整え、健康的で美しい指先に。保護ケアでしっとりに仕上げます。',
      duration: 10,
      price: 3000,
      category: 'その他',
      type: 'その他'
    },
    {
      id: 'others-sculp',
      name: 'スキャルプネイル長さだしワンカラーネイル',
      description: 'スキャルプワンカラーをやります。',
      duration: 10,
      price: 10000,
      category: 'その他',
      type: 'その他'
    },

    // オプション
    {
      id: 'option-gel-off',
      name: 'ジェルオフ',
      description: 'ジェルネイルを丁寧にオフ。自爪を傷めず、健康的な爪を保ちながら優しく除去します。',
      duration: 15,
      price: 0,
      category: 'オプション',
      type: 'その他'
    },
    {
      id: 'option-polish-off',
      name: 'マニキュアオフ',
      description: '自爪に優しくマニキュアをオフ。丁寧に除去し、健康的な爪を保ちます。',
      duration: 30,
      price: 0,
      category: 'オプション',
      type: 'その他'
    },
    {
      id: 'option-hard-gel-off',
      name: 'ハードジェルオフ',
      description: 'ハードジェルを丁寧にオフ。自爪を傷めず、優しく除去します。',
      duration: 45,
      price: 1000,
      category: 'オプション',
      type: 'その他'
    },
    {
      id: 'option-sculp-off',
      name: 'スカルプオフ',
      description: 'スカルプアクリルを丁寧にオフ。自爪を傷めず、優しく除去します。',
      duration: 20,
      price: 2000,
      category: 'オプション',
      type: 'その他'
    },
    {
      id: 'option-magnet-gel',
      name: 'マグネットジェルカラー追加',
      description: 'マグネットジェルネイルをご利用の方は、ワンカラーとこちらを選択してくださいフレンチのカラーをマグネットにも変更できます。その場合もこちらを選択してください',
      duration: 20,
      price: 660,
      category: 'オプション',
      type: 'その他'
    },
    {
      id: 'option-scrub',
      name: 'スクラブ追加',
      description: 'スカルプアクリルを丁寧にオフ。自爪を傷めず、優しく除去します。',
      duration: 20,
      price: 500,
      category: 'オプション',
      type: 'その他'
    }
];

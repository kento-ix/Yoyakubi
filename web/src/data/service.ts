import type { ServiceMenu } from "../types/menu";

export const services: ServiceMenu[] = [
    // ハンドメニュー
    {
      id: 'hand-basic',
      name: 'ベーシックネイル',
      description: 'カラーリング＋ベースコート＋トップコート',
      duration: 60,
      price: 4000,
      category: 'ハンド'
    },
    {
      id: 'hand-gel',
      name: 'ジェルネイル',
      description: '長持ちするジェルネイル',
      duration: 90,
      price: 6000,
      category: 'ハンド'
    },
    {
      id: 'hand-art',
      name: 'アートネイル',
      description: 'オリジナルデザインのアートネイル',
      duration: 120,
      price: 8000,
      category: 'ハンド'
    },
    {
      id: 'hand-french',
      name: 'フレンチネイル',
      description: '上品なフレンチスタイル',
      duration: 75,
      price: 5500,
      category: 'ハンド'
    },
    // フットメニュー
    {
      id: 'foot-basic',
      name: 'ベーシックフットネイル',
      description: 'フットケア＋カラーリング',
      duration: 90,
      price: 5000,
      category: 'フット'
    },
    {
      id: 'foot-gel',
      name: 'フットジェルネイル',
      description: '長持ちするフットジェルネイル',
      duration: 120,
      price: 7000,
      category: 'フット'
    },
    {
      id: 'foot-care',
      name: 'フットケア',
      description: '角質除去＋保湿ケア',
      duration: 60,
      price: 4500,
      category: 'フット'
    },
    // オプションメニュー
    {
      id: 'option-stone',
      name: 'ストーンアート',
      description: 'キラキラストーンでデコレーション',
      duration: 15,
      price: 500,
      category: 'オプション'
    },
    {
      id: 'option-3d',
      name: '3Dアート',
      description: '立体的な3Dデザイン',
      duration: 30,
      price: 1000,
      category: 'オプション'
    },
    {
      id: 'option-length',
      name: '長さ出し',
      description: 'スカルプチュアで長さを出す',
      duration: 45,
      price: 2000,
      category: 'オプション'
    },
    {
      id: 'option-repair',
      name: '爪補強',
      description: '割れた爪の補強・修復',
      duration: 20,
      price: 800,
      category: 'オプション'
    }
];

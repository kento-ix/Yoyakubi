from datetime import datetime
from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.orm_reservation import Service

services = [
    # ハンド：ジェル
    {
        "id": "hand-gel-clear",
        "service_name": "クリアジェル (ハンド)",
        "description": "透明感のある艶仕立てで自爪を美しく保護するクリアジェル。",
        "duration": 60,
        "price": 5600,
        "category": "ハンド"
    },
    {
        "id": "hand-gel-onecolor",
        "service_name": "ワンカラージェル (ハンド)",
        "description": "指先を美しく彩るシンプルなワンカラーネイル。上品なツヤ感が魅力。",
        "duration": 120,
        "price": 6000,
        "category": "ハンド"
    },
    {
        "id": "hand-gel-lame",
        "service_name": "ラメグラデーション (ハンド)",
        "description": "繊細なラメが指先を華やかに演出。上品でキラキラ輝く仕上がりに。",
        "duration": 75,
        "price": 6000,
        "category": "ハンド"
    },
    {
        "id": "hand-gel-french",
        "service_name": "フレンチジェル (ハンド)",
        "description": "洗礼されたデザインで指先を美しく。シンプルで上品なフレンチネイル。",
        "duration": 75,
        "price": 6800,
        "category": "ハンド"
    },
    {
        "id": "hand-gel-gradation",
        "service_name": "カラーグラデーション (ハンド)",
        "description": "自然な色の移り変わりが魅力。指先を美しく演出する上品なデザイン。",
        "duration": 75,
        "price": 7000,
        "category": "ハンド"
    },

    # ハンド：マニキュア
    {
        "id": "hand-polish-clear",
        "service_name": "クリアマニキュア (ハンド)",
        "description": "透明感のある艶仕立てで自爪を美しく保護するクリアジェル。",
        "duration": 60,
        "price": 5600,
        "category": "ハンド"
    },
    {
        "id": "hand-polish-onecolor",
        "service_name": "ワンカラーマニキュア (ハンド)",
        "description": "指さくを美しくシンプルなワンカラーネイル。上品なツヤ感が魅力",
        "duration": 60,
        "price": 5500,
        "category": "ハンド"
    },
    {
        "id": "hand-polish-french",
        "service_name": "フレンチマニキュア (ハンド)",
        "description": "上品で洗礼されたデザイン。オフィスや特別なシーンのもおすすめ。",
        "duration": 60,
        "price": 6000,
        "category": "ハンド"
    },

    # フットメニュー:ジェル
    {
        "id": "foot-gel-clear",
        "service_name": "クリアジェル (フット)",
        "description": "透明感のあるクリアジェルで、足元を自然に美しく保護。艶感がある引き立ち、上品な仕上がりに。",
        "duration": 90,
        "price": 6000,
        "category": "フット"
    },
    {
        "id": "foot-gel-onecolor",
        "service_name": "ワンカラージェル (フット)",
        "description": "足元を美しく彩るワンカラーネイル。シンプルながら華やかな仕上がり。",
        "duration": 120,
        "price": 6500,
        "category": "フット"
    },
    {
        "id": "foot-gel-french",
        "service_name": "フレンチジェル (フット)",
        "description": "上品なフレンチネイルで足元をエレガントに。オフィスやお出かけにも◎",
        "duration": 60,
        "price": 6800,
        "category": "フット"
    },

    # フットメニュー:マニキュア
    {
        "id": "foot-polish-clear",
        "service_name": "クリアマニキュア (フット)",
        "description": "透明感のあるクリアジェルで、足元を自然に美しく保護。艶感がある引き立ち、上品な仕上がりに。",
        "duration": 90,
        "price": 5500,
        "category": "フット"
    },
    {
        "id": "foot-polish-onecolor",
        "service_name": "ワンカラーマニキュア (フット)",
        "description": "足元を美しく彩るワンカラーネイル。シンプルながら華やかな仕上がり。",
        "duration": 120,
        "price": 6000,
        "category": "フット"
    },
    {
        "id": "foot-polish-french",
        "service_name": "フレンチマニキュア (フット)",
        "description": "上品なフレンチデザイン。指先を美しく際立たせ、オフィスや特別なシーンにもおすすめ。",
        "duration": 60,
        "price": 6500,
        "category": "フット"
    },

    # オフ
    {
        "id": "off-own-polish",
        "service_name": "自店マニキュアオフ",
        "description": "自爪に優しくマニキュアをオフ。丁寧に除去し、健康的な爪を保ちます。",
        "duration": 10,
        "price": 1000,
        "category": "オフ"
    },
    {
        "id": "off-other-polish",
        "service_name": "他店マニキュアオフ",
        "description": "自爪に優しくマニキュアをオフ。丁寧に除去し、健康的な爪を保ちます。",
        "duration": 10,
        "price": 2000,
        "category": "オフ"
    },
    {
        "id": "off-own-acrylic",
        "service_name": "自店アクリル/スキャルプ/ハードジェルオフ",
        "description": "当店施術のアクリル、スカルプ、ハードジェルを丁寧にオフ。自爪を保護しながら優しく除去します。",
        "duration": 10,
        "price": 3000,
        "category": "オフ"
    },
    {
        "id": "off-other-acrylic",
        "service_name": "他店アクリル/スキャルプ/ハードジェルオフ",
        "description": "当店施術のアクリル、スカルプ、ハードジェルを丁寧にオフ。自爪を保護しながら優しく除去します。",
        "duration": 10,
        "price": 3500,
        "category": "オフ"
    },
    {
        "id": "off-own-gel",
        "service_name": "自店ジェルオフ",
        "description": "当店施術のジェルを丁寧にオフ。自爪を守りながら優しく除去します。",
        "duration": 10,
        "price": 2000,
        "category": "オフ"
    },
    {
        "id": "off-other-gel",
        "service_name": "他店ジェルオフ",
        "description": "当店施術のジェルを丁寧にオフ。自爪を守りながら優しく除去します。",
        "duration": 10,
        "price": 3000,
        "category": "オフ"
    },

    # その他
    {
        "id": "others-keratin",
        "service_name": "角質除去",
        "description": "足裏の硬くなった角質を丁寧にケア。ツルツルで滑らかな仕上がりに。",
        "duration": 10,
        "price": 1500,
        "category": "その他"
    },
    {
        "id": "others-footcare",
        "service_name": "フットケア",
        "description": "暖かいティー天皮を整えたり、爪の形を整えたり、ネイルシェイプ10分間のローションマッサージ、ホットタオルなどのご提供いたします。スクラブをご希望の方は+500円のオプションを選択してください",
        "duration": 10,
        "price": 5000,
        "category": "その他"
    },
    {
        "id": "others-handcare",
        "service_name": "【既存のメニューに含まれております】\nハンドケア",
        "description": "甘皮処理と爪の形を整え、健康的で美しい指先に。保護ケアでしっとりに仕上げます。",
        "duration": 10,
        "price": 3000,
        "category": "その他"
    },
    {
        "id": "others-sculp",
        "service_name": "スキャルプネイル長さだしワンカラーネイル",
        "description": "スキャルプワンカラーをやります。",
        "duration": 10,
        "price": 10000,
        "category": "その他"
    },

    # オプション
    {
        "id": "option-gel-off",
        "service_name": "ジェルオフ",
        "description": "ジェルネイルを丁寧にオフ。自爪を傷めず、健康的な爪を保ちながら優しく除去します。",
        "duration": 15,
        "price": 0,
        "category": "オプション"
    },
    {
        "id": "option-polish-off",
        "service_name": "マニキュアオフ",
        "description": "自爪に優しくマニキュアをオフ。丁寧に除去し、健康的な爪を保ちます。",
        "duration": 30,
        "price": 0,
        "category": "オプション"
    },
    {
        "id": "option-hard-gel-off",
        "service_name": "ハードジェルオフ",
        "description": "ハードジェルを丁寧にオフ。自爪を傷めず、優しく除去します。",
        "duration": 45,
        "price": 1000,
        "category": "オプション"
    },
    {
        "id": "option-sculp-off",
        "service_name": "スカルプオフ",
        "description": "スカルプアクリルを丁寧にオフ。自爪を傷めず、優しく除去します。",
        "duration": 20,
        "price": 2000,
        "category": "オプション"
    },
    {
        "id": "option-magnet-gel",
        "service_name": "マグネットジェルカラー追加",
        "description": "マグネットジェルネイルをご利用の方は、ワンカラーとこちらを選択してくださいフレンチのカラーをマグネットにも変更できます。その場合もこちらを選択してください",
        "duration": 20,
        "price": 660,
        "category": "オプション"
    },
    {
        "id": "option-scrub",
        "service_name": "スクラブ追加",
        "description": "スカルプアクリルを丁寧にオフ。自爪を傷めず、優しく除去します。",
        "duration": 20,
        "price": 500,
        "category": "オプション"
    }
]

def sync_services():
    """
        Sync service data to DB
        If data exist Update
        If not exist Add
    """
    session = SessionLocal()
    try:
        for s in services:
            existing_service = session.query(Service).filter_by(id=s["id"]).first()
            if existing_service:
                existing_service.service_name = s["service_name"]
                existing_service.description = s["description"]
                existing_service.duration = s["duration"]
                existing_service.price = s["price"]
                existing_service.category = s["category"]
                existing_service.updated_at = datetime.utcnow()
            else:
                new_service = Service(
                    id=s["id"],
                    service_name=s["service_name"],
                    description=s["description"],
                    duration=s["duration"],
                    price=s["price"],
                    category=s["category"],
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                session.add(new_service)
        session.commit()
        print("Service data added success!!")
    except Exception as e:
        session.rollback()
        print("Error:", e)
    finally:
        session.close()


if __name__ == "__main__":
    sync_services()

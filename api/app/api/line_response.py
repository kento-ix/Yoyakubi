from fastapi import APIRouter, Request, HTTPException
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, TextSendMessage

from app.core.config import settings

router = APIRouter()

line_bot_api = LineBotApi(settings.line_channel_access_token)
handler = WebhookHandler(settings.line_channel_secret)

# ユーザーの状態管理用（簡易）
user_states = {}

@router.post("/callback")
async def callback(request: Request):
    signature = request.headers.get("X-Line-Signature")
    body = await request.body()
    body_text = body.decode("utf-8")

    try:
        handler.handle(body_text, signature)
    except InvalidSignatureError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    return "OK"

@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    user_id = event.source.user_id
    incoming_text = event.message.text.strip()

    state = user_states.get(user_id, "START")

    if state == "START":
        if incoming_text == "1":
            reply_text = "ご予約ありがとうございます！\n・午前(9時〜12時)\n・午後(13時〜17時)\nどちらがご希望ですか?\n「午前」か「午後」でお答えください。"
            user_states[user_id] = "WAIT_TIME_PREFERENCE"
        elif incoming_text == "2":
            reply_text = "Googleカレンダー連携の予約は現在開発中です。しばらくお待ちください!"
        else:
            reply_text = "こんにちは！ご予約方法をお選びください😊\n1: LINEでそのまま予約\n2: Googleカレンダーと連携して予約\n数字でお答えください。"

    elif state == "WAIT_TIME_PREFERENCE":
        if incoming_text in ["午前", "午後"]:
            user_states[user_id] = "WAIT_DATE_SELECTION"
            # 仮の予約候補日を提示（DBで設計する）
            if incoming_text == "午前":
                candidates = ["4/10 10:00", "4/11 11:00", "4/12 09:30"]
            else:
                candidates = ["4/10 14:00", "4/11 15:30", "4/12 13:00"]

            reply_text = "ご希望の時間帯に基づく予約候補日です。\n以下の中から予約したい日時の番号を送信してください。\n"
            for i, c in enumerate(candidates, 1):
                reply_text += f"{i}: {c}\n"

            # 候補日を一時保存（DBで設計する)
            user_states[user_id+"_candidates"] = candidates
        else:
            reply_text = "すみません、「午前」か「午後」でお答えください。"

    elif state == "WAIT_DATE_SELECTION":
        candidates = user_states.get(user_id+"_candidates", [])
        
        if incoming_text in ["1", "2", "3"]:
            idx = int(incoming_text) - 1
            selected_date = candidates[idx]
            reply_text = f"ご予約を承りました！\n{selected_date}で予約を確定します。\nありがとうございます！"
            user_states[user_id] = "START"
            user_states.pop(user_id+"_candidates", None)
        else:
            reply_text = "1〜3の番号で予約候補日を選択してください。"

    else:
        reply_text = "エラーが発生しました。もう一度「1」か「2」でご予約方法を選択してください。"
        user_states[user_id] = "START"

    print(f"{user_id} says: {incoming_text} (state: {state})")

    line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text=reply_text)
    )

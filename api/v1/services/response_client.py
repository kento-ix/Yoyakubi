# response_client.py
from fastapi import APIRouter, Request, HTTPException, Depends
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage,
    TemplateSendMessage, ButtonsTemplate, URITemplateAction
)

from sqlalchemy.orm import Session
from core.config import settings
from db.database import get_db
from model.orm_reservation import User

router = APIRouter()

# test url
REGISTER_URL = "https://yoyakubi.vercel.app/"
MENU_URL = "https://yoyakubi.vercel.app/menu"

client_line_api = LineBotApi(settings.line_client_access_token)
handler = WebhookHandler(settings.line_client_secret)

@router.post("/callback")
async def callback(request: Request, db: Session = Depends(get_db)):
    signature = request.headers.get("X-Line-Signature")
    body = await request.body()
    body_text = body.decode("utf-8")

    print("Webhook受信:", body_text) 

    try:

        request.state.db = db
        handler.handle(body_text, signature)
    except InvalidSignatureError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    return "OK"


@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    incoming_text = event.message.text.strip()
    user_line_id = event.source.user_id
    print("ユーザー発言:", incoming_text, "LINE ID:", user_line_id)

    if incoming_text == "予約する":
        db: Session = getattr(event.source, "db", None)
        if db is None:
            from db.database import SessionLocal
            db = SessionLocal()
            
        user = db.query(User).filter(User.line_id == user_line_id).first()

        if user is None:
            text_message = TextSendMessage(
                text="当日予約をご希望の際は直接店舗までご連絡ください。\n xxx-xxxx-xxxx"
            )
            buttons = ButtonsTemplate(
                title="未登録ユーザー",
                text="まずは登録をお願いします",
                actions=[
                    URITemplateAction(label="登録する", uri=REGISTER_URL)
                ]
            )
            template_message = TemplateSendMessage(alt_text="登録ページへ", template=buttons)
        else:
            # 登録済み → メニューページに誘導
            buttons = ButtonsTemplate(
                title="予約メニュー",
                text="予約するメニューを選択してください",
                actions=[
                    URITemplateAction(label="メニューを見る", uri=MENU_URL)
                ]
            )
            template_message = TemplateSendMessage(alt_text="メニューへ", template=buttons)

        client_line_api.reply_message(event.reply_token, [text_message, template_message])
    else:
        reply = TextSendMessage(text="「予約する」と送信してください")
        client_line_api.reply_message(event.reply_token, reply)
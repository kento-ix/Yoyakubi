# response_client.py
from fastapi import APIRouter, Request, HTTPException, Depends
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage,
    TemplateSendMessage, ButtonsTemplate, URITemplateAction
)
from services.reserve_flow import (
    flow_reserve,
    flow_check_reservation,
    flow_setting,
    flow_default,
)

from sqlalchemy.orm import Session
from core.config import settings
from db.database import get_db
from model.orm_reservation import User, Reserve

router = APIRouter()

# test url
REGISTER_URL = "https://yoyakubi.vercel.app/customer-form"
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

    from db.database import SessionLocal
    db = SessionLocal()

    if incoming_text == "予約する":
        messages = flow_reserve(user_line_id, db)
        client_line_api.reply_message(event.reply_token, messages)

    elif incoming_text == "予約確認":
        reply = flow_check_reservation(user_line_id, db)
        client_line_api.reply_message(event.reply_token, reply)

    elif incoming_text == "設定":
        reply = flow_setting(user_line_id, db)
        client_line_api.reply_message(event.reply_token, reply)

    else:
        reply = flow_default()
        client_line_api.reply_message(event.reply_token, reply)
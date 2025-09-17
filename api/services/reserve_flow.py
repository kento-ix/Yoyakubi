from linebot.models import (
    TextSendMessage,
    TemplateSendMessage, ButtonsTemplate, URITemplateAction
)
from model.orm_reservation import User, Reserve
from db.database import SessionLocal

REGISTER_URL = "https://yoyakubi.vercel.app/customer-form"
MENU_URL = "https://yoyakubi.vercel.app/menu"


def flow_reserve(user_line_id: str, db):
    """
    Reserve flow
    """
    user = db.query(User).filter(User.line_id == user_line_id).first()

    if user is None:
        register_url_with_id = f"{REGISTER_URL}?line_id={user_line_id}"
        text_message = TextSendMessage(
            text="お客様情報の登録を行います。\n1分程度で完了しますのでお付き合い下さい。"
        )
        buttons = ButtonsTemplate(
            title="下記をタップして入力してください",
            text="登録をお願いします",
            actions=[
                URITemplateAction(label="入力フォームへ", uri=register_url_with_id)
            ]
        )
        template_message = TemplateSendMessage(alt_text="登録ページへ", template=buttons)
    else:
        text_message = TextSendMessage(
            text="当日予約をご希望の際は直接店舗までご連絡ください。\n xxx-xxxx-xxxx"
        )
        buttons = ButtonsTemplate(
            title="予約メニュー",
            text="予約するメニューを選択してください",
            actions=[
                URITemplateAction(label="メニューを見る", uri=MENU_URL)
            ]
        )
        template_message = TemplateSendMessage(alt_text="メニューへ", template=buttons)

    return [text_message, template_message]


def flow_check_reservation(user_line_id: str, db):
    """
    Reserve check flow
    """
    user = db.query(User).filter(User.line_id == user_line_id).first()

    if user is None:
        return TextSendMessage(text="ユーザー登録が必要です。「予約する」と送信してください。")

    reservation = db.query(Reserve).filter(Reserve.user_id == user.id).first()
    if reservation:
        return TextSendMessage(
            text=f"現在のご予約:\n日付: {reservation.date}\nメニュー: {reservation.menu_name}"
        )
    else:
        return TextSendMessage(text="現在、お客様のご予約はございません。")


def flow_setting(user_line_id: str, db):
    """
    Setting flow(user info update or register)
    """
    user = db.query(User).filter(User.line_id == user_line_id).first()

    if user:
        update_url_with_id = f"{REGISTER_URL}?line_id={user_line_id}"
        buttons = ButtonsTemplate(
            title="ユーザー情報の更新",
            text="登録情報を修正してください",
            actions=[
                URITemplateAction(label="フォームを開く", uri=update_url_with_id)
            ]
        )
        return TemplateSendMessage(alt_text="ユーザー情報更新", template=buttons)
    else:
        register_url_with_id = f"{REGISTER_URL}?line_id={user_line_id}"
        buttons = ButtonsTemplate(
            title="下記をタップして入力してください。",
            actions=[
                URITemplateAction(label="入力フォームへ", uri=register_url_with_id)
            ]
        )
        return TemplateSendMessage(alt_text="新規登録", template=buttons)


def flow_default():
    """
    Other than that
    """

    return TextSendMessage(text="ご要望をメニューから選択してください")

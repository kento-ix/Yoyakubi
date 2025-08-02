
1. Start server
uvicorn app.main:app --reload

2. Deploy FaspAPI (in different concole)
ngrok http 8000

Note: this url may change so check clearly

You can see on the screen like this
https://abcd1234.ngrok.io -> http://localhost:8000

in my case
https://bbeb809f6a5d.ngrok-free.app -> http://localhost:8000 

3. LINE developer console
-Messaging API 設定
- add Webhook URL (https://bbeb809f6a5d.ngrok-free.app/callback)
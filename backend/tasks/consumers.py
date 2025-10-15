from channels.generic.websocket import AsyncWebsocketConsumer
import json


class TaskConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope["user"].is_anonymous:
            await self.close()
            return
        self.group_name = "tasks" # simple single group; scope user is available
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)


    async def task_message(self, event):
        await self.send(text_data=event["text"])
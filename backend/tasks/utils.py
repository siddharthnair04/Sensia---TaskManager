import json
def broadcast_task_event(event, payload):
    try:
        from asgiref.sync import async_to_sync
        from channels.layers import get_channel_layer
        layer = get_channel_layer()
        if layer:
            async_to_sync(layer.group_send)(
                "tasks", {"type": "task.message", "text": json.dumps({"event": 
                                                                      event, "payload": serialize(payload)})}
                )
    except Exception:
        pass
def serialize(obj):
# Minimal serializer for Task or dict
    try:
        from .serializers import TaskSerializer
        from .models import Task
        if isinstance(obj, Task):
            return TaskSerializer(obj).data
        return obj
    except Exception:
        return obj
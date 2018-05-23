from channels import route, include


def message_handler(message):
    print(message['text'])


channel_routing = [
    include('apps.Message.routing.websocket_routing', path=r"^/message/stream"),
    include('apps.Message.routing.custom_routing'),
]
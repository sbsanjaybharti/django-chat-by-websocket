from channels import route

from apps.Message.consumers import ws_connect, ws_receive, ws_disconnect, chat_join, chat_leave, chat_send

websocket_routing = [
    # Called when WebSockets connect
    route("websocket.connect", ws_connect),

    # Called when WebSockets get sent a data frame
    route("websocket.receive", ws_receive),

    # Called when WebSockets disconnect
    route("websocket.disconnect", ws_disconnect),
]

# You can have as many lists here as you like, and choose any name.
# Just refer to the individual names in the include() function.
custom_routing = [
    # Handling different chat commands (websocket.receive is decoded and put
    # onto this channel) - routed on the "command" attribute of the decoded
    # message.
    route("chat.receive", chat_join, command="^join$"),
    route("chat.receive", chat_leave, command="^leave$"),
    route("chat.receive", chat_send, command="^send$"),
]
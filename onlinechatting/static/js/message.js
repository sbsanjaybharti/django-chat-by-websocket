$(function () {
    // Correctly decide between ws:// and wss://
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var ws_path = ws_scheme + '://' + window.location.host + "/message/stream/";
    console.log("Connecting to " + ws_path);
    var socket = new ReconnectingWebSocket(ws_path);
//    var socket = new WebSocket(ws_path);
    alert('ws_scheme:' + ws_scheme);
    // Helpful debugging
    socket.onopen = function (e) {
        console.log("Connected to chat socket");
    };
    // socket.onclose = function (e) {
    //     console.log("Disconnected from chat socket");
    // };

    socket.onmessage = function (message) {
        // Decode the JSON
        alert('1');
        console.log("Got websocket message " + message.data);
        var data = JSON.parse(message.data);
        // Handle errors
        if (data.error) {
            alert(data.error);
            return;
        }
        // Handle joining
        alert('');
        if (data.join) {
            console.log("Joining room " + data.join);
            var roomdiv = $(
                "<div class='room' id='room-" + data.join + "'>" +
                "<div class='messages'></div>" +
                "</div>"+
                '<div class="text_input form-group">'+
                '<div class="input-group input_group">'+
                '<span class="upload_file input-group-addon">'+
                '<span class="field-input input-file input_file">'+
                '<input name="file-1[]" id="imageAttach" class="imageAttach inputfile inputfile-1" data-multiple-caption="{count} files selected" multiple="" type="file">'+
                '<label class="image_upload" for="imageAttach"><i class="fa fa-picture-o" aria-hidden="true"></i></label>'+
                '</span>'+
                '<span class="field-input input-file input_file">'+
                '<input name="file-1[]" id="fileAttach" class="fileAttach inputfile inputfile-1" data-multiple-caption="{count} files selected" multiple="" type="file">'+
                '<label class="file_attach" for="fileAttach"><i class="fa fa-paperclip" aria-hidden="true"></i></label>'+
                '</span>'+
                '</span>'+
                '<input type="text" id="chat_box" class="form-control input_field chat_box" placeholder="Type here...">'+
                '<span class="input-group-btn send_btn">'+
                '<button class="btn btn-secondary rippler rippler-inverse" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>'+
                '</span>'+
                '</div>'+
                '</div>'
            );
            $("#chats").append(roomdiv);
            roomdiv.find("button").on("click", function () {
                socket.send(JSON.stringify({
                    "command": "send",
                    "room": data.join,
                    "message": roomdiv.find("input.chat_box").val()
                }));
                roomdiv.find("input").val("");
            });

            roomdiv.find("input.fileAttach").on("change", function () {
                var file_data = roomdiv.find("input.imageAttach").prop("files")[0]; // Getting the properties of file from file field
                alert(file_data);
                var form_data = new FormData(); // Creating object of FormData class
                var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
                form_data.append("name", file_data); // Appending parameter named file with properties of file_field to form_data
                form_data.append("csrfmiddlewaretoken", csrf_token);
                form_data.append("type", 'pdf');
                $.ajax({
                    url: "image/", // Upload Script
                    type: 'POST',
                    processData: false, // important
                    contentType: false, // important
                    dataType : 'json',
                    data: form_data, // Setting the data attribute of ajax with file_data
                    success: function(responce) {
                        // Do something after Ajax completes
                        var imgHtml = '<span class="sent_img"><a href="'+responce.name+'" target="_blank">Click here for file</a><span>';
                        socket.send(JSON.stringify({
                            "command": "send",
                            "room": data.join,
                            "message": imgHtml
                        }));
                    }
                });
            });
            roomdiv.find("input.imageAttach").on("change", function () {
                var file_data = roomdiv.find("input.imageAttach").prop("files")[0]; // Getting the properties of file from file field
                alert(file_data);
                var form_data = new FormData(); // Creating object of FormData class
                var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
                form_data.append("name", file_data); // Appending parameter named file with properties of file_field to form_data
                form_data.append("csrfmiddlewaretoken", csrf_token);
                form_data.append("type", 'image');
                alert('dd');
                $.ajax({
                    url: "image/", // Upload Script
                    type: 'POST',
                    processData: false, // important
                    contentType: false, // important
                    dataType : 'json',
                    data: form_data, // Setting the data attribute of ajax with file_data
                    success: function(responce) {
                        alert('ddqqq');
                        // Do something after Ajax completes
                        var imgHtml = '<span class="sent_img"><a href="'+responce.name+'" target="_blank"><img src="'+responce.name+'" title="'+responce.name+'" class="img-fluid" /></a><span>';
                        socket.send(JSON.stringify({
                            "command": "send",
                            "room": data.join,
                            "message": imgHtml
                        }));
                    }
                });
            });
            // Handle leaving
        } else if (data.leave) {
            console.log("Leaving room " + data.leave);
            $("#room-" + data.leave).remove();
        } else if (data.message || data.msg_type != 0) {
            var msgdiv = $("#chats_item");
            var ok_msg = "";
            // msg types are defined in chat/settings.py
            // Only for demo purposes is hardcoded, in production scenarios, consider call a service.
            switch (data.msg_type) {
                case 0:
                    // Message
                    ok_msg = '<div class="profile_menu profile_message clearfix">'+
                        '<div class="row align-middle">'+
                        '<div class="col-md-1">'+
                        '<span class="pro_img clearfix align-middle">'+
                        '<img class="profile_pic" src="' + data.profile_image + '" alt="profile_pic">'+
                        '</span>'+
                        '</div>'+
                        '<div class="col-md-11">'+
                        '<div class="user_info clearfix align-middle">'+
                        '<div class="user_name_time">'+
                        '<span class="user_name">'+data.first_name+' '+data.last_name+'</span>'+
                        '<span class="pro_time"></span>'+
                        '</div>'+
                        '<div class="user_role user_msg">'+
                        '<p class="content">'+data.message+'</p>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>';
                    break;
                case 1:
                    // Warning/Advice messages
                    ok_msg = "<div class='contextual-message text-warning'>" + data.message + "</div>";
                    break;
                case 2:
                    // Alert/Danger messages
                    ok_msg = "<div class='contextual-message text-danger'>" + data.message + "</div>";
                    break;
                case 3:
                    // "Muted" messages
                    ok_msg = "<div class='contextual-message text-muted'>" + data.message + "</div>";
                    break;
                case 4:
                    // User joined room
                    ok_msg = "<div class='contextual-message text-muted'>" + data.last_name + " is online!" + "</div>";
                    break;
                case 5:
                    // User left room
                    ok_msg = "<div class='contextual-message text-muted'>" + data.last_name + " went offline!" + "</div>";
                    break;
                default:
                    console.log("Unsupported message type!");
                    return;
            }
            msgdiv.append(ok_msg);
            msgdiv.scrollTop(msgdiv.prop("scrollHeight"));
        } else {
            console.log("Cannot handle message!");
        }
    };

    // Says if we joined a room or not by if there's a div for it
    function inRoom(roomId) {
        return $("#room-" + roomId).length > 0;
    };

    // Room join/leave
    roomId = $("#chat_room").attr("data-room-id");
    alert(roomId);
    if (inRoom(roomId)) {
        alert('Getting Offline')
        // Leave room
        $(this).removeClass("joined");
        socket.send(JSON.stringify({
            "command": "leave",  // determines which handler will be used (see chat/routing.py)
            "room": roomId
        }));
    } else {
        alert('Getting Online')
        // Join room
        $(this).addClass("joined");
        socket.send(JSON.stringify({
            "command": "join",
            "room": roomId
        }));
        alert('room_id:'+ roomId);
        alert('Getting Online_complete')
    }
    // Image File upload
    $("#fileAttach").change(function () {
        alert('start')

        var file_data = $("#fileAttach").prop("files")[0]; // Getting the properties of file from file field
        var form_data = new FormData(); // Creating object of FormData class
        var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
        form_data.append("name", file_data); // Appending parameter named file with properties of file_field to form_data
        form_data.append("csrfmiddlewaretoken", csrf_token);
        form_data.append("type", 'image');
        //Enable Loader
        //$('#fileAttachLoader').show();
        alert('end')

        roomId = $(this).attr("data-room-id");
        alert(roomId)
        if (inRoom(roomId)) {
            alert('leaave')
            // Leave room
            $(this).removeClass("joined");
            socket.send(JSON.stringify({
                "command": "leave",  // determines which handler will be used (see chat/routing.py)
                "room": roomId
            }));
        } else {
            alert('join')
            // Join room
            $(this).addClass("joined");
            socket.send(JSON.stringify({
                "command": "join",
                "room": roomId
            }));
            alert('joined')
        }
    });
});
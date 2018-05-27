import json

from django.contrib.auth.models import User
from channels import Group
from django.db import models
from django.utils import timezone

# Create your models here.
from onlinechatting.settings import MSG_TYPE_MESSAGE

class MessageGroup(models.Model):

    user = models.ForeignKey(User, related_name='message_group_user', null=True, on_delete=models.CASCADE)
    user_to = models.ForeignKey(User, related_name='message_group_advisor', null=True, on_delete=models.CASCADE)
    status = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, related_name='message_group_created_by', null=True, on_delete=models.CASCADE)
    updated_by = models.ForeignKey(User, related_name='message_group_updated_by', null=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now, blank=True)
    updated_at = models.DateTimeField(default=timezone.now, blank=True)
    def LastMessage(self):
        lastMessage = Message.objects.filter(group_id = self.id).last()
        return lastMessage

    def UnreadMessageCount(self):
        unreadMessage = Reciever.objects.filter(group_id = self.id, read = False).count()
        return unreadMessage

    class Meta:
        db_table = "message_group"
    @property
    def websocket_group(self):
        """
        Returns the Channels Group that sockets should subscribe to to get sent
        messages as they are generated.
        """
        return Group("room-%s" % self.id)

    def send_message(self, message, user, msg_type=MSG_TYPE_MESSAGE):
        """
        Called to send a message to the room on behalf of a user.
        """
        profile_image = "https://www.gravatar.com/avatar/"+ user.email+"?d=identicon"
        final_msg = {'room': str(self.id), 'message': message, 'profile_image': profile_image, 'first_name': user.first_name, 'last_name': user.last_name, 'msg_type': msg_type}

        # Send out the message to everyone in the room
        self.websocket_group.send(
            {"text": json.dumps(final_msg)}
        )

class Message(models.Model):

    parent_message = models.ForeignKey('self', related_name='message_parent', on_delete=models.CASCADE, null=True)
    content = models.TextField(null=True, blank=True)
    created_by = models.ForeignKey(User, related_name='message_created_by', null=True, on_delete=models.CASCADE)
    updated_by = models.ForeignKey(User, related_name='message_updated_by', null=True, on_delete=models.CASCADE)
    group = models.ForeignKey(MessageGroup, related_name='message_group', null=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now, blank=True)
    updated_at = models.DateTimeField(default=timezone.now, blank=True)

    class Meta:
        db_table = "message_message"
    @property
    def websocket_group(self):
        """
        Returns the Channels Group that sockets should subscribe to to get sent
        messages as they are generated.
        """
        return Group("room-%s" % self.id)

    def send_message(self, message, user, msg_type=MSG_TYPE_MESSAGE):
        """
        Called to send a message to the room on behalf of a user.
        """
        final_msg = {'room': str(self.id), 'message': message, 'username': user.username, 'msg_type': msg_type}

        # Send out the message to everyone in the room
        self.websocket_group.send(
            {"text": json.dumps(final_msg)}
        )

class Sender(models.Model):

    message = models.OneToOneField(Message, related_name='sender_message', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='sender_user', null=True, on_delete=models.CASCADE)
    time = models.TimeField(default=timezone.now, blank=True)
    group = models.ForeignKey(MessageGroup, related_name='sender_group', null=True, on_delete=models.CASCADE)

    class Meta:
        db_table = "message_sender"

class Reciever(models.Model):

    message = models.ForeignKey(Message, related_name='reciver_message', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='reciever_user', null=True, on_delete=models.CASCADE)
    time =  models.TimeField(default=timezone.now, blank=True)
    group = models.ForeignKey(MessageGroup, related_name='reciver_group', null=True, on_delete=models.CASCADE)
    read = models.BooleanField(default=True)

    class Meta:
        db_table = "message_reciever"

class File(models.Model):

    user = models.ForeignKey(User, related_name='file_user', null=True, on_delete=models.CASCADE)
    type = models.CharField(max_length=100, null=True, default='profile')
    name = models.FileField(null=True, blank=True)
    extention = models.CharField(max_length=100, null=True, blank=True)
    path = models.CharField(max_length=200, null=True, blank=True)
    status = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, related_name='file_created_by', null=True, on_delete=models.CASCADE)
    updated_by = models.ForeignKey(User, related_name='file_updated_by', null=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now, blank=True)
    updated_at = models.DateTimeField(default=timezone.now, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "file"

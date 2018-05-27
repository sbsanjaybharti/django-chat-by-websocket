from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from django.views.generic import ListView, CreateView

from apps.Message.forms import MessageImageForm
from apps.Message.models import MessageGroup, Sender, File


@login_required
class MessageView(ListView):
    model = MessageGroup

    def index(request):
        """
        Root page view. This is essentially a single-page app, if you ignore the
        login and admin parts.
        """
        user_obj = User.objects.all()

        # Render that in the index template
        return render(request, "index.html", {
            "user_obj": user_obj,
        })
    def chat(request):
        if request.GET.get('id'):
            chat_box_get_or_create = MessageGroup.objects.get_or_create(user_to_id=request.GET.get('id'), user=request.user, created_by=request.user, updated_by=request.user)
            message_chat_box= chat_box_get_or_create[0]
            sender_chat = Sender.objects.filter(group=chat_box_get_or_create[0])
        else:
            message_chat_box= None
            sender_chat = None
        message_groups = MessageGroup.objects.filter(user=request.user)

        # Render that in the index template
        return render(request, 'chat.html', {'message_groups':message_groups, 'message_chat_box':message_chat_box, 'sender_chat':sender_chat})


# Updating Profile Image
class UploadImage(CreateView):
    model = File
    form_class = MessageImageForm

    def get_object(self, queryset=None):
        try:
            user = File.objects.get(user_id=self.request.user.id)
        except:
            user = None
        return user

    def get_success_url(self):
        next = self.request.META.get('HTTP_REFERER')
        return next

    def form_valid(self, form):
        # File Type Extension
        cleaned_data = form.cleaned_data
        fileName = str(self.request.FILES['name'])
        extension = fileName.split(".")
        if self.request.POST['type'] == 'pdf':
            type = 'pdf'
        else:
            type = 'image'
        form.instance.type = type
        form.instance.status = 0
        form.instance.extention = extension[1]
        form.instance.user_id = self.request.user.id
        data_save = form.save()
        form = MessageImageForm()
        # super().form_valid(form)
        data = {
            'id': data_save.id,
            'name': data_save.name.url,
        }
        return JsonResponse(data)
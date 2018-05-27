from django import forms
from apps.Message.models import File

class MessageImageForm(forms.ModelForm):
    class Meta:
        model = File
        fields = ['type', 'name', 'extention']
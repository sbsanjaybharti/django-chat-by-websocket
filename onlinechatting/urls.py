"""onlinechatting URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import login, logout

from apps.Message.views import MessageView, UploadImage
from onlinechatting import settings

urlpatterns = [
    url(r'^$', login_required(MessageView.index), name='homepage'),  # The start point for index view
    url(r'^accounts/login/$', login, name='login'),  # The base django login view
    url(r'^accounts/logout/$', logout, name='logout'),  # The base django logout view
    url(r'^admin/', admin.site.urls),
    url(r'^chat/', login_required(MessageView.chat), name='Chat'),
    url(r'^chat/image/$', login_required(UploadImage.as_view()), name='user_message_image'),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
"""ss_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib.admin import site
from django.http import HttpResponseRedirect
from django.urls import include, path
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    path('', lambda r: HttpResponseRedirect('admin/'), name='admin_redirect'),
    path('admin/', site.urls),
    path('token-auth/', obtain_jwt_token),
    path('core/', include('core.urls')),
]

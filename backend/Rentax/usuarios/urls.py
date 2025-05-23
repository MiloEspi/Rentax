from django.urls import path
from .views import UsuarioRegistroView, GetUsuarioIDEmailView

urlpatterns = [
    path('registro/', UsuarioRegistroView.as_view(), name='registro'),
    path('getID/', GetUsuarioIDEmailView.as_view(), name='login'),
]

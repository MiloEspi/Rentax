from django.urls import path
from .views import login_view
from .views import enviar_codigo_admin
from .views import validar_codigo_admin
from .views import perfil_usuario


urlpatterns = [
    path('login/', login_view, name='login'),
    path('verificacionAdmin/', enviar_codigo_admin, name='verificacionAdmin'),
    path('validarCodigo/', validar_codigo_admin, name='validarCodigo'),
    path('perfil/', perfil_usuario, name='perfil_usuario'),

]

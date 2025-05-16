from django.contrib.auth.backends import BaseBackend
from usuarios.models import Persona  # o la ruta correcta

class EmailBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get('email')
        try:
            persona = Persona.objects.get(email=username)
            if persona.check_password(password):
                return persona
        except Persona.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return Persona.objects.get(pk=user_id)
        except Persona.DoesNotExist:
            return None

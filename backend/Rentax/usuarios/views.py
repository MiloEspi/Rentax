from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario
from .serializers import UsuarioSerializer

class UsuarioRegistroView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer



@method_decorator(csrf_exempt, name='dispatch')
class GetUsuarioIDEmailView(APIView):
    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'error': 'Falta el parámetro email.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            usuario = Usuario.objects.get(persona__email=email)
            return Response({'id': usuario.id, 'email': usuario.persona.email})
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)



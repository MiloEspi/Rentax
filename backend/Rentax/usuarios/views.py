from django.shortcuts import render

from rest_framework import generics
from .models import Usuario
from .serializers import UsuarioSerializer

class UsuarioRegistroView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

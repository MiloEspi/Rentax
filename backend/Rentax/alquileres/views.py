from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from .models import Alquiler
from .serializers import AlquilerSerializer




class AlquilerListCreateView(APIView):
    def get(self, request):
        alquileres = Alquiler.objects.all()
        serializer = AlquilerSerializer(alquileres, many=True)
        
        return Response(serializer.data)

    def post(self, request):
        serializer = AlquilerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AlquilerDetailView(APIView):
    def get(self, request, pk):
        alquiler = get_object_or_404(Alquiler, pk=pk)
        serializer = AlquilerSerializer(alquiler)
        return Response(serializer.data)

    def put(self, request, pk):
        alquiler = get_object_or_404(Alquiler, pk=pk)
        serializer = AlquilerSerializer(alquiler, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        alquiler = get_object_or_404(Alquiler, pk=pk)
        alquiler.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
# Create your views here.

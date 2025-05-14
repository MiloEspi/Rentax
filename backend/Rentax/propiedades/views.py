from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .models import Propiedad, Politica_De_Cancelacion, Localidad
from .serializers import PropiedadSerializer, PoliticaSerializer, LocalidadSerializer
from rest_framework import generics

 
class PropiedadDetailView(generics.RetrieveAPIView):
    queryset = Propiedad.objects.all()
    serializer_class = PropiedadSerializer
 
class ViviendaCreateView(APIView):
    def post(self, request):
        serializer = ViviendaSerializer(data=request.data)
        if serializer.is_valid():
            vivienda = serializer.save()
            return Response(ViviendaSerializer(vivienda).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class PoliticaListView(generics.ListAPIView):
    queryset = Politica_De_Cancelacion.objects.all()
    serializer_class = PoliticaSerializer

class LocalidadListView(APIView):
    def get(self, request):
        queryset = Localidad.objects.all()
        serializer = LocalidadSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = LocalidadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PropiedadListCreateView(APIView):
    def get(self, request):
        propiedades = Propiedad.objects.all()
        serializer = PropiedadSerializer(propiedades, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PropiedadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
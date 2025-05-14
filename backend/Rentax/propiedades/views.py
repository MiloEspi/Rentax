from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .models import Propiedad, Politica_De_Cancelacion, Localidad
from .serializers import PropiedadSerializer, PoliticaSerializer, LocalidadSerializer, ViviendaSerializer, CocheraSerializer, LocalComercialSerializer, PoliticaSinReembolsoSerializer, PoliticaConReembolsoCompletoSerializer, PoliticaConReembolsoParcialSerializer
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

class CocheraCreateView(APIView):
    def post(self, request):
        serializer = CocheraSerializer(data=request.data)
        if serializer.is_valid():
            cochera = serializer.save()
            return Response(CocheraSerializer(cochera).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class LocalCreateView(APIView):
    def post(self, request):
        serializer = LocalComercialSerializer(data=request.data)
        if serializer.is_valid():
            local = serializer.save()
            return Response(LocalComercialSerializer(local).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class PoliticaListView(APIView):
    def get(self, request):
        queryset = Politica_De_Cancelacion.objects.all()
        serializer = PoliticaSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PoliticaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PoliticaSinReembolsoCreateView(APIView):
    def post(self, request):
        serializer = PoliticaSinReembolsoSerializer(data=request.data)
        if serializer.is_valid():
            politica_sin_reembolso = serializer.save()
            return Response(PoliticaSinReembolsoSerializer(politica_sin_reembolso).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PoliticaConReembolsoCompletoCreateView(APIView):
    def post(self, request):
        serializer = PoliticaConReembolsoCompletoSerializer(data=request.data)
        if serializer.is_valid():
            politica_con_reembolso_completo = serializer.save()
            return Response(PoliticaConReembolsoCompletoSerializer(politica_con_reembolso_completo).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PoliticaConReembolsoParcialCreateView(APIView):
    def post(self, request):
        serializer = PoliticaConReembolsoParcialSerializer(data=request.data)
        if serializer.is_valid():
            politica_con_reembolso_parcial = serializer.save()
            return Response(PoliticaConReembolsoParcialSerializer(politica_con_reembolso_parcial).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
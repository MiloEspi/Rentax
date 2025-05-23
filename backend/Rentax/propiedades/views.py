from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .models import Propiedad, Politica_De_Cancelacion, Localidad, LocalComercial, Cochera, Vivienda,FotoPropiedad
from .serializers import PropiedadSerializer, PoliticaSerializer, FotoPropiedadSerializer,LocalidadSerializer, ViviendaSerializer, CocheraSerializer, LocalComercialSerializer, PoliticaSinReembolsoSerializer, PoliticaConReembolsoCompletoSerializer, PoliticaConReembolsoParcialSerializer
from rest_framework import generics
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
 

class PropiedadDetailView(APIView):
    def get(self, request, pk):
        propiedad = get_object_or_404(Propiedad, pk=pk)
        tipo = propiedad.tipoPropiedad.lower()
        if tipo == "vivienda":
            instancia = Vivienda.objects.get(pk=pk)
            serializer = ViviendaSerializer(instancia, context={'request': request})
        elif tipo == "cochera":
            instancia = Cochera.objects.get(pk=pk)
            serializer = CocheraSerializer(instancia, context={'request': request})
        elif tipo == "local":
            instancia = LocalComercial.objects.get(pk=pk)
            serializer = LocalComercialSerializer(instancia, context={'request': request})
        else:
            return Response({"error": "Tipo de propiedad desconocido"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_200_OK)
 
    def put(self, request, pk):
        propiedad = get_object_or_404(Propiedad, pk=pk)
        tipo = propiedad.tipoPropiedad.lower()
        # Selecciona el modelo y serializer correcto
        if tipo == "vivienda":
            instancia = Vivienda.objects.get(pk=pk)
            serializer_class = ViviendaSerializer
        elif tipo == "cochera":
            instancia = Cochera.objects.get(pk=pk)
            serializer_class = CocheraSerializer
        elif tipo == "local":
            instancia = LocalComercial.objects.get(pk=pk)
            serializer_class = LocalComercialSerializer
        else:
            return Response({"error": "Tipo de propiedad desconocido"}, status=status.HTTP_400_BAD_REQUEST)

        # Actualiza campos
        serializer = serializer_class(instancia, data=request.data, context={'request': request}, partial=True)
        if serializer.is_valid():
            propiedad_actualizada = serializer.save()

            # --- Manejo de fotos ---
            # 1. Mantener solo las fotos cuyo id está en fotos_existentes
            fotos_existentes_ids = request.data.getlist('fotos_existentes')
            if fotos_existentes_ids:
                fotos_existentes_ids = [int(fid) for fid in fotos_existentes_ids]
                # Elimina las fotos que no están en la lista
                for foto in propiedad.fotos.all():
                    if foto.id not in fotos_existentes_ids:
                        foto.delete()
            else:
                # Si no se envía nada, elimina todas
                propiedad.fotos.all().delete()

            # 2. Agregar nuevas fotos
            for foto_file in request.FILES.getlist('fotos'):
                FotoPropiedad.objects.create(propiedad=propiedad, imagen=foto_file)

            # Serializa y devuelve la propiedad actualizada
            serializer = serializer_class(instancia, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ViviendaCreateView(APIView):
    def post(self, request):
        serializer = ViviendaSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            vivienda = serializer.save()
            return Response(ViviendaSerializer(vivienda).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CocheraCreateView(APIView):
    def post(self, request):
        serializer = CocheraSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            cochera = serializer.save()
            return Response(CocheraSerializer(cochera).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class LocalCreateView(APIView):
    def post(self, request):
        serializer = LocalComercialSerializer(data=request.data, context={'request': request})
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
        serializer = PropiedadSerializer(propiedades, many=True, context={'request': request})  # <--- agrega context
        return Response(serializer.data)

    def post(self, request):
        serializer = PropiedadSerializer(data=request.data, context={'request': request})  # <--- agrega context
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def modificar_departamento(request, id):
    # Lógica para actualizar solo campos de Departamento
    # ...tu código aquí...
    return Response(...)

@api_view(['PUT'])
def modificar_casa(request, id):
    # Lógica para actualizar solo campos de Casa
    # ...tu código aquí...
    return Response(...)

@api_view(['PUT'])
def modificar_oficina(request, id):
    # Lógica para actualizar solo campos de Oficina
    # ...tu código aquí...
    return Response(...)

class ViviendaListView(APIView):
    def get(self, request):
        viviendas = Vivienda.objects.all()
        ciudad = request.GET.get('ciudad')
        huespedes = request.GET.get('huespedes')
        ambientes = request.GET.get('ambientes')
        banios = request.GET.get('banios')
        atributos = request.GET.get('atributos')  # Coma separada: "wifi,tv"

        if ciudad:
            viviendas = viviendas.filter(localidad__nombre__icontains=ciudad)
        if huespedes:
            viviendas = viviendas.filter(huespedes__gte=int(huespedes))
        if ambientes:
            viviendas = viviendas.filter(ambientes__gte=int(ambientes))
        if banios:
            viviendas = viviendas.filter(banios__gte=int(banios))
        if atributos:
            for atributo in atributos.split(','):
                viviendas = viviendas.filter(atributos__contains=[atributo])

        serializer = ViviendaSerializer(viviendas, many=True, context={'request': request})
        return Response(serializer.data)
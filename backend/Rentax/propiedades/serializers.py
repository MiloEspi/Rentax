from rest_framework import serializers
from .models import Propiedad, Politica_De_Cancelacion, Localidad, Vivienda, LocalComercial, Cochera, PoliticaSinReembolso, PoliticaConReembolsoCompleto, PoliticaConReembolsoParcial, FotoPropiedad
import json

class FotoPropiedadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FotoPropiedad
        fields = ['id', 'imagen', 'descripcion']

def clean_direccion_fields(validated_data):
    # Convierte '' a None y castea a int si corresponde
    for field in ['numero', 'piso']:
        value = validated_data.get(field, None)
        if value in ('', None):
            validated_data[field] = None
        else:
            try:
                validated_data[field] = int(value)
            except Exception:
                validated_data[field] = None
    # departamento: '' a None
    if validated_data.get('departamento', None) in ('', None):
        validated_data['departamento'] = None
    return validated_data

class PropiedadSerializer(serializers.ModelSerializer):
    fotos = FotoPropiedadSerializer(many=True, read_only=True)
    class Meta:
        model = Propiedad
        fields = '__all__'  # incluye todos los campos del modelo
        extra_fields = ['fotos']
    def validate_titulo(self, value):
        if Propiedad.objects.filter(titulo=value).exists():
            raise serializers.ValidationError("Ya existe una propiedad con ese titulo.")
        return value
    def create(self, validated_data):
        request = self.context.get('request')
        fotos_data = request.FILES.getlist('fotos') if request else []
        validated_data = clean_direccion_fields(validated_data)
        propiedad = Propiedad.objects.create(**validated_data)
        for foto in fotos_data:
            FotoPropiedad.objects.create(propiedad=propiedad, imagen=foto)
        return propiedad

class ViviendaSerializer(serializers.ModelSerializer):
    fotos = FotoPropiedadSerializer(many=True, read_only=True)
    class Meta:
        model = Vivienda
        fields = '__all__'
        extra_fields = ['fotos']
    def validate_titulo(self, value):
        if Propiedad.objects.filter(titulo=value).exists():
            raise serializers.ValidationError("Ya existe una propiedad con ese título.")
        return value
    def create(self, validated_data):
        request = self.context.get('request')
        fotos_data = request.FILES.getlist('fotos') if request else []
        validated_data = clean_direccion_fields(validated_data)
        atributos = validated_data.get('atributos')
        if isinstance(atributos, str):
            try:
                validated_data['atributos'] = json.loads(atributos)
            except Exception:
                validated_data['atributos'] = []
        vivienda = Vivienda.objects.create(**validated_data)
        for foto in fotos_data:
            FotoPropiedad.objects.create(propiedad=vivienda, imagen=foto)
        return vivienda

class LocalComercialSerializer(serializers.ModelSerializer):
    metros_cuadrados = serializers.FloatField()
    fotos = FotoPropiedadSerializer(many=True, read_only=True)
    class Meta:
        model = LocalComercial
        fields = '__all__'
        extra_fields = ['fotos']
    def validate_titulo(self, value):
        if Propiedad.objects.filter(titulo=value).exists():
            raise serializers.ValidationError("Ya existe una propiedad con ese titulo.")
        return value
    def create(self, validated_data):
        request = self.context.get('request')
        fotos_data = request.FILES.getlist('fotos') if request else []
        validated_data = clean_direccion_fields(validated_data)
        local = LocalComercial.objects.create(**validated_data)
        for foto in fotos_data:
            FotoPropiedad.objects.create(propiedad=local, imagen=foto)
        return local

class CocheraSerializer(serializers.ModelSerializer):
    fotos = FotoPropiedadSerializer(many=True, read_only=True)
    class Meta:
        model = Cochera
        fields = '__all__'
        extra_fields = ['fotos']
    def validate_titulo(self, value):
        if Propiedad.objects.filter(titulo=value).exists():
            raise serializers.ValidationError("Ya existe una propiedad con ese titulo.")
        return value
    def create(self, validated_data):
        request = self.context.get('request')
        fotos_data = request.FILES.getlist('fotos') if request else []
        validated_data = clean_direccion_fields(validated_data)
        cochera = Cochera.objects.create(**validated_data)
        for foto in fotos_data:
            FotoPropiedad.objects.create(propiedad=cochera, imagen=foto)
        return cochera

class PoliticaSerializer(serializers.ModelSerializer):
  class Meta:
    model = Politica_De_Cancelacion
    fields = '__all__'

class PoliticaSinReembolsoSerializer(serializers.ModelSerializer):
  politica = PoliticaSerializer()
  class Meta:
    model = PoliticaSinReembolso
    fields = '__all__'
  def create(self, validated_data):
      politica_data = validated_data.pop('politica')
      politica = Politica_De_Cancelacion.objects.create(**politica_data)
      return PoliticaSinReembolso.objects.create(politica=politica)
class PoliticaConReembolsoCompletoSerializer(serializers.ModelSerializer):
  politica = PoliticaSerializer()
  class Meta:
    model = PoliticaConReembolsoCompleto
    fields = '__all__'
  def create(self, validated_data):
    politica_data = validated_data.pop('politica')
    politica = Politica_De_Cancelacion.objects.create(**politica_data)
    return PoliticaConReembolsoCompleto.objects.create(politica=politica)

class PoliticaConReembolsoParcialSerializer(serializers.ModelSerializer):
  politica = PoliticaSerializer()
  class Meta:
    model = PoliticaConReembolsoParcial
    fields = '__all__'
  def create(self, validated_data):
      politica_data = validated_data.pop('politica')
      politica = Politica_De_Cancelacion.objects.create(**politica_data)
      return PoliticaConReembolsoParcial.objects.create(politica=politica)
class LocalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Localidad
        fields = '__all__'
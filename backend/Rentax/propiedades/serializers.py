from rest_framework import serializers
from .models import Propiedad, Politica_De_Cancelacion, Localidad, Vivienda, LocalComercial, Cochera, PoliticaSinReembolso, PoliticaConReembolsoCompleto, PoliticaConReembolsoParcial
from usuarios.models import Direccion
class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = '__all__'

class PropiedadSerializer(serializers.ModelSerializer):
    direccion = DireccionSerializer()   
    class Meta:
        model = Propiedad
        fields = '__all__'  # incluye todos los campos del modelo
    def validate_titulo(self, value):
      if Propiedad.objects.filter(titulo=value).exists():
        raise serializers.ValidationError("Ya existe una propiedad con ese titulo.")
      return value
    def create(self, validated_data):
        direccion_data = validated_data.pop('direccion')
        direccion = Direccion.objects.create(**direccion_data)
        return Propiedad.objects.create(direccion=direccion, **validated_data)
class ViviendaSerializer(serializers.ModelSerializer):
    direccion = DireccionSerializer()
    class Meta:
        model = Vivienda
        fields = '__all__'
    def validate_titulo(self, value):
      if Propiedad.objects.filter(titulo=value).exists():
        raise serializers.ValidationError("Ya existe una propiedad con ese título.")
      return value
    def create(self, validated_data):
      direccion_data = validated_data.pop('direccion')
      direccion = Direccion.objects.create(**direccion_data)
      # Asignamos la dirección manualmente antes de crear la vivienda
      vivienda = Vivienda.objects.create(direccion=direccion, **validated_data)
      return vivienda

class LocalComercialSerializer(serializers.ModelSerializer):
    direccion = DireccionSerializer()
    metros_cuadrados = serializers.FloatField()
    class Meta:
        model = LocalComercial
        fields = '__all__'
    def validate_titulo(self, value):
      if Propiedad.objects.filter(titulo=value).exists():
          raise serializers.ValidationError("Ya existe una propiedad con ese titulo.")
      return value
    def create(self, validated_data):
      direccion_data = validated_data.pop('direccion')
      direccion = Direccion.objects.create(**direccion_data)
      return LocalComercial.objects.create(direccion=direccion, **validated_data)
class CocheraSerializer(serializers.ModelSerializer):
    direccion = DireccionSerializer()
    class Meta:
        model = Cochera
        fields = '__all__'
    def validate_titulo(self, value):
      if Propiedad.objects.filter(titulo=value).exists():
          raise serializers.ValidationError("Ya existe una propiedad con ese titulo.")
      return value
    def create(self, validated_data):
      direccion_data = validated_data.pop('direccion')
      direccion = Direccion.objects.create(**direccion_data)
      return Cochera.objects.create(direccion=direccion, **validated_data)
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
from rest_framework import serializers
from .models import Persona, Usuario, Direccion

class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = '__all__'

class PersonaSerializer(serializers.ModelSerializer):
    direccion = DireccionSerializer()

    class Meta:
        model = Persona
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer()

    class Meta:
        model = Usuario
        fields = '__all__'

    def create(self, validated_data):
        persona_data = validated_data.pop('persona')
        direccion_data = persona_data.pop('direccion')

        direccion = Direccion.objects.create(**direccion_data)
        persona = Persona.objects.create(direccion=direccion, **persona_data)
        usuario = Usuario.objects.create(persona=persona)
        return usuario

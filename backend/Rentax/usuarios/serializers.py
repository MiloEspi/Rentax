from rest_framework import serializers
from .models import Persona, Usuario

class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    persona = PersonaSerializer()

    class Meta:
        model = Usuario
        fields = '__all__'
    def validate(self, data):
        persona_data = data.get('persona', {})
        dni = persona_data.get('dni')
        email = persona_data.get('email')
        if dni and Persona.objects.filter(dni=dni).exists():
            raise serializers.ValidationError({"persona": {"dni": "Ya existe un usuario con ese DNI."}})
        if email and Persona.objects.filter(email=email).exists():
            raise serializers.ValidationError({"persona": {"email": "Ya existe un usuario con ese email."}})
        return data

    def create(self, validated_data):
        persona_data = validated_data.pop('persona')
        persona, created = Persona.objects.get_or_create(**persona_data)
        usuario = Usuario.objects.create(persona=persona)
        return usuario

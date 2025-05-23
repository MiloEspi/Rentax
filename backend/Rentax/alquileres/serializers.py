from rest_framework import serializers
from .models import Alquiler
from propiedades.models import Propiedad
from datetime import timedelta

class AlquilerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alquiler
        exclude = ['codigo']  # Excluye 'codigo' para que no venga del front

    def validate(self, attrs):
        propiedad = attrs.get('perteneceAPropiedad')
        fechaInicio = attrs.get('fechaInicio')
        fechaFin = attrs.get('fechaFin')

        if not (propiedad and fechaInicio and fechaFin):
            raise serializers.ValidationError("Propiedad, fecha de inicio y fecha de fin son requeridos.")

        cantidadDias = (fechaFin - fechaInicio).days
        if cantidadDias < 1:
            raise serializers.ValidationError("La fecha de fin debe ser posterior a la fecha de inicio.")

        if not hasattr(propiedad, 'cantidadDiasMinimo'):
            propiedad = Propiedad.objects.get(id=propiedad.id if hasattr(propiedad, 'id') else propiedad)

        if cantidadDias < propiedad.cantidadDiasMinimo:
            raise serializers.ValidationError(
                f"La cantidad de días debe ser al menos {propiedad.cantidadDiasMinimo}."
            )

        return attrs

    def create(self, validated_data):
        # Asigna el código automáticamente
        validated_data['codigo'] = Alquiler.objects.count() + 1
        return super().create(validated_data)
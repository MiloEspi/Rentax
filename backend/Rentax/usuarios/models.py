from django.db import models

# Create your models here.
class Persona(models.Model):
    dni = models.CharField(max_length=8)
    nombre = models.CharField(max_length=70)
    apellido = models.CharField(max_length=70)
    email = models.CharField(
        max_length=60,
        unique=True,
        error_messages={
            'unique': 'El correo electrónico ya se encuentra registrado',
        }
    )
    fecha_nacimiento = models.DateField()
    sexo = models.CharField(max_length=20)
    password = models.CharField(max_length=50, null=True)

    def __str__(self):
        return self.nombre + self.apellido

class Usuario(models.Model):
    persona = models.OneToOneField(Persona, on_delete=models.CASCADE)

class Empleado(models.Model):
    persona = models.OneToOneField(Persona, on_delete=models.CASCADE)

class Gerente(models.Model):
    persona = models.OneToOneField(Persona, on_delete=models.CASCADE)
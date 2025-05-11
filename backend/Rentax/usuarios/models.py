from django.db import models

# Create your models here.
class Direccion(models.Model):
    calle=models.CharField()
    numero=models.IntegerField()
    piso=models.IntegerField(null=True)
    departamento=models.CharField(max_length=10,null=True)
class Persona(models.Model):
    dni=models.CharField(max_length=8)
    nombre=models.CharField(max_length=70)
    apellido=models.CharField(max_length=70)
    mail=models.CharField(max_length=60)
    FechaDeNacimiento=models.DateField()
    edad=models.IntegerField
    sexo=models.CharField(max_length=1)
    direccion=models.ForeignKey(Direccion,on_delete=models.SET_NULL, null=True)
    def __str__(self):
        return self.nombre + self.apellido
class Usuario(models.Model):
    persona=models.OneToOneField(Persona, on_delete=models.CASCADE)
class Empleado(models.Model):
    persona=models.OneToOneField(Persona, on_delete=models.CASCADE)
class Gerente(models.Model):
    persona=models.OneToOneField(Persona, on_delete=models.CASCADE)    

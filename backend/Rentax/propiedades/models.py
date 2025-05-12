from django.db import models
from usuarios.models import Direccion

# Create your models here.
class Localidad(models.Model):
    codigoPostal=models.IntegerField()
    nombre=models.CharField(max_length=60)
class Politica_De_Cancelacion(models.Model):
    politica=models.CharField(max_length=20)
    def _str_(self):
        return self.nombre    
class Propiedad(models.Model):
    titulo = models.TextField(max_length=400)
    direccion = models.ForeignKey(Direccion, on_delete=models.CASCADE)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    ambientes = models.IntegerField()
    descripcion = models.TextField()
    politica=models.ForeignKey(Politica_De_Cancelacion,on_delete=models.SET_NULL, null=True)
    localidad=models.ForeignKey(Localidad,on_delete=models.CASCADE, null=True)
    def __str__(self):
        return self.titulo 
class Cochera(Propiedad):
    cupo_de_autos=models.IntegerField()
class Vivienda(Propiedad):
    caracteristicas=models.TextField(max_length=200) 
    huespedes = models.IntegerField(null=True)
    cantidadDiasMinimo = models.IntegerField(null=True)
    baños= models.IntegerField(null=True)
class LocalComercial(Propiedad):
     caracteristicas=models.TextField(max_length=200)   
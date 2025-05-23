from django.db import models
# Create your models here.
class Localidad(models.Model):
    codigoPostal=models.IntegerField()
    nombre=models.CharField(max_length=60)
class Politica_De_Cancelacion(models.Model):
    politica=models.CharField(max_length=20)
    def _str_(self):
        return self.politica   
class PoliticaSinReembolso(models.Model):
    politica=models.OneToOneField(Politica_De_Cancelacion, on_delete=models.CASCADE)
class PoliticaConReembolsoCompleto(models.Model): 
    politica=models.OneToOneField(Politica_De_Cancelacion, on_delete=models.CASCADE) 
class PoliticaConReembolsoParcial(models.Model):
    politica=models.OneToOneField(Politica_De_Cancelacion, on_delete=models.CASCADE)
class Propiedad(models.Model):
    titulo = models.TextField(max_length=400)
    calle = models.CharField(max_length=255)
    numero = models.IntegerField(default=-1)
    piso = models.IntegerField(null=True, blank=True)
    departamento = models.CharField(max_length=10, null=True, blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField()
    politica=models.ForeignKey(Politica_De_Cancelacion,on_delete=models.SET_NULL, null=True)
    localidad=models.ForeignKey(Localidad,on_delete=models.CASCADE, null=True)
    tipoPropiedad=models.CharField(max_length=20)
    cantidadDiasMinimo = models.IntegerField(null=True)


    def __str__(self):
        return self.titulo 

class FotoPropiedad(models.Model):
    propiedad = models.ForeignKey(Propiedad, on_delete=models.CASCADE, related_name='fotos')
    imagen = models.ImageField(upload_to='propiedades/')
    descripcion = models.CharField(max_length=200, blank=True) 

class Cochera(Propiedad):
    cupo_de_autos=models.IntegerField()
class Vivienda(Propiedad):
    huespedes = models.IntegerField(null=True)
    banios = models.IntegerField(null=True)

    ambientes = models.IntegerField()
    # Nuevos campos
    atributos = models.JSONField(default=list, blank=True)  # Ej: ["wifi", "pileta"]
    # Las fotos se relacionan por el modelo FotoPropiedad
class LocalComercial(Propiedad):
    metros_cuadrados = models.IntegerField(null=True, blank=True)
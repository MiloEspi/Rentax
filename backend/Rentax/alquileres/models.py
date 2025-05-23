from django.db import models
from usuarios.models import Usuario
from propiedades.models import Propiedad
# Create your models here.
class Alquiler(models.Model):
    codigo=models.CharField(max_length=10)
    fechaInicio=models.DateField()
    fechaFin=models.DateField()
    precio=models.DecimalField(max_digits=10, decimal_places=2)
    inquilino=models.ForeignKey(Usuario,on_delete=models.CASCADE)
    perteneceAPropiedad=models.ForeignKey(Propiedad,on_delete=models.CASCADE,null=True)


from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('propiedades', '0001_initial'),
        ('usuarios', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Alquiler',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codigo', models.CharField(max_length=10)),
                ('fechaInicio', models.DateField()),
                ('fechaFin', models.DateField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('cantidadDias', models.IntegerField()),
                ('inquilino', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='usuarios.usuario')),
                ('perteneceAPropiedad', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='propiedades.propiedad')),
            ],
        ),
    ]

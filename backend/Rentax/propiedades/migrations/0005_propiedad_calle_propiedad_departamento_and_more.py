# Generated by Django 4.2.21 on 2025-05-20 01:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('propiedades', '0004_remove_propiedad_calle_remove_propiedad_departamento_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='propiedad',
            name='calle',
            field=models.CharField(default='sin calle', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='propiedad',
            name='departamento',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='propiedad',
            name='descripcion',
            field=models.TextField(default='sin descrip'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='propiedad',
            name='localidad',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='propiedades.localidad'),
        ),
        migrations.AddField(
            model_name='propiedad',
            name='numero',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='propiedad',
            name='piso',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='propiedad',
            name='politica',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='propiedades.politica_de_cancelacion'),
        ),
        migrations.AddField(
            model_name='propiedad',
            name='precio',
            field=models.DecimalField(decimal_places=2, default=0.0 , max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='propiedad',
            name='titulo',
            field=models.TextField(default='sin titulo', max_length=400),
            preserve_default=False,
        ),
    ]

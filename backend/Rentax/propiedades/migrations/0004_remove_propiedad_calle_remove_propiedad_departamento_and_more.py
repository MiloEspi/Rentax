# Generated by Django 4.2.21 on 2025-05-20 00:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('propiedades', '0003_alter_propiedad_titulo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='propiedad',
            name='calle',
        ),
        migrations.RemoveField(
            model_name='propiedad',
            name='departamento',
        ),
        migrations.RemoveField(
            model_name='propiedad',
            name='descripcion',
        ),
        migrations.RemoveField(
            model_name='propiedad',
            name='localidad',
        ),
        migrations.RemoveField(
            model_name='propiedad',
            name='numero',
        ),
        migrations.RemoveField(
            model_name='propiedad',
            name='piso',
        ),
        migrations.RemoveField(
            model_name='propiedad',
            name='politica',
        ),
        migrations.RemoveField(
            model_name='propiedad',
            name='precio',
        ),
        migrations.RemoveField(
            model_name='propiedad',
            name='titulo',
        ),
    ]

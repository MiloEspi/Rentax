

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Localidad',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codigoPostal', models.IntegerField()),
                ('nombre', models.CharField(max_length=60)),
            ],
        ),
        migrations.CreateModel(
            name='Politica_De_Cancelacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('politica', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Propiedad',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.TextField(max_length=400)),
                ('calle', models.CharField(max_length=255)),
                ('numero', models.IntegerField()),
                ('piso', models.IntegerField(blank=True, null=True)),
                ('departamento', models.CharField(blank=True, max_length=10, null=True)),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('descripcion', models.TextField()),
                ('localidad', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='propiedades.localidad')),
                ('politica', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='propiedades.politica_de_cancelacion')),
            ],
        ),
        migrations.CreateModel(
            name='Cochera',
            fields=[
                ('propiedad_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='propiedades.propiedad')),
                ('cupo_de_autos', models.IntegerField()),
            ],
            bases=('propiedades.propiedad',),
        ),
        migrations.CreateModel(
            name='LocalComercial',
            fields=[
                ('propiedad_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='propiedades.propiedad')),
                ('metros_cuadrados', models.IntegerField(blank=True, null=True)),
            ],
            bases=('propiedades.propiedad',),
        ),
        migrations.CreateModel(
            name='Vivienda',
            fields=[
                ('propiedad_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='propiedades.propiedad')),
                ('huespedes', models.IntegerField(null=True)),
                ('cantidadDiasMinimo', models.IntegerField(null=True)),
                ('banios', models.IntegerField(null=True)),
                ('ambientes', models.IntegerField()),
                ('atributos', models.JSONField(blank=True, default=list)),
            ],
            bases=('propiedades.propiedad',),
        ),
        migrations.CreateModel(
            name='PoliticaSinReembolso',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('politica', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='propiedades.politica_de_cancelacion')),
            ],
        ),
        migrations.CreateModel(
            name='PoliticaConReembolsoParcial',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('politica', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='propiedades.politica_de_cancelacion')),
            ],
        ),
        migrations.CreateModel(
            name='PoliticaConReembolsoCompleto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('politica', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='propiedades.politica_de_cancelacion')),
            ],
        ),
        migrations.CreateModel(
            name='FotoPropiedad',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imagen', models.ImageField(upload_to='propiedades/')),
                ('descripcion', models.CharField(blank=True, max_length=200)),
                ('propiedad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fotos', to='propiedades.propiedad')),
            ],
        ),
    ]

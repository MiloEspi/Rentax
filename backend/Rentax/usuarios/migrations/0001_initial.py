

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Persona',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dni', models.CharField(max_length=8)),
                ('nombre', models.CharField(max_length=70)),
                ('apellido', models.CharField(max_length=70)),
                ('email', models.CharField(max_length=60, unique=True)),
                ('fecha_nacimiento', models.DateField()),
                ('sexo', models.CharField(max_length=20)),
                ('password', models.CharField(max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('persona', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='usuarios.persona')),
            ],
        ),
        migrations.CreateModel(
            name='Gerente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('persona', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='usuarios.persona')),
            ],
        ),
        migrations.CreateModel(
            name='Empleado',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('persona', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='usuarios.persona')),
            ],
        ),
    ]

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from usuarios.models import Persona, Gerente
import json

import random
from django.core.cache import cache
from django.core.mail import send_mail
# -*- coding: utf-8 -*-

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            if not email or not password:
                return JsonResponse({'success': False, 'error': 'Email y contraseña requeridos'}, status=400)
            try:
                persona = Persona.objects.get(email=email)
                if persona.password == password:
                    es_admin = Gerente.objects.filter(persona=persona).exists()
                    if es_admin:
                        # No iniciar sesión aún, pedir verificación
                        return JsonResponse({'success': False, 'is_admin': True})
                    else:
                        # Usuario normal, iniciar sesión
                        return JsonResponse({'success': True, 'is_admin': False})
                else:
                    return JsonResponse({'success': False, 'error': 'Credenciales incorrectas'}, status=400)
            except Persona.DoesNotExist:
                return JsonResponse({'success': False, 'error': 'Usuario no encontrado'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método no permitido'}, status=405)


@csrf_exempt
def enviar_codigo_admin(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            if not email:
                return JsonResponse({'success': False, 'error': 'Email requerido'}, status=400)
            try:
                persona = Persona.objects.get(email=email)
                # Generar código de 6 dígitos
                codigo = str(random.randint(100000, 999999))
                # Guardar en caché por 10 minutos
                cache.set(f'codigo_admin_{email}', codigo, timeout=600)
                # Enviar email
                send_mail(
                    'Codigo de verificacion Rentax',
                    f'Tu codigo de verificacion es: {codigo}',
                    None,
                    [email],
                    fail_silently=False,
                )               
                return JsonResponse({'success': True})
            except Persona.DoesNotExist:
                return JsonResponse({'success': False, 'error': 'Usuario no encontrado'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    return JsonResponse({'error': 'Metodo no permitido'}, status=405)


@csrf_exempt
def validar_codigo_admin(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            codigo = data.get('codigo')
            if not email or not codigo:
                return JsonResponse({'success': False, 'error': 'Datos incompletos'}, status=400)
            codigo_guardado = cache.get(f'codigo_admin_{email}')
            if codigo_guardado == codigo:
                cache.delete(f'codigo_admin_{email}')
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'error': 'Código incorrecto'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def perfil_usuario(request):
    if request.method == 'POST':
        # Lógica existente para obtener el perfil
        try:
            data = json.loads(request.body)
            email = data.get('email')
            if not email:
                return JsonResponse({'success': False, 'error': 'Email requerido'}, status=400)
            try:
                persona = Persona.objects.get(email=email)
                return JsonResponse({
                    'success': True,
                    'persona': {
                        'nombre': persona.nombre,
                        'apellido': persona.apellido,
                        'email': persona.email,
                        'fecha_nacimiento': str(persona.fecha_nacimiento),
                        'sexo': persona.sexo,
                        'dni': persona.dni,
                    }
                })
            except Persona.DoesNotExist:
                return JsonResponse({'success': False, 'error': 'Error al cargar perfil'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    elif request.method == 'PUT':
        # Nueva lógica para actualizar el perfil
        try:
            data = json.loads(request.body)
            email = data.get('email')
            if not email:
                return JsonResponse({'success': False, 'error': 'Email requerido'}, status=400)
            try:
                persona = Persona.objects.get(email=email)
                persona.nombre = data.get('nombre', persona.nombre)
                persona.apellido = data.get('apellido', persona.apellido)
                persona.fecha_nacimiento = data.get('fecha_nacimiento', persona.fecha_nacimiento)
                persona.sexo = data.get('sexo', persona.sexo)
                if 'password' in data and data['password']:
                    persona.password = data['password']  # Considera encriptar la contraseña
                persona.save()
                return JsonResponse({'success': True, 'message': 'Perfil actualizado correctamente'})
            except Persona.DoesNotExist:
                return JsonResponse({'success': False, 'error': 'Persona no encontrada'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)
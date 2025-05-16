import json
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def login_view(request):
    if request.method != "POST":
        logger.warning(f"Method no permitido: {request.method}")
        return JsonResponse({'error': 'Método no permitido'}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        logger.info(f"Intentando login con email: {email}")

        if not email or not password:
            return JsonResponse({'success': False, 'error': 'Email o contraseña vacíos'}, status=400)

        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            logger.info(f"Usuario {email} autenticado correctamente.")
            return JsonResponse({'success': True})
        else:
            logger.info(f"Autenticación fallida para usuario: {email}")
            return JsonResponse({'success': False, 'error': 'Credenciales inválidas'}, status=401)

    except json.JSONDecodeError:
        logger.error("JSON inválido en la petición")
        return JsonResponse({'error': 'JSON inválido'}, status=400)

    except Exception as e:
        logger.error(f"Error inesperado: {e}")
        return JsonResponse({'error': 'Error en el servidor'}, status=500)

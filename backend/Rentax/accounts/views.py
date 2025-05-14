from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
import json

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            # Autenticar al usuario
            user = authenticate(request, username=email, password=password)

            if user is not None:
                # Si las credenciales son válidas, devolver éxito
                return JsonResponse({'success': True, 'message': 'Inicio de sesión exitoso'})
            else:
                # Si las credenciales no son válidas
                return JsonResponse({'success': False, 'error': 'Credenciales inválidas'}, status=401)

        except json.JSONDecodeError:
            # Si el JSON enviado es inválido
            return JsonResponse({'success': False, 'error': 'JSON inválido'}, status=400)

    # Si el método no es POST
    return JsonResponse({'error': 'Método no permitido'}, status=405)
from django.urls import path
from .views import PropiedadListCreateView
urlpatterns = [
    path('propiedades/', PropiedadListCreateView.as_view(), name='propiedad-list-create'),
]

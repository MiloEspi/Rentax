from django.urls import path
from .views import PropiedadListCreateView, PoliticaListView, LocalidadListView,ViviendaCreateView
urlpatterns = [
    path('propiedades/', PropiedadListCreateView.as_view(), name='propiedad-list-create'),
    path('politicas/', PoliticaListView.as_view(), name='politica-list'),
    path('localidades/', LocalidadListView.as_view(), name='localidad-list'),
     path('viviendas/', ViviendaCreateView.as_view(), name='vivienda-create'),
]

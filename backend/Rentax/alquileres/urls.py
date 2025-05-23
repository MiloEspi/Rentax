from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlquilerDetailView, AlquilerListCreateView 


urlpatterns = [
    path('alquileres/', AlquilerListCreateView.as_view(), name='alquiler-list-create'),
    path('alquiler/<int:pk>/', AlquilerDetailView.as_view(), name='alquiler-detail'),
    
]

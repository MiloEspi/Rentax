
urlpatterns = [
    path('propiedades/', PropiedadListCreateView.as_view(), name='propiedad-list-create'),
    path('politicas/', PoliticaListView.as_view(), name='politica-list'),
    path('politicas/sin_reembolso/', PoliticaSinReembolsoCreateView.as_view(), name='politica-sin-reembolso-create'),
    path('politicas/con_reembolso_completo/', PoliticaConReembolsoCompletoCreateView.as_view(), name='politica-con-reembolso-completo-create'), 
    path('politicas/con_reembolso_parcial/', PoliticaConReembolsoParcialCreateView.as_view(), name='politica-con-reembolso-parcial-create'),
    path('localidades/', LocalidadListView.as_view(), name='localidad-list'),
    path('viviendas/', ViviendaCreateView.as_view(), name='vivienda-create'),
    path('cocheras/',CocheraCreateView.as_view(),name='cochera-create'),
    path('local/', LocalCreateView.as_view(), name='local-create'),
     path ('propiedades/<int:pk>/', PropiedadDetailView.as_view(), name='propiedad-detail'),
]

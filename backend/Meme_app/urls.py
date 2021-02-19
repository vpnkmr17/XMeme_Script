from django.urls import path
from . import views

urlpatterns=[
    path('',views.meme_generic_view),
    # path('',views.meme_create_view),
    path('<int:meme_id>/',views.meme_detail_view),
    path('update/<int:meme_id>',views.meme_update_view)
]
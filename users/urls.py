from . import views
from django.urls import path

app_name = "users"

urlpatterns = [
    path("register/", views.CreateUser.as_view(), name="register"),
    path("logout/blacklist/", views.BlacklistToken.as_view(), name="logout"),
]

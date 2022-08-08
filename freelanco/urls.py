from django.urls import path
from .api import urls as api_urls

app_name = "users"

urlpatterns = [

]

urlpatterns += api_urls.urlpatterns

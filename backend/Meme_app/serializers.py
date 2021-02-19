from rest_framework import serializers
from django.conf import settings
from .models import Post
from django.conf import settings

# This serializer is used to create the meme 
class MemeCreateserializer(serializers.ModelSerializer):
    class Meta:
        model=Post
        fields=['id','name','caption','url','timestamp']
# This serializer is used to read the meme
class MemeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Post
        fields=['id','name','caption','url']
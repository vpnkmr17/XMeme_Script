
from django.shortcuts import render,redirect
from django.http import HttpResponse,Http404,JsonResponse
from rest_framework.response import Response 
from rest_framework.decorators import api_view
from .serializers import MemeCreateserializer,MemeSerializer
from .models import Post
from datetime import datetime


# Create your views here.

# Api to get the list of memes from databse
# Here i have sorted the list of memes by timestamp so that
# i can get the latest memes first
# URL:http://127.0.0.1:8000/memes/
@api_view(['GET','POST'])
def meme_generic_view(request,*args,**kwargs):
    if request.method=='GET':
        obj=Post.objects.order_by('-timestamp')
        serializer=MemeSerializer(obj,many=True)
        return Response(serializer.data)
    elif request.method=='POST':
        data=request.data or None
        serializer=MemeCreateserializer(data=data)

        if serializer.is_valid(raise_exception=True):
            caption=serializer.validated_data['caption']
            url=serializer.validated_data['url']
            user=serializer.validated_data['name']
            caption_check=Post.objects.filter(caption=caption)
            url_check=Post.objects.filter(url=url)
            user_check=Post.objects.filter(name=user)
            if (not caption_check) and (not user_check) and (not url_check):
                serializer.save()
                return Response(serializer.data,status=201)
            else:
                return Response({"error":"Meme already exists!"},status=409)
        return Response({"error":"not sended"},status=400)



# This Api is used to update the memes
# Here i am also updating the timestamp so that the
# edited meme shows first
# URL:http://127.0.0.1:8000/memes/update/1
@api_view(['POST','PATCH'])
def meme_update_view(request,meme_id,*args,**kwargs):
    data=request.data
    _mutable = data._mutable

    # set to mutable
    data._mutable = True

    # сhange the values you want
    data['timestamp'] = datetime.now()

    # set mutable flag back
    data._mutable = _mutable
    print(data)
    obj=Post.objects.filter(id=meme_id)
    obj=obj.first()
    serializer=MemeSerializer(obj,data,partial=True)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data,status=204)


# This Api is used to get the specific id meme
# URL:http://127.0.0.1:8000/memes/2/
@api_view(['GET'])
def meme_detail_view(request,meme_id,*args,**kwargs):
    obj=Post.objects.filter(id=meme_id)
    if not obj.exists():
        return Response({},status=404)
    obj=obj.first()
    serializer=MemeSerializer(obj)
    return Response(serializer.data)
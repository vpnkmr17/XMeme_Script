#!/bin/bash


cd backend


# Setup DB or any other environment variables you want to setup.

python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py makemigrations
python3 manage.py runserver

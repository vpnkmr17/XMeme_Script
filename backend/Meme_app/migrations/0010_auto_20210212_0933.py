# Generated by Django 3.0.3 on 2021-02-12 04:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Meme_app', '0009_auto_20210212_0925'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
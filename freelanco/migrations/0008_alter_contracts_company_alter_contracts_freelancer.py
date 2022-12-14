# Generated by Django 4.0.6 on 2022-08-08 10:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('freelanco', '0007_alter_proposals_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contracts',
            name='company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='freelanco.company'),
        ),
        migrations.AlterField(
            model_name='contracts',
            name='freelancer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='freelanco.freelancer'),
        ),
    ]

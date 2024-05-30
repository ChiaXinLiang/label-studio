"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license.
"""
from core.utils.common import find_editor_files
from core.version import get_short_version
from django.contrib.auth.decorators import login_required
from django.shortcuts import render


""" @login_required
def task_page(request, pk):
    response = {'version': get_short_version()}
    response.update(find_editor_files())
    return render(request, 'base.html', response)
 """


from django.contrib.auth import get_user_model
from users.functions import login

def task_page(request, pk):
    email = 'yillkid@gmail.com'  # Replace with an email already in the database
    user = get_user_model().objects.get(email=email)
    login(request, user, backend='django.contrib.auth.backends.ModelBackend')

    response = {'version': get_short_version()}
    response.update(find_editor_files())
    return render(request, 'base.html', response)

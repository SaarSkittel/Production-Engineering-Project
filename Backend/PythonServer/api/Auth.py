import datetime
from django.conf import settings
import jwt
access_token = settings.ACCCESS_TOKEN_SECRET
refresh_token = settings.REFRESH_TOKEN_SECRET


def verify_access_token(token):
    data = jwt.decode(token, access_token)
    if data["exp"] < datetime.now(tz=datetime.timezone.utc):
        pass
    else:
        pass


def verify_refresh_token(token):
    data = jwt.decode(token, refresh_token)
    if data["exp"] < datetime.now(tz=datetime.timezone.utc):
        pass
    else:
        pass


def generate_access_token(user):
    token = jwt.encode({"user_name": user, "iat": datetime.now(tz=datetime.timezone.utc), "exp": datetime.datetime.now(
        tz=datetime.timezone.utc) + datetime.timedelta(hours=1)}, access_token, algorithm="HS256")
    return token


def generate_refresh_token(user):
    token = jwt.encode({"user_name": user, "iat": datetime.now(tz=datetime.timezone.utc), "exp": datetime.datetime.now(
        tz=datetime.timezone.utc) + datetime.timedelta(hours=24)}, refresh_token, algorithm="HS256")
    return token

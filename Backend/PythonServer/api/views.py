from rest_framework.decorators import api_view
from rest_framework.response import Response
from Auth import generate_refresh_token, generate_access_token

from .Queries import Queries
import json
DB = Queries()


@api_view(["POST"])
def login(request):
    db_data = DB.get_user_info_for_login(request.data["userName"])[0]

    if request.data["userName"] == db_data["user_name"] and request.data["password"] == db_data["password"]:
        return Response()


@ api_view(['GET'])
def api_home(request):
    return Response({"message": "Hello World!!!"})


@ api_view(["POST"])
def register(request):
    values = tuple(request.data.values())
    print(values)
    result = DB.get_user_info_by_name(values[0])
    print(result)
    if len(result) == 0:
        print("test")
        DB.add_user(values)
    return Response()


@ api_view(["POST"])
def change_password(request):
    # user name should be decode from JWT
    # new password is give from post request
    pass


@ api_view(["GET"])
def users(request):
    id = request.GET.get('id')
    name = request.GET.get('name')
    if id != None and id.isnumeric():
        users = DB.get_user_info_by_ID(id)
    elif name != None:
        users = DB.get_user_info_by_name(name)
    else:
        users = DB.get_all_users_info()
    return Response(users)


@ api_view(["DELETE"])
def logout(request):
    pass


@ api_view(["POST"])
def token(request):
    pass

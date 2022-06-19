import pymysql


class Queries:
    def __init__(self) -> None:
        dbServerName = "db"
        dbUser = "Saar"
        dbPassword = "Password"
        dbName = "users"
        charSet = "utf8mb4"
        cusrorType = pymysql.cursors.DictCursor
        self.connectionObject = pymysql.connect(host=dbServerName, user=dbUser, password=dbPassword,
                                                db=dbName, charset=charSet, cursorclass=cusrorType)
        self.cursorObject = self.connectionObject.cursor()

    def get_user_info_by_ID(self, id):
        self.cursorObject.execute(
            f"SELECT id, user_name, full_name FROM users WHERE id={id};")
        return self.cursorObject.fetchall()

    def get_user_info_by_name(self, name):
        self.cursorObject.execute(
            f"SELECT id, user_name, full_name FROM users WHERE user_name={name};")
        return self.cursorObject.fetchall()

    def get_all_users_info(self):
        self.cursorObject.execute(
            "SELECT id, user_name, full_name FROM users;")
        return self.cursorObject.fetchall()

    def change_password(self, user, password):
        self.cursorObject.execute(
            f"UPDATE users SET password={password} WHERE user_name={user};")
        self.connectionObject.commit()

    def logout(self, user):
        self.cursorObject.execute(
            f"UPDATE users SET token = NULL WHERE user_name={user};")

    def get_user_info_for_login(self, name):
        self.cursorObject.execute(
            f"SELECT * FROM users WHERE user_name={name};")
        return self.cursorObject.fetchall()

    def get_refresh_token(self, name):
        self.cursorObject.execute(
            f"SELECT refresh_token FROM users WHERE user_name={name};")
        return self.cursorObject.fetchall()

    def update_user_token(self, token, id):
        self.cursorObject.execute(
            f"UPDATE users SET token={token} WHERE id={id};")
        self.connectionObject.commit()

    def update_user_refresh_token(self, token, id):
        self.cursorObject.execute(
            f"UPDATE users SET refresh_token={token} WHERE id ={id};")
        self.connectionObject.commit()

    def add_user(self, values):
        self.cursorObject.execute(
            "INSERT INTO users (user_name, full_name, password) VALUES (%s, %s, %s);", (values[0], values[1], values[2]))
        self.connectionObject.commit()

    def database_update(self):
        self.cursorObject.execute(
            "CREATE TABLE IF NOT EXISTS users(id INTEGER AUTO_INCREMENT, user_name VARCHAR(255) NOT NULL, full_name TEXT NOT NULL, password TEXT NOT NULL, token TEXT,refresh_token TEXT, PRIMARY KEY(id, user_name));",)

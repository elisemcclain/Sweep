# Remote library imports
from flask import Flask
from flask_cors import CORS, cross_origin
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
import bcrypt
import redis

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config["SECRET_KEY"] = "asdhjfpiuqwhf984uinaslkdjfw"
app.json.compact = False

app.config['REMEMBER_COOKIE_DOMAIN']= "http://localhost:3000/"
app.config["SESSION_COOKIE_SECURE"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "None"
# app.config["SESSION_TYPE"] = "redis"
# app.config["SESSION_PERMANENT"] = False
app.config["SESSION_REDIS"] = redis.StrictRedis(host="localhost", port=6379, db=0)

app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_USE_SIGNER"] = True  # If you want to use a session signer
app.config["SESSION_KEY_PREFIX"] = "myapp_session_"
app.config["SESSION_REDIS"] = redis.StrictRedis(host="localhost", port=6379, db=0)



# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)

# Instantiate REST API
api = Api(app)








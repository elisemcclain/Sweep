# Remote library imports
from flask import Flask
from flask_cors import CORS, cross_origin
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
# from werkzeug.security import generate_password_hash, check_password_hash



# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["SECRET_KEY"] = "my super secret key"
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(
    app,
    resources={
        r"/currentUserPy": {"origins":"http://localhost:3000"},
        r"/logout": {"origins":"http://localhost:3000"},
        r"/login": {"origins":"http://localhost:3000"},
        r"/signup": {"origins":"http://localhost:3000"},
        r"/check_session": {"origins":"http://localhost:3000"},
        r"/users": {"origins":"http://localhost:3000"}
        },
        supports_credentials=True)





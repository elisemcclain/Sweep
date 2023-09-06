from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from flask import request, Flask, jsonify, make_response
from flask_migrate import Migrate
from flask_restful import Resource, Api

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'

# Configure CORS for app
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

db = SQLAlchemy(app)
migrate = Migrate(app, db)

if __name__ == '__main__':
    app.run(port=5555, debug=True)
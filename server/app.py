from flask import Flask
from flask_cors import CORS

from flask import request, Flask, jsonify, make_response
from flask_migrate import Migrate
from flask_restful import Resource, Api

app = Flask(__name__)

# Configure CORS for app
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
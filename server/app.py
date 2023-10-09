#!/usr/bin/env python3

# Remote library imports
import json
from flask import session, request, Flask, jsonify, make_response
from flask_migrate import Migrate
from flask_restful import Resource, Api
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_cors import CORS, cross_origin
from flask_session import Session

# Local imports
from config import app, db, api, bcrypt
from models import User, Location, Crime, CrimeCategory
from datetime import datetime

app.config.from_object(__name__)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config["SECRET_KEY"] = "asdhjfpiuqwhf984uinaslkdjfw"
app.config["SESSION_COOKIE_SECURE"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config['REMEMBER_COOKIE_DOMAIN']= "http://localhost:3000/"

app.json.compact = False

# Session(app)
db.init_app(app)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)


login_manager = LoginManager()
login_manager.init_app(app)
# login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
@cross_origin(supports_credentials=True)

def index():
    return ''


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    location = db.session.query(Location).filter_by(address=data['address']).one_or_none()

    if location:
        location = location.__dict__
        del location['_sa_instance_state'] 
     
    else:
        location = Location()
    
        location.address = data['address']

        db.session.add(location)
        db.session.commit()

        location = location.to_dict()
            
    email=data['email']
    password=data['password']
    first_name=data['first_name']
    last_name=data['last_name']
    location_id=location['id']

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return make_response({'error': 'Email already exists'}, 409)


    new_user = User(
        email=data['email'],
        password_hash=hashed_password,
        first_name=data['first_name'],
        last_name=data['last_name'],
        location_id=location['id']
    )
    try:
        db.session.add(new_user)
        db.session.commit()
        return make_response(new_user.to_dict(), 201)

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'user already exists'}), 400


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter(User.email==data['email']).first()

    if not user:
        return make_response({"message": "user not found"}, 404)

    password = data['password']

    if user and bcrypt.checkpw(password.encode('utf-8'), user.password_hash):
        # session['user_id'] = user.id
        login_user(user, remember=True, force=True)
        return make_response(user.to_dict(), 200)
    else:
        return jsonify({'message': 'Invalid email or password - BE'}), 401


@app.route('/current_user', methods=['GET', 'PATCH', 'DELETE'])
@cross_origin(supports_credentials=True)
@login_required
def get():
    if current_user.is_authenticated:
        if request.method == 'GET':
            return make_response(current_user.to_dict(), 200)

        elif request.method == 'PATCH':
            data = request.get_json()
            # location = db.session.query(Location).filter_by(address=data['address']).one_or_none()

            if 'email' in data:
                current_user.email = data['email']
                current_user.first_name = data['first_name']
                current_user.last_name = data['last_name']
                current_user.address = data['address']
                db.session.commit()
                return make_response(current_user.to_dict(), 200)
            else:
                return jsonify({'message': 'Invalid request data'}), 400

        elif request.method == 'DELETE':
            db.session.delete(current_user)
            db.session.commit()
            return jsonify({'message': 'User deleted successfully'}), 204
    else:
        return jsonify({'message': 'User not logged in'}), 401


@app.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200


@app.route('/check_login_status', methods=['GET'])
def check_login_status():
    if current_user.is_authenticated:
        return jsonify({'logged_in': True}), 200
    else:
        return jsonify({'logged_in': False}), 200


class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]

        return make_response(users, 200)

api.add_resource(Users, '/users')


class UsersById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response(jsonify({'error': 'User not found'}), 404)
        
        return make_response(jsonify(user.to_dict()), 200)

    def patch(self, id):
        # can't patch address, only patches location id
        user = User.query.filter_by(id=id).first()

        if not user:
            return make_response({"error": "User not found"}, 404)

        data = request.get_json()

        try:
            for key in data:
                setattr(user, key, data[key])
            db.session.add(user)
            db.session.commit()

            return make_response(user.to_dict(), 202)

        except ValueError as error:
            new_error = {"error":str(error)}
            return make_response(new_error, 400)

    def delete(self, id):
        user = User.query.filter_by(id=id).first()

        if user:
            db.session.delete(user)
            db.session.commit()
            return make_response({}, 204)

        return make_response({"error": "User not found"}, 404)


api.add_resource(UsersById, '/profile/<int:id>')


class Locations(Resource):
    def get(self):
        locations = [location.to_dict() for location in Location.query.all()]

        return make_response(locations, 200)

    def post(self):
        # doesn't post address, posts location id
        new_location = Location()
        data = request.get_json()

        try:
            for key in data:
                setattr(new_location, key, data[key])

            db.session.add(new_location)
            db.session.commit()

            return make_response(new_location.to_dict(), 201)
        
        except ValueError as e:
            return make_response({'error': str(e)}, 400)

api.add_resource(Locations, '/locations')


class Crimes(Resource):
    def get(self):
        crimes = [crime.to_dict() for crime in Crime.query.all()]

        return make_response(crimes, 200)

    def post(self):
        new_crime_rep = Crime()
        
        data = request.get_json()
        crime_data = {}
        
        location = db.session.query(Location).filter_by(address=data['address']).one_or_none()
        
        if location:
            location = location.__dict__
            del location['_sa_instance_state'] 
     
        else:
            location = Location()
    
            location.address = data['address']

            db.session.add(location)
            db.session.commit()

            location = location.to_dict()
            # del location['_sa_instance_state']

        crime_data['name']=data['name']
        crime_data['desc']=data['desc']
        crime_data['location_id']=location['id']
        crime_data['date']=datetime.strptime(data['date'], '%Y-%m-%d').date()
        
        try:
            for key in crime_data:
                setattr(new_crime_rep, key, crime_data[key])
            
            db.session.add(new_crime_rep)
            db.session.commit()

            return make_response(jsonify(new_crime_rep.to_dict()), 201)
        
        except ValueError as e:
            return make_response(jsonify({'error': str(e)}), 400)

api.add_resource(Crimes, '/crimes')


class CrimeCategories(Resource):
    def get(self):
        crime_categories = [crime_categories.to_dict() for crime_categories in CrimeCategory.query.all()]

        return make_response(crime_categories, 200)

api.add_resource(CrimeCategories, '/crime_categories')

if __name__ == '__main__':
    db.create_all()
    app.run(port=5555, debug=True)


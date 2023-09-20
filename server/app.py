#!/usr/bin/env python3

# Remote library imports
import json
from flask import request, Flask, jsonify, make_response, request, abort, render_template, flash, request, redirect, url_for, session
from flask_migrate import Migrate
from flask_restful import Resource, Api

# Local imports
from config import app, db, api
from models import User, Location, Crime, CrimeCategory
from datetime import datetime
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import DataRequired, Email, Length
from webforms import LoginForm, PasswordForm, RegistrationForm
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_bcrypt import Bcrypt
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS, cross_origin
from flask import Flask, session
from flask_session import Session


SECRET_KEY = "oifdjupoe8u-9cv8uaijf2i5u"
SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
Session(app)

# Instantiate CORS
CORS(app, supports_credentials=True)

bcrypt = Bcrypt(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
@cross_origin(supports_credentials=True)

def index():
    return ''


class Signup(Resource):
    def post(self):
        data = request.get_json()

        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return {'error': 'Email already exists'}, 409

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

        new_user = User(
            email=data['email'],
            _password_hash=hashed_password,
            first_name=data['first_name'],
            last_name=data['last_name'],
            location_id=location['id']
        )

        db.session.add(new_user)
        db.session.commit()

        session['user_id'] = new_user.id
            
        return new_user.to_dict(), 201

api.add_resource(Signup, '/signup')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user._password_hash, password):

        return jsonify({'token': 'your_generated_token'})

    return jsonify({'message': 'Invalid credentials'}), 401



# class Login(Resource):
#     def post(self):
#         data = request.get_json()
#         existing_user = User.query.filter_by(email=data['email']).one_or_none()

#         if not existing_user:
#             return make_response(jsonify({"message": "Invalid login"}), 401)
        
#         # bcrypt.check_password_hash(existing_user._password_hash, data['password'].encode('utf-8')):
#         login_user(existing_user)
#         db.session['user_id'] = existing_user.id
#         db.session.commit()
#         return make_response(existing_user.to_dict(), 201)

# api.add_resource(Login, '/login', methods=['POST'])
            



@app.route('/currentuserpy')
@cross_origin(supports_credentials=True)
@login_required
def current_user_data():
        user = current_user
        print("Current User:", user)
        if user:
            response = make_response(user.to_dict(), 200)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response
        else:
            response = make_response({"message": "User not found"}, 404)
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response



@app.route('/logout', methods=['POST'])
@cross_origin(supports_credentials=True)
def logout():
    try:
        if current_user:
            logout_user()
            session.pop('user_id', None)

            return make_response({}, 204)
        else:
            return make_response({"message": "Not logged in"}, 400)
    except Exception as e:
        return make_response({"error": str(e)}, 500) 


class CheckSession(Resource):
    def get(self):

        if session.get('user_id'):
            
            user = User.query.filter(User.id == session['user_id']).first()
            
            return user.to_dict(), 200

        return {}, 204

api.add_resource(CheckSession, '/check_session')


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


api.add_resource(UsersById, '/users/<int:id>')


class Locations(Resource):
    def get(self):
        locations = [location.to_dict(rules=('-users',)) for location in Location.query.all()]

        return make_response(locations, 200)

    def post(self):
        new_location = Location()
        data = request.get_json()

        try:
            for key in data:
                setattr(new_location, key, data[key])

            db.session.add(new_location)
            db.session.commit()

            return make_response(jsonify(new_location.to_dict()), 201)
        
        except ValueError as e:
            return make_response(jsonify({'error': str(e)}), 400)

api.add_resource(Locations, '/locations')


class Crimes(Resource):
    def get(self):
        crimes = [crime.to_dict(rules=('-users', '-crime_categories',)) for crime in Crime.query.all()]

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
        crime_categories = [crime_categories.to_dict(rules=('-crimes', '-locations', '-users',)) for crime_categories in CrimeCategory.query.all()]

        return make_response(crime_categories, 200)

api.add_resource(CrimeCategories, '/crime_categories')

if __name__ == '__main__':
    app.run(port=5555, debug=True)






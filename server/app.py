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

bcrypt = Bcrypt(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def index():
    return ''

class CurrentUser(Resource):
    @login_required
    def get(self):
        user = current_user
        if user:
            return make_response(user.to_dict(), 201)
        else:
            return make_response({"message": "not found"}, 404)

api.add_resource(CurrentUser, '/currentUser')

class Logout(Resource):
    @login_required
    def delete(self):

        session['user_id'] = None
        return {}, 204

api.add_resource(Logout, '/logout')


class Login(Resource):
    def post(self):
        email = request.get_json()['email']
        password = request.get_json()['password']

        user = User.query.filter(User.email == email).first()

        if user and user.authenticate(_password_hash):
            session['user_id'] = user.id
            return user.to_dict(), 200

        return {'error': '401 Unauthorized'}, 401

api.add_resource(Login, '/login')

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

# class Signup(Resource):
#     def post(self):
        
#         email = request.get_json()['email']
#         password = request.get_json()['password']
#         first_name = request.get_json()['first_name']
#         last_name = request.get_json()['last_name']
#         location_id = request.get_json()['location_id']

#         location = db.session.query(Location).filter_by(address=data['address']).one_or_none()


#         if email and password:
            
#             new_user = User(email=email)
#             new_user.password_hash = password
#             new_user.first_name = first_name
#             new_user.last_name = last_name
#             new_user.location_id = location_id
#             db.session.add(new_user)
#             db.session.commit()

#             session['user_id'] = new_user.id
            
#             return new_user.to_dict(), 201

#         return {'error': '422 Unprocessable Entity'}, 422



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








#     class Users(Resource):
#     def get(self):
#         users = [user.to_dict() for user in User.query.all()]

#         return make_response(users, 200)

#     def post(self):
#         new_user = User()
#         data = request.get_json()
    
#         try:
#             for key in data:
#                 setattr(new_user, key, data[key])

#             new_user.password_hash = bcrypt.generate_password_hash(data['password_hash']).decode('utf-8')

#             db.session.add(new_user)
#             db.session.commit()

#             return make_response(jsonify(new_user.to_dict()), 201)
        
#         except ValueError as e:
#             return make_response(jsonify({'error': str(e)}), 400)

# api.add_resource(Users, '/users')
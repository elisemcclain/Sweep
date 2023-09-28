#!/usr/bin/env python3

# Remote library imports
import json
from flask import request, Flask, jsonify, make_response, abort, flash, redirect, url_for, session
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
Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()

# Instantiate CORS
cors = CORS(app, origins=["http://localhost:3000"], supports_credentials=True)


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
            new_user.authenticated=True
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)

        # session["user_id"] = new_user.id
        except Exception as ex:
            return make_response({"errors": [ex.__str__()]}, 422)

        return new_user.to_dict(), 201

api.add_resource(Signup, '/signup')


class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter(User.email==data['email']).first()

        if not user:
            return make_response({"message": "user not found"}, 404)

        password = data['password']

        if bcrypt.checkpw(password.encode('utf-8'), user.password_hash):
            user.authenticated=True
            db.session.add(user)
            db.session.commit()
            login_user(user, remember=True)
            session["logged_in"] = True
            return make_response({"success": "You're logged in!"}, 200)

        # session["user_id"] = user.id

        if not user.password(data['password']):
            return make_response({"message": "Invalid login"}, 401)


api.add_resource(Login, '/login', methods=['POST'])

# class Login(Resource):
#     def post(self):
#         data = request.get_json()
#         user = User.query.filter(User.email==data['email']).first()

#         if not user:
#             return make_response({"message": "user not found"}, 404)

#         password = data['password']

#         if bcrypt.checkpw(password.encode('utf-8'), user.password_hash):
#             login_user(user, remember=True)
#             return make_response({"success": "You're logged in!"}, 200)

#         session["user_id"] = user.id

#         if not user.password(data['password']):
#             return make_response({"message": "Invalid login"}, 401)


# api.add_resource(Login, '/login', methods=['POST'])


class CurrentUser(Resource):
    @login_required
    def get(self):
        user = current_user
        if user:
            return make_response(user.to_dict(), 200)
        else:
            return make_response({"message": "user not found"}, 404)

api.add_resource(CurrentUser, '/currentuser')


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    session["logged_in"] = False
    return make_response("You're logged out!", 200)




@app.route('/check_login_status', methods=['GET'])
def check_login_status():
    if 'logged_in' in session and session['logged_in']:
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
        # doesn't post address, posts location id
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
    app.run(port=5555, debug=True)


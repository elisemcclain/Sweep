#!/usr/bin/env python3

# Remote library imports
from flask import request, Flask, jsonify, make_response, request, abort
from flask_migrate import Migrate
from flask_restful import Resource, Api
# Local imports
from config import app, db, api
from models import User, Location, Crime, CrimeCategory
from flask_bcrypt import Bcrypt

@app.route('/')
def index():
    return ''

# @app.route('/register', methods=['POST'])
# def register():
#     try:
#         first_name = request.json.get('first_name', None)
#         last_name = request.json.get('last_name', None)
#         email = request.json.get('email', None)
#         password = request.json.get('password', None)

#         if not first_name:
#             return 'Missing first name', 400
#         if not last_name:
#             return 'Missing last name', 400
#         if not email:
#             return 'Missing email', 400
#         if not password:
#             return 'Missing password', 400

#         hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
#         user = User(email=email, first_name=first_name, last_name=last_name, hash=hashed)
#         db.session.add(user)
#         db.session.commit()

#         return 'Welcome, {first_name}', 200

#     except IntegrityError:
#         db.session.rollback()
#         return 'User Already Exists', 400

#     except AttributeError:
#         return 'Provide an Email and Password in JSON format in the request body', 400

# @app.route('/login', methods=['POST'])
# def login():
#     email = request.json.get('email', None)
#     password = request.json.get('password', None)
        
#     if not email:
#         return 'Missing email', 400
#     if not password:
#         return 'Missing password', 400
        
#     user = User.query.filter_by(email=email).first()
#     if not user:
#         return 'Account Not Found!', 404
        

#     if bcrypt.checkpw(password.encode('utf-8'), user.hash):
#         return f'Logged in, Welcome {email}!', 200
#     else:
#         return 'Incorrect password', 400


class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]

        return make_response(users, 200)

    def post(self):
        new_user = User()
        data = request.get_json()

        try:
            for key in data:
                setattr(new_user, key, data[key])

            db.session.add(new_user)
            db.session.commit()

            return make_response(jsonify(new_user.to_dict()), 201)
        
        except ValueError as e:
            return make_response(jsonify({'error': str(e)}), 400)

api.add_resource(Users, '/users')

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


# class Crimes(Resource):
#     def get(self):
#         crimes = [crime.to_dict() for crime in Crimes.query.all()]

#         return make_response(crimes, 200)

#     def post(self):
#         new_crimes = CrimeReport()
#         data = request.get_json()

#         try:
#             for key in data:
#                 setattr(new_crime_reports, key, data[key])

#             db.session.add(new_crime_reports)
#             db.session.commit()

#             return make_response(jsonify(new_crime_reports.to_dict()), 201)
        
#         except ValueError as e:
#             return make_response(jsonify({'error': str(e)}), 400)

# api.add_resource(CrimeReports, '/crimereports')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
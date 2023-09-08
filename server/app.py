#!/usr/bin/env python3

# Remote library imports
from flask import request, Flask, jsonify, make_response, request, abort
from flask_migrate import Migrate
from flask_restful import Resource, Api
# Local imports
from config import app, db, api
from models import User, Location, Crime, CrimeCategory
from flask_bcrypt import Bcrypt
from datetime import datetime

@app.route('/')
def index():
    return ''


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
        crimes = [crime.to_dict(rules=('-users', '-crime_categories', '-locations',)) for crime in Crime.query.all()]

        return make_response(crimes, 200)

    def post(self):
        new_crime = Crime()
        data = request.get_json()

        try:
            for key in data:
                setattr(new_crime, key, data[key])

            db.session.add(new_crime)
            db.session.commit()

            return make_response(jsonify(new_crime.to_dict()), 201)
        
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
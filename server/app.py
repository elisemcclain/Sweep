#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, Flask, jsonify, make_response
from flask_migrate import Migrate
from flask_restful import Resource, Api
# Local imports
from config import app, db, api
from models import User, Location, CrimeReport
# Add your model imports
# Views go here!

@app.route('/')
def index():
    return '<h1>''</h1>'

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


class CrimeReports(Resource):
    def get(self):
        crime_reports = [crime_report.to_dict() for crime_report in CrimeReport.query.all()]

        return make_response(crime_reports, 200)

    def post(self):
        new_crime_reports = CrimeReport()
        data = request.get_json()

        try:
            for key in data:
                setattr(new_crime_reports, key, data[key])

            db.session.add(new_crime_reports)
            db.session.commit()

            return make_response(jsonify(new_crime_reports.to_dict()), 201)
        
        except ValueError as e:
            return make_response(jsonify({'error': str(e)}), 400)

api.add_resource(CrimeReports, '/crimereports')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
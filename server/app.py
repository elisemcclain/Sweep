#!/usr/bin/env python3

# Remote library imports
from flask import request, Flask, jsonify, make_response, request, abort, render_template, flash, request, redirect, url_for
from flask_migrate import Migrate
from flask_restful import Resource, Api
# Local imports
from config import app, db, api
from models import User, Location, Crime, CrimeCategory
from flask_bcrypt import Bcrypt
from datetime import date
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from webforms import LoginForm, PasswordForm
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user

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

@app.route('/login', methods=['GET', 'POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
	
    if user and bcrypt.check_password_hash(user.password_hash, password):
        login_user(user)  # Log in the user
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# login
@app.route('/profile')
@login_required
def profile():
    return f'Hello, {current_user.first_name}!'

# Logout
@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
	logout_user()
	flash("You Have Been Logged Out!")
	return redirect(url_for('login'))

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

            new_user.password_hash = bcrypt.generate_password_hash(data['password_hash']).decode('utf-8')

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

# @app.route('/name', methods=['GET', 'POST'])
# def name():
#     name = None
#     form = NameForm()

#     if form.validate_on_submit():
#         name = form.first_name.data
#         form.first_name.data = ''

#     return render_template("name.html",
#         first_name = first_name,
#         form = form)


if __name__ == '__main__':
    app.run(port=5555, debug=True)
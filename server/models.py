from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from validate_email import validate_email  
from datetime import datetime
from config import db
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

class User(db.Model, SerializerMixin):
    # get, post, byId: patch, delete
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password_hash = db.Column(db.String(128))
    #add creaated at
    #adad unique key for email
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'))

    serialize_rules = ('-location', '-crimecategory',)

    @property
    def password(self):
        raise AttributeError('password is not a readable attr')
    
    @password.setter
    def password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


class Location(db.Model, SerializerMixin):
    # get, post
    __tablename__ = 'locations'

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(120), nullable=False)
    crime_id = db.Column(db.Integer, db.ForeignKey('crimes.id'), nullable=False)

    users = db.relationship('User', backref='location', lazy=True)

    serialize_rules = ('-users',)

class Crime(db.Model, SerializerMixin):
    # get, post
    __tablename__ = 'crimes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    desc = db.Column(db.String(255), nullable=False)
    date = db.Column(db.DateTime, nullable=False)

    crime_categories = db.relationship('CrimeCategory', backref='Crime', lazy=True)
    locations = db.relationship('Location', backref='Crime', lazy=True)

    serialize_rules = ('-locations', '-crime_categories', '-users',)

    # def serialize_date(self):
    #     return self.date.isoformat()

class CrimeCategory(db.Model, SerializerMixin):
    # get
    __tablename__ = 'crime_categories'

    id = db.Column(db.Integer, primary_key=True)
    crime_id = db.Column(db.Integer, db.ForeignKey('crimes.id'), nullable=False)
    category = db.Column(db.String(120), nullable=False)
    
    serialize_rules = ('-users', '-locations' '-crimes',)
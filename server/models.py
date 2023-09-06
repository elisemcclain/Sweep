from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from validate_email import validate_email  
from datetime import datetime
from config import db

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    saved_address = db.Column(db.String, nullable=False)
    
    crime_reports = db.relationship('CrimeReport', cascade='all, delete-orphan', backref='crime_reports', lazy='dynamic')
    
    serialize_rules = ('-crime_reports.user',)

class Location(db.Model, SerializerMixin):
    __tablename__ = 'locations'

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(120), nullable=False)

    reported_crimes = db.relationship('Crime', backref='crime_location')

    serialize_rules = ('-reported_crimes.location',)

class Crime(db.Model, SerializerMixin):
    __tablename__ = 'crimes'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(80), nullable=False)
    desc = db.Column(db.String(120), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)

    crime_location = db.relationship('Location', backref='reported_crimes')

    serialize_rules = ('-crime_location.crime',)

class CrimeReport(db.Model, SerializerMixin):
    __tablename__ = 'crime_reports'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    crime_id = db.Column(db.Integer, db.ForeignKey('crimes.id'), nullable=False)
    desc = db.Column(db.String(255), nullable=False)
    date_reported = db.Column(db.DateTime, nullable=False)
    
    reporter = db.relationship('User', backref='crime_reports')
    reported_crime = db.relationship('Location', backref='crime_reports')
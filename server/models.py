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
    password = db.Column(db.String(120), nullable=False)

    serialize_rules = ('-location', '-crimereport',)


class Location(db.Model, SerializerMixin):
    __tablename__ = 'locations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) 
    address = db.Column(db.String(120), nullable=False)

    users = db.relationship('User', backref='location', lazy=True)

    serialize_rules = ('-users.location',)

class CrimeReport(db.Model, SerializerMixin):
    __tablename__ = 'crime_reports'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)
    desc = db.Column(db.String(255), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    
    users = db.relationship('User', backref='crimereport', lazy=True)
    locations = db.relationship('Location', backref='crimereport', lazy=True)

    serialize_rules = ('-users.crimereport', '-locations.crimereport',)
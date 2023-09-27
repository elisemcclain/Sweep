from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from validate_email import validate_email  
from datetime import date
from config import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
from flask import Flask, render_template, url_for,redirect
from flask_sqlalchemy import SQLAlchemy



class User(db.Model, SerializerMixin):
    # get, post, byId: patch, delete
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_active = db.Column(db.Boolean, nullable=True)
    #add created at
    #adad unique key for email
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'))

    serialize_rules = ('-location', '-crimecategory',)

    def get_id(self):
        return str(self.id)

    def is_active(self):
        return self.is_active
            
    def is_authenticated(self):
        return True


class Location(db.Model, SerializerMixin):
    # get, post
    __tablename__ = 'locations'

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(120), nullable=False)

    users = db.relationship('User', backref='location', lazy=True)
    crimes = db.relationship('Crime', backref='location', lazy=True)

    serialize_rules = ('-users',)

class Crime(db.Model, SerializerMixin):
    # get, post
    __tablename__ = 'crimes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    desc = db.Column(db.String(255), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)

    crime_categories = db.relationship('CrimeCategory', backref='Crime', lazy=True)
    # location = db.relationship('Location', backref='crime', lazy=True)

    serialize_rules = ('-location', '-crime_categories', '-users',)

    # def format_date(self):
    #     return self.date.strftime('%m/%d/%Y')

class CrimeCategory(db.Model, SerializerMixin):
    # get
    __tablename__ = 'crime_categories'

    id = db.Column(db.Integer, primary_key=True)
    crime_id = db.Column(db.Integer, db.ForeignKey('crimes.id'), nullable=False)
    category = db.Column(db.String(120), nullable=False)
    
    serialize_rules = ('-users', '-locations' '-crimes',)

crime_location_association = db.Table(
    'crime_location_association',
    db.Column('crime_id', db.Integer, db.ForeignKey('crimes.id')),
    db.Column('location_id', db.Integer, db.ForeignKey('locations.id'))
)

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy import MetaData
from sqlalchemy.ext.associationproxy import association_proxy
from validate_email import validate_email  
from datetime import date
from config import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
# from flask import Flask, render_template, url_for,redirect
from flask_sqlalchemy import SQLAlchemy

crime_location_association = db.Table(
    'crime_location_association',
    # Base.metadata,
    db.Column('crime_id', db.Integer, db.ForeignKey('crimes.id')),
    db.Column('location_id', db.Integer, db.ForeignKey('locations.id'))
)

class User(db.Model, SerializerMixin):
    # get, post, byId: patch, delete
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_active = db.Column(db.Boolean, nullable=True)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'))

    # serialize_rules = ('-location', '-crimecategory', '-crime_location_associations')

    def get_id(self):
        return str(self.id)
            
    def is_authenticated(self):
        return True

    def to_dict(self, include_location=True):
        user_dict = {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
        }
        
        if include_location and self.location:
            user_dict['location'] = self.location.to_dict()
        else:
            user_dict['location'] = None
        
        return user_dict


class Location(db.Model, SerializerMixin):
    # get, post
    __tablename__ = 'locations'

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(120), nullable=False)

    users = db.relationship('User', backref='location', lazy=True)
    crimes_associated = db.relationship(
        'Crime',
        secondary=crime_location_association,
        back_populates='locations',
        lazy='dynamic'
    )
    # serialize_rules = ('-users', '-crime_location_associations', '-crimes_in_loc')
    def to_dict(self):
        return {
            'id': self.id,
            'address': self.address,
            'users': [user.to_dict(include_location=False) for user in self.users],
            'crimes_associated': [crime.to_dict() for crime in self.crimes_associated],
        }

class Crime(db.Model, SerializerMixin):
    # get, post
    __tablename__ = 'crimes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    desc = db.Column(db.String(255), nullable=False)
    date = db.Column(db.DateTime, nullable=False)

    # location_id = db.Column(db.Integer, db.ForeignKey('locations.id'))

    locations = db.relationship(
        'Location',
        secondary=crime_location_association,
        back_populates='crimes_associated',
        lazy='dynamic'
    )

    # serialize_rules = ('-locations',)
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'desc': self.desc,
            'date': self.date,
        }


class CrimeCategory(db.Model, SerializerMixin):
    # get
    __tablename__ = 'crime_categories'

    id = db.Column(db.Integer, primary_key=True)
    crime_id = db.Column(db.Integer, db.ForeignKey('crimes.id'), nullable=False)
    category = db.Column(db.String(120), nullable=False)
    
    # serialize_rules = ('-crimes',)
    def to_dict(self):
        return {
            'id': self.id,
            'crime_id': self.crime_id if self.crime_id else None,
            'category': self.category
        }

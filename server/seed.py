# from config import db  # Import your SQLAlchemy instance from your Flask app
from app import app, db
from models import User, Location, Crime, CrimeCategory
from random import randint, choice as rc
from datetime import datetime
from faker import Faker
from config import db, app


def create_users():
    users = [
        User(first_name='Susan', last_name='Gladiator', email='hellobellow1@gmaail.com', password_hash='password1'),
        User(first_name='Zendaya', last_name='Holland', email='user2@tester1.com', password_hash='password2'),
        # Add more users as needed
    ]
    db.session.add_all(users)
    db.session.commit()

def create_locations():
    locations = [
        Location(address='72 P Shermana Wallay Way, Sydney AU', crime_id=1),
        Location(address='133 Rainbow Rd, Mario Land', crime_id=2),
        # Add more locations as needed
    ]
    db.session.add_all(locations)
    db.session.commit()

def create_crime():
    crimes = [
        Crime(name='burgle', desc='Stole my favorite cat', date=datetime(2023, 9, 7, 14, 30)),
        Crime(name='disturbance of the night', desc='Yodeling at 3am', date=datetime(2023, 9, 6, 12, 45)),
        # Add more crime reports as needed
    ]
    db.session.add_all(crimes)
    db.session.commit()

def create_crime_category():
    crime_categories = [
        CrimeCategory(crime_id=1, category='Second Degree'),
        CrimeCategory(crime_id=2, category='Second Degree'),
        # Add more crime categories as needed
    ]
    db.session.add_all(crime_categories)
    db.session.commit() 

if __name__ == '__main__':
    with app.app_context():
        create_users()
        create_locations()
        create_crime()
        create_crime_category()



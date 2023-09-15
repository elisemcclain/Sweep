# from config import db  # Import your SQLAlchemy instance from your Flask app
from app import app, db
from models import User, Location, Crime, CrimeCategory
from random import randint, choice as rc
from datetime import datetime
from faker import Faker
from config import db, app


def create_users():
    users = [
        User(first_name='Susan', last_name='Gladiator', email='w11ee@gd13dlq.cm', password_hash='ssd1ed31qe11'),
        User(first_name='Zendaya', last_name='Holland', email='ee11e@1qd3d1.cm', password_hash='d1qe13dd12'),
        # Add more users as needed
    ]
    db.session.add_all(users)
    db.session.commit()

def create_locations():
    locations = [
        Location(address='72 P Shermana Wallay Way, Sydney AU'),
        Location(address='133 Rainbow Rd, Mario Land'),
        # Add more locations as needed
    ]
    db.session.add_all(locations)
    db.session.commit()

def create_crime():
    crimes = [
        Crime(name='Steal', desc='Stole my favorite cat', date=datetime(2021, 12, 17), location_id=1),
        Crime(name='bump in the night', desc='Yodeling at 3am', date=datetime(2021, 10, 16), location_id=2),
        # Add more crime reports as needed
    ]

    # for crime in crimes:
    #     formatted_date = crime.format_date()
    #     crime.date = formatted_date

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



# can't post crimes to backend bc of date time: SQLite DateTime type only accepts Python datetime and date objects as input.
# can i make my own seed or is it crucial that i get a public api working
# user page
# login page

# luxon
# calendar dropdown
# react datepicker
# from config import db  # Import your SQLAlchemy instance from your Flask app
from app import app, db
from models import User, Location, Crime, CrimeCategory, crime_location_association
from random import randint, choice as rc
from datetime import datetime
from faker import Faker
from config import db, app


def create_users():
    users = [
        User(first_name='Sufsan', last_name='Gladiator', email='hi@hddfseir.cofm', is_active=None, password_hash='ssd1ed31qe11'),
        User(first_name='Zefndaya', last_name='Holland', email='bye@dbdysree.ffcom', is_active=None, password_hash='d1qe13dd12'),
        # Add more users as needed
    ]
    db.session.add_all(users)
    db.session.commit()

def create_locations():
    locations = [
        Location(address='3089 W Mica St, Fayetteville, AR 72704'),
        Location(address='3087 W Mica St, Fayetteville, AR 72704'),
    ]
    db.session.add_all(locations)
    db.session.commit()

def create_crime():
    crime1 = Crime(name='Steal', desc='Stole my favorite cat', date=datetime(2021, 12, 17))
    crime2 = Crime(name='bump in the night', desc='Yodeling at 3am', date=datetime(2021, 10, 16))

    # Append Location instances to the locations attribute of Crime
    crime1.locations.append(Location.query.get(1))
    crime2.locations.append(Location.query.get(2))

    # Add Crime instances to the database session
    db.session.add_all([crime1, crime2])
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


# luxon
# calendar dropdown
# react datepicker



# goals:
    #  login/logout
    #  patch profile info
    #  delete profile

    # can't do fucking shit without current_user being set on login

# stretch:
    # see crime report details on map
    # css
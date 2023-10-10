# from config import db  # Import your SQLAlchemy instance from your Flask app
from app import app, db
from models import User, Location, Crime, CrimeCategory, crime_location_association
from random import randint, choice as rc
from datetime import datetime
from faker import Faker
from config import db, app


def create_users():
    users = [
        User(first_name='Susan', last_name='Gladiator', email='23456susan@susan.com', is_active=None, password_hash='ssd1ed31qe11'),
        User(first_name='Zendaya', last_name='Holland', email='23546zendaya@dedbdfdysree.com', is_active=None, password_hash='d1qe13dd12'),
        User(first_name='Margaret', last_name='Bulle', email='23456maggie@himaggie.com,', is_active=None, password_hash='kkkkkk'),
        User(first_name='Barbara', last_name='Shank', email='23456de@deshank.com', is_active=None, password_hash='dddddd'),
        User(first_name='Benjamin', last_name='Button', email='23456benjamin@button.com', is_active=None, password_hash='d1qe13dsd12'),
        User(first_name='Glen', last_name='Dale', email='23456glen@glendale.com,', is_active=None, password_hash='kkkkakk'),
        User(first_name='Billy Bob', last_name='Buccee', email='3456billybob@buccees.com', is_active=None, password_hash='ssd1ead31qe11'),
        User(first_name='Azelia', last_name='Thorn', email='23456azelias@thorn.com', is_active=None, password_hash='vdasdt345'),
    ]
    db.session.add_all(users)
    db.session.commit()


def create_sample_data():
    with app.app_context():
        session = db.session

        # Create locations
        locations_data = [
            "3089 W Mica St, Fayetteville, AR 72704",
            "3087 W Mica St, Fayetteville, AR 72704",
            "342 N Gregg Ave, Fayetteville, AR 72701",
            "3545 N Shiloh Dr, Fayetteville, AR 72703",
            "3990 N Steele Blvd, Fayetteville, AR 72703",
            "3050 Old Missouri Rd, Fayetteville, AR 72703",
            "3297 Rom Orchard Rd, Fayetteville, AR 72703",
            "1500 N College Ave, Fayetteville, AR 72703",
        ]

        locations = [Location(address=address) for address in locations_data]
        session.add_all(locations)
        session.commit()

        # Create crimes
        crimes_data = [
            {
                "name": "Stolen Property",
                "desc": "Woman's favorite cat is stolen",
                "date": datetime(2021, 12, 17),
            },
            {
                "name": "Lurker",
                "desc": "Strange figure lurking in backyard",
                "date": datetime(2021, 10, 16),
            },
            {
                "name": "Murder",
                "desc": "Woman found shot behind dumpsters",
                "date": datetime(2021, 10, 16),
            },
            {
                "name": "Public Intox",
                "desc": "3 men disturbing the peace outside Chili's",
                "date": datetime(2021, 10, 16),
            },
            {
                "name": "Minor in Possession",
                "desc": "Underage fraternity brothers found with 6 pints of liquor",
                "date": datetime(2021, 10, 16),
            },
            {
                "name": "Domestic Issue",
                "desc": "Neighbors engage in physical altercation over lawn care",
                "date": datetime(2021, 10, 16),
            },
            {
                "name": "Tax Fraud",
                "desc": "Contact IRS for more information",
                "date": datetime(2021, 10, 16),
            },
            {
                "name": "Noise Complaint",
                "desc": "Yodeling heard at 3 am",
                "date": datetime(2021, 10, 16),
            },
        ]

        crimes = [Crime(**crime_data) for crime_data in crimes_data]
        session.add_all(crimes)
        session.commit()

        # Assign each crime to a specific location
        for i, crime in enumerate(crimes):
            location = locations[i % len(locations)]
            location.crimes_associated.append(crime)

        session.commit()






# def create_locations():
#     locations = [
#         Location(address='3089 W Mica St, Fayetteville, AR 72704'),
#         Location(address='3087 W Mica St, Fayetteville, AR 72704'),
#         Location(address='342 N Gregg Ave, Fayetteville, AR 72701'),
#         Location(address='3545 N Shiloh Dr, Fayetteville, AR 72703'),
#         Location(address='3990 N Steele Blvd, Fayetteville, AR 72703'),
#         Location(address='3050 Old Missouri Rd, Fayetteville, AR 72703'),
#         Location(address='3297 Rom Orchard Rd, Fayetteville, AR 72703'),
#         Location(address='1500 N College Ave, Fayetteville, AR 72703'),
#     ]
#     db.session.add_all(locations)
#     db.session.commit()

# def create_crime():
#     with app.app_context():
#         session = db.session

#         locations = session.query(Location).all()

#         if locations:
#             crime1 = Crime(name='Stolen Property', desc='Woman\'s favorite cat is stolen', date=datetime(2021, 12, 17))
#             crime2 = Crime(name='Lurker', desc='Strange figure lurking in backyard', date=datetime(2021, 10, 16))
#             crime3 = Crime(name='Murder', desc='Woman found shot behind dumpsters', date=datetime(2021, 10, 16))
#             crime4 = Crime(name='Public Intox', desc='3 men disturbing the peace outside Chili\'s', date=datetime(2021, 10, 16))
#             crime5 = Crime(name='Minor in Posession', desc='Underage fraternity brothers found w 6 pints of liquor', date=datetime(2021, 10, 16))
#             crime6 = Crime(name='Domestic Issue', desc='Neighbors engage in physical altercation over lawn care', date=datetime(2021, 10, 16))
#             crime7 = Crime(name='Tax Fraud', desc='Contact IRS for more information', date=datetime(2021, 10, 16))
#             crime8 = Crime(name='Noise Complaint', desc='Yodeling heard at 3am', date=datetime(2021, 10, 16))

#             for location in locations:
#                 crime1.locations.append(location)
#                 crime2.locations.append(location)
#                 crime3.locations.append(location)
#                 crime4.locations.append(location)
#                 crime5.locations.append(location)
#                 crime6.locations.append(location)
#                 crime7.locations.append(location)
#                 crime8.locations.append(location)

#             session.add_all([crime1, crime2, crime3, crime4, crime5, crime6, crime7, crime8])
#             session.commit()

def create_crime_category():
    crime_categories = [
        CrimeCategory(crime_id=1, category='Second Degree'),
        CrimeCategory(crime_id=2, category='First Degree'),
        CrimeCategory(crime_id=3, category='Second Degree'),
        CrimeCategory(crime_id=4, category='Third Degree'),
        CrimeCategory(crime_id=5, category='Second Degree'),
        CrimeCategory(crime_id=6, category='First Degree'),
        CrimeCategory(crime_id=7, category='Second Degree'),
    ]
    db.session.add_all(crime_categories)
    db.session.commit() 

if __name__ == '__main__':
    with app.app_context():
        create_users()
        create_sample_data()
        # create_locations()
        # create_crime()
        create_crime_category()

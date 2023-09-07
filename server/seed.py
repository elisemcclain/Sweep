# from config import db  # Import your SQLAlchemy instance from your Flask app
from app import app, db
from models import User, Location, CrimeReport
from random import randint, choice as rc
from datetime import datetime
from faker import Faker


def create_users():
    users = [
        User(first_name='Jason', last_name='Bateman', email='user1@example.com', password='password1'),
        User(first_name='Clarice', last_name='Muchachas', email='user2@example.com', password='password2'),
        User(first_name='Benjamin', last_name='Button', email='user3@example.com', password='password3'),

    ]
    db.session.bulk_save_objects(users)
    db.session.commit()


def create_locations():
    locations = [
        Location(user_id=1, address='23 First Ave'),
        Location(user_id=2, address='456 Second Ave'),
        Location(user_id=3, address='1769 Belluga Ave'),

    ]
    db.session.bulk_save_objects(locations)
    db.session.commit()

def create_crime_reports():
    crime_reports = [
        CrimeReport(user_id=1, location_id=1, desc='Burglary', date=datetime(2023, 9, 7, 14, 30, 0)),
        CrimeReport(user_id=2, location_id=2, desc='Assault', date=datetime(2023, 9, 7, 14, 30, 0)),
        CrimeReport(user_id=3, location_id=3, desc='Public Annoyance', date=datetime(2023, 9, 7, 14, 30, 0)),

    ]

    db.session.bulk_save_objects(crime_reports)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        create_users()
        create_locations()
        create_crime_reports()


# if __name__ == '__main__':
#     fake = Faker()
#     with app.app_context():
#         print("deleting data...")
#         User.query.delete()
#         Crime.query.delete()
#         Location.query.delete()
#         db.session.commit()
#         print('deleted all data')

#         print("Creating users...")
#         user1 = User(first_name="Cheryl", last_name="Bench", password="Password#1", email="dracula@gmail.com")
#         user2 = User(first_name="Karina", last_name="Barina", password="Password#2", email="sharknado@gmail.com")
#         user3 = User(first_name="Susan", last_name="Shumps", password="Password#3", email="lestat@gmail.com")
#         user4 = User(first_name="Buster", last_name="Bellagio", password="Password#4", email="cucumber@gmail.com")
#         users = [user1, user2, user3, user4]
#         db.session.add_all(users)
#         db.session.commit()

#         print("Creating crimes...")
#         crime1 = Crime(type="Theft", desc='Man stole my phone from purse.', date=1-16-2023)
#         crime2 = Crime(type="Assault", desc='Man tripped child and took his ice cream.', date=9-2-2023)
#         crime3 = Crime(type="Break in", desc='Sasquatch broke my window and tried to steal my apple pie.', date=8-30-2023)
#         crime4 = Crime(type="Domestic Disturbance", desc='Couple got into a screaming match over whether or not Sasquatch is real.', date=8-30-2023)
#         crime4 = Crime(type="Streaking", desc='Man streaked across field at University football game.', date=9-1-2023)

#         crimes = [crime1, crime2, crime3, crime4]
#         db.session.add_all(crimes)
#         db.session.commit()

#         print("Creating locations...")
#         location1 = Location('4413 Fiesta Circle, Fort Worth, TX 76133')
#         location2 = Location('6800 Zoo Dr, Kansas City, MO 64132')
#         location3 = Location('3215 S Rancho Dr, Las Vegas, NV 89102')
#         location4 = Location('Upper Great Hwy, San Francisco, CA 94132')

#         locations = [location1, location2, location3, location4]
#         db.session.add_all(locations)
#         db.session.commit()

#         print("Creating crime_reports...")
#         crime_report1 = CrimeReport(desc="cat stole my money", date_reported=9-1-2023)
#         crime_report2 = CrimeReport(desc='neighbor spray painted my car', date_reported=9-1-2023)
#         crime_report3 = CrimeReport(desc='public intox', date_reported=9-1-2023)
#         crime_report4 = CrimeReport(desc='children found drinking beer in the field', date_reported=9-1-2023)


#         crime_reports = [crime_report1, crime_report2, crime_report3, crime_report4]
#         db.session.add_all(crime_reports)
#         db.session.commit()
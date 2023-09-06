from config import db  # Import your SQLAlchemy instance from your Flask app
from datetime import datetime
from models import User, Location, Crime, CrimeReport
from app import app

def seed_data():
    # Users
    user1 = User(
        first_name='John',
        last_name='Doe',
        email='john@example.com',
        password='hashed_password#1',
        saved_address='123 Main St'
    )
    user2 = User(
        first_name='Jane',
        last_name='Smith',
        email='jane@example.com',
        password='hashed_password#2',
        saved_address='456 Elm St'
    )

    # Locations
    location1 = Location(address='123 First Ave')
    location2 = Location(address='456 Second Ave')

    # Crimes
    crime1 = Crime(
        type='Theft',
        desc='Stolen property',
        date=datetime.utcnow(),
        crime_location=location1
    )
    crime2 = Crime(
        type='Assault',
        desc='Physical altercation',
        date=datetime.utcnow(),
        crime_location=location2
    )

    # Crime reports
    report1 = CrimeReport(
        user=user1,
        reported_crime=location1,
        desc='Theft report',
        date_reported=datetime.utcnow()
    )
    report2 = CrimeReport(
        user=user2,
        reported_crime=location2,
        desc='Assault report',
        date_reported=datetime.utcnow()
    )

    db.session.add_all([user1, user2, location1, location2, crime1, crime2, report1, report2])
    db.session.commit()

if __name__ == '__main__':
    seed_data()


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
import random, string, hashlib

from database.song import Song
from google.appengine.ext import db
from userDB import User, EmailUser


song_titles = ['sound/conga/1.wav','sound/conga/2.wav','sound/conga/3.wav','sound/conga/4.wav','sound/conga/5.wav','sound/conga/6.wav','sound/conga/7.wav']

def create_initial_songs():
    db.delete(Song.all())
    for title in song_titles:
        song = Song(title=title)
        song.put()

def create_initial_users():
    password = 'pwd'
    len_salt = 30
    salt = ''.join(random.choice(string.letters) for s in range(len_salt))
    hash = hashlib.sha256(password + salt)
    hashed_passwword = hash.hexdigest()
    code = ''.join(random.choice(string.letters) for s in range(30))
    username = 'su'
    super_user = User(key_name=username, username=username, userRights=2, userType=1, points=100, email='d@g.com')
    super_user.put()
    super_user = EmailUser( key_name= username, username = username, password = hashed_passwword, salt=salt, code=code, emailValidated=True)
    super_user.put()



def create_initial_data():
    create_initial_songs()
    create_initial_users()




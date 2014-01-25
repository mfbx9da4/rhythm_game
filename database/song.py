from google.appengine.ext import db

class Song(db.Model):
    title = db.StringProperty(multiline=False, required=True)
    # created = db.DateTimeProperty(auto_now_add=True)
    # url = db.StringProperty(multiline=False, required=False)
    # xml = db.TextProperty(required=False)


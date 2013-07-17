from google.appengine.ext import db

# need to add score properties for each game
# including previous high score, cumalated score, coins
# levels unlocked, levels completed
# e.g. level1game1 = db.Property() 
class WaitingUsers(db.Model):
  user_id = db.StringProperty()
  time = db.TimeProperty()

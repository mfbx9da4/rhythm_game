"""
export PATH=$PATH:/home/david/Dropbox/Programming/Python/Miscellaneous/extensions/google_appengine
dev_appserver.py helloworld/
appcfg.py update helloworld/

"""

__website__ = 'http://rhythmludus.appspot.com/'


from xml.dom import minidom as md

import webapp2
import logging
from google.appengine.ext import db

from object_models import BaseHandler
from rhythmgame import game
from gamesetup import CreateChannel
from gamesetup import GameRequest
from song import RandomSong
import json

class Home(BaseHandler):
      def get(self): 
            self.write('HOME')


class Rhythm(db.Model):
    title = db.StringProperty(multiline=False, required=True)
    xml = db.TextProperty(required=True)
    created = db.DateTimeProperty(auto_now_add=True)
    last_modified = db.DateTimeProperty(auto_now=True)

class Song(db.Model):
    title = db.StringProperty(multiline=False, required=True)
    created = db.DateTimeProperty(auto_now_add=True)

class RhythmEnterer(BaseHandler):
    def get(self):
        self.render('rhythm_enterer.html')

class SongEnterer(BaseHandler):
    def get(self):
        self.render('song_enterer.html')

class SongsQuery(BaseHandler):
  def get(self):
      song_db = Song.all().fetch(10)
      songName = [ s.title for s in song_db ]
      # songName=["one", "two", "three"]
      songName = {'songs': songName}
      encoder = json.JSONEncoder()
      songs = encoder.encode(songName)
      return self.write(songs)


class RhythmsQuery(BaseHandler):
    def get(self):
        self.rhythms = Rhythm.all()
        self.arg = self.request.get('arg')
        title = self.request.get('title')
        if title:
          self.getNamedRhythm(title)
        else:
          self.handleDiverse()

    def getNamedRhythm(self, title):
        q = Rhythm.all().filter('title =', title)
        r = q.fetch(1)
        if r:
          out = r[0].xml
          self.response.headers['Content-Type'] = "text/xml"
          return self.response.out.write(out)
        else:
          return self.write('not found')

    def handleDiverse(self):
        if self.arg == 'delete_all':
            self.deleteAll()
        elif self.arg == 'all':
            rhythms = [{ 'title': str(r.title), 'date': str(r.last_modified), 'xml': str(r.xml) } for r in self.rhythms]
            rhythms = {'rhythms': rhythms}
            encoder = json.JSONEncoder()
            rhythms = encoder.encode(rhythms)
            return self.write(rhythms)

    def deleteAll(self):
        for r in self.rhythms:
            r.delete()
        return self.write(str([r.title for r in self.rhythms]))

    def post(self):
        title, xml_str = self.request.body.split('|')
        xml = md.parseString(xml_str)
        if valid_rhythm(xml) and valid_title(title):
          rhy = Rhythm(title=str(title), xml=xml.toxml())
          rhy.put()
        else:
          return self.write('invalid rhythm')

def valid_rhythm(xml):
    if xml.getElementsByTagName('note'):
      return True

def valid_title(title):
    if not Rhythm.all().filter('title =', title).get():
        return True

class SongDb(BaseHandler):
    def get(self):
          db.delete(Song.all());
          song = Song(title="sound/conga/1.wav")
          song.put()
          song = Song(title="sound/conga/2.wav")
          song.put()
          song = Song(title="sound/conga/3.wav")
          song.put()
          return self.write("DB initialised")


config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'my-super-secret-key',
}

app = webapp2.WSGIApplication([('/', Home),
                               ('/game', game),
                               ('/randomsong', RandomSong),
                               ('/rhythm_enterer', RhythmEnterer),
                               ('/song_enterer', SongEnterer),
                               ('/rhythm_db', RhythmsQuery),
                               ('/song_db', SongsQuery),
                               ('/init_db', SongDb)
                               ],
                               debug=True,
                               config=config)

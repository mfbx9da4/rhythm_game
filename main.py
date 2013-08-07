"""
export PATH=$PATH:/home/david/Dropbox/Programming/Python/Miscellaneous/extensions/google_appengine
dev_appserver.py helloworld/
appcfg.py update helloworld/

"""

__website__ = 'http://rhythmludus.appspot.com/'


from xml.dom import minidom as md

import webapp2
from google.appengine.ext import db

from object_models import BaseHandler
from rhythmgame import game
from gamesetup import CreateChannel
from gamesetup import GameRequest
from song import RandomSong

class Home(BaseHandler):
      def get(self): 
            self.write('HOME')


class Rhythm(db.Model):
    title = db.StringProperty(multiline=False, required=True)
    xml = db.TextProperty(required=True)
    created = db.DateTimeProperty(auto_now_add=True)
    last_modified = db.DateTimeProperty(auto_now=True)

class Enterer(BaseHandler):
    def get(self):
        self.render('rhythm_enterer.html')



class RhythmsQuery(BaseHandler):
    def get(self):
        self.rhythms = Rhythm.all()
        if not self.request.get('arg'):
            return self.write(str([r.title for r in self.rhythms]))
        else:
            self.handleDiverse()

    def handleDiverse(self):
        if self.request.get('arg') == 'delete_all':
            self.deleteAll()

    def deleteAll(self):
        for r in self.rhythms:
            r.delete()
        return self.write(str([r.title for r in self.rhythms]))

    def post(self):
        title, xml_str = self.request.body.split('|')
        xml = md.parseString(xml_str)
        f = webapp2.os.open('this', 'r')
        # f.write(xml.toxml())
        # f.close()
        rhy = Rhythm(title=title, xml=xml.toxml())
        rhy.put()

    
config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'my-super-secret-key',
}

app = webapp2.WSGIApplication([('/', Home),
                               ('/game', game),
                               ('/randomsong', RandomSong),
                               ('/rhythm_enterer', Enterer),
                               ('/rhythm_db', RhythmsQuery)
                               ],
                               debug=True,
                               config=config)

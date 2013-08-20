import webapp2

from google.appengine.ext import db
from google.appengine.api import users
import cgi

from utilities import rotString


form = """
<h1>ROT13 your text below</h1>
<form method="post" action="/udacity/rot13">
<textarea style="width:500px; height:250px" name="text">%(content)s</textarea>
<br>
<input type='submit'>
</form>

<form action="/udacity/rot13/entries">
<input type="submit" value="See previous entries"/>
</form>
"""

def countNumHis(s):
	return 4


class Entry(db.Model):
    """Models an individual Guestbook entry with an author, content, and date."""
    content = db.StringProperty(multiline=True)
    date = db.DateTimeProperty(auto_now_add=True)
    number_of_his = countNumHis(content)


class PreviousEntries(webapp2.RequestHandler):
	def get(self):
		entries_query = Entry.all().ancestor(guestbook_key()).order('-date')
		entries = []
		for x in entries_query.fetch(10):
			entries.append(cgi.escape(x.content) + cgi.escape(str(x.date)))
		self.response.write(entries)


class RotHandler(webapp2.RequestHandler):
	def write_form(self, **kwargs):
		self.response.write(form % kwargs)

	def get(self):
		self.response.headers['Content-Type'] = 'text/html'
		self.write_form(content='Write anything here')

	def post(self):
		self.response.headers['Content-Type'] = 'text/html'
		inp = self.request.get('text')
		e = Entry(parent=guestbook_key())
		e.content = inp
		e.put()
		out = rotString(inp)
		self.write_form(content=out)


def guestbook_key(guestbook_name=None):
    return db.Key.from_path('Entrybook', guestbook_name or 'default_entrybook')
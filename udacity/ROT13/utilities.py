import cgi 			


def rotString(s):
	new_s = ''
	for x in s:
		if x.isalpha():
			if x.islower():
				index = rotLowerCase(x)
			elif x.isupper():
				index = rotUpperCase(x)
			new_s += chr(index)
		else:
			new_s += x
	new_s = cgi.escape(new_s, quote=True)
	return new_s


def rotLowerCase(x):
	index = ord(x) + 13
	if index > 122:
		index = 97 + (index - 123)
	return index


def rotUpperCase(x):
	index = ord(x) + 13
	if index > 90:
		index = 65 + (index - 91)
	return index
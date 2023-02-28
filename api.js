app.post('/api/addcard', async (req, res, next) => {
  // incoming: userId, color
  // outgoing: error
  var error = '';
  const { userId, card } = req.body;
  // TEMP FOR LOCAL TESTING.
  cardList.push(card);
  var ret = { error: error };
  res.status(200).json(ret);
});
app.post('/api/login', async (req, res, next) => {
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
  var error = '';
  const { login, password } = req.body;
  var id = -1;
  var fn = '';
  var ln = '';
  if (login.toLowerCase() == 'rickl' && password == 'COP4331') {
    id = 1;
    fn = 'Rick';
    ln = 'Leinecker';
  } else {
    error = 'Invalid user name/password';
  }
  var ret = { id: id, firstName: fn, lastName: ln, error: error };
  res.status(200).json(ret);
});
app.post('/api/searchcards', async (req, res, next) => {
  // incoming: userId, search
  // outgoing: results[], error
  var error = '';
  const { userId, search } = req.body;
  var _search = search.toLowerCase().trim();
  var _ret = [];
  for (var i = 0; i < cardList.length; i++) {
    var lowerFromList = cardList[i].toLocaleLowerCase();
    if (lowerFromList.indexOf(_search) >= 0) {
      _ret.push(cardList[i]);
    }
  }
  var ret = { results: _ret, error: '' };
  res.status(200).json(ret);
});

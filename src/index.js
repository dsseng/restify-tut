import restify from 'restify'
import jwt from 'jsonwebtoken'

function respond (req, res, next) {
  res.send('hello ' + req.params.name)
  next()
}

var server = restify.createServer()

server.use(restify.plugins.queryParser({
  mapParams: true
}));
server.use(restify.plugins.bodyParser({
  mapParams: true
}));

server.post('/login', (req, res, next) => {
  res.send({
    token: jwt.sign({ data: 'asd' }, 'asd', { expiresIn: '2h' })
  })
  next()
})
server.post('/secure', (req, res, next) => {
  jwt.verify(req.body.token, 'asd', (err, payload) => {
    if (!err) {
      res.send({
        payload: payload
      })
    } else {
      return next(new Error('Token invalid!'));
    }
    next()
  })
})
server.get('/hello/:name', respond)
server.head('/hello/:name', respond)

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url)
})

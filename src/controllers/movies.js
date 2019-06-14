const moviesTpl = require('../views/movies.html')
export default {
  render() {
    $('main').html(moviesTpl)
  }
}
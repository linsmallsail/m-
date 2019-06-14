
module.exports = {
  get(url) {
    return $.ajax({
      url,
      type: 'get',
      success(result) {
        return result
      }
    })
  }
}
function logJson(obj) {
  try {
    console.log(JSON.stringify(obj))
  } catch (err) {
    console.log(String(obj))
  }
}

module.exports = { logJson }

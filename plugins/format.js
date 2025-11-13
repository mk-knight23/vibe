module.exports = async function format(input){
  // Example plugin: identity formatter
  return String(input || '');
}

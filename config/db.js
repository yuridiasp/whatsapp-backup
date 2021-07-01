if (process.env.NODE_ENV == "production") {
    module.exports = {mongoURI: "mongodb+srv://yuridiasp:poliana0609@blogapp.0mxqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"}
}
else {
    module.exports = {mongoURI: "mongodb://localhost/wpp-backup"}
}
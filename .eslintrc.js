module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "globals": {
      "config": false, "bot": false, "Logger": false
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
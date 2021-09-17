SableyeBot3 processes the messages sent in every channel and Direct Message it has access to in order to facilitate its operations.  However, only the following information is retained after processing:

- Names of commands run, without arguments.  This data is used to keep track of the popularity of commands and is used to inform development.

    Note: This means that if you run `//filter type=fire`, we only log `//filter`

- Friend Code data supplied to the `//addfc` and `//addgame` commands. This data is returned by the `//fc` command.

    Note: This data can be removed at any time with the `//deletefc` and `//deletegame` commands respectively.

Data provided in this way is stored in a database on the bot server, which is hosted by DigitalOcean.


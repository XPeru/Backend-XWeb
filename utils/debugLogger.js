exports.log = (line) => {
    if (process.env.DEBUG == 'true') {
        console.log(line);
    }
};

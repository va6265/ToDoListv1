exports.getDate= function(){
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    const day = new Date();
    return day.toLocaleDateString("en-US", options);
}

exports.getDay= function(){
    const options = {
        weekday: "long",
    };
    const day = new Date();
    return day.toLocaleDateString("en-US", options);
}

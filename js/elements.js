web.elements = {};
web.elements.layout = (name, remove = false) => {
    if (remove) {
        $("#" + name).remove();
    } else {
        $('body').append("<article id=" + name + "></article>");
    }
}
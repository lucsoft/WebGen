web.elements = {};
web.elements.supported = { layout: "layout" };
web.elements.on = (type, func) => {
    web.elements.onList.push({ func: func, type: type })
};
web.elements.onList = [];
web.elements.addDefaultParticles = async () => {
    $('body').append(`<div id="particles-js"><canvas class="particles-js-canvas-el" style="width: 100%; height: 100%;"></canvas></div>`);
    await web.script.load(`https://api.lucsoft.de/webgen/js/particles`);
    particlesJS('particles-js', { "particles": { "number": { "value": 80, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } }, "line_linked": { "enable": false, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 1, "direction": "right", "random": true, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": false, "mode": "repulse" }, "onclick": { "enable": false, "mode": "push" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true });
}
web.elements.layout = (name, remove = false) => {
    if (remove) {
        $("#" + name).remove();
    } else {
        $('body').append("<article id=" + name + "></article>");
        web.elements.onList.filter(x => x.name == "layout").forEach(e => {
            e.func();
        });
    }
}
web.elements.elements = {};
web.elements.elements.COUNT = 0;

web.elements.elements.bigTitle = (addto, settings) => {
    web.style.require("elements");
    web.elements.elements.COUNT++;
    if (settings.imgUrl != null) {
        $(addto).append(`<span id="${web.elements.elements.COUNT}" class="titlew withimg"><img src="${settings.imgUrl}" style="margin-bottom:3.2rem"><br>\n${settings.title}<span class="subtitlew"style="margin-left:${settings.subtitleposx}";>${settings.subtitle}</span></span>`);
    } else {
        if (settings.title.indexOf("y") != -1 || settings.title.indexOf("j") != -1 || settings.title.indexOf("q") != -1 || settings.title.indexOf("p") != -1) {
            $(addto).append(`<span id="${web.elements.elements.COUNT}" class="titlew">${settings.title}<span class="subtitlew"style="margin-top: 0.5rem; margin-left:${settings.subtitleposx}";>${settings.subtitle}</span></span>`);

        } else {
            $(addto).append(`<span id="${web.elements.elements.COUNT}" class="titlew">${settings.title}<span class="subtitlew"style="margin-left:${settings.subtitleposx}";>${settings.subtitle}</span></span>`);

        }
    }
    if (settings.spaceing_top != null) {
        $(`#${web.elements.elements.COUNT}`).css("margin-top", settings.spaceing_top);
    }
};
web.elements.elements.note = (addto, settings) => {
    web.style.require("elements");
    web.elements.elements.COUNT++;
    $(addto).append('<span id="' + web.elements.elements.COUNT + '" class="note ' + settings.type + '" style="display: block;">' + settings.text + '</span>');
};
web.elements.elements.player = (addto, settings) => {
    web.style.require("elements");
    web.style.require("cards");
    web.elements.elements.COUNT++;
    var playerlol = web.elements.elements.COUNT;
    $(addto).append(`<audioPlayer id="${playerlol}" class="${(settings.small == true) ? 'small' : ''}"><div class="overlay"><img src=""><input class="search" placeholder="Search a Song"></input><div class="controler"><i onmouseup="$(this).removeClass('clicked');" onmousedown="$(this).addClass('clicked');" class="material-icons-round">fast_rewind</i><i onmouseup="$(this).removeClass('clicked');" onmousedown="$(this).addClass('clicked');" class="material-icons-round middle">pause</i>
    <i class="material-icons-round" onmouseup="$(this).removeClass('clicked');" onmousedown="$(this).addClass('clicked');">fast_forward</i></div><span class="title" id="playertitle"><span class="subtitle"></span></span><span class="playing">Playing on Spotify</span><span class="notplaying">Nothing Playing</span><span class="progress"></span></div><img src="${settings.img}"></audioPlayer>`);
    $(`#${playerlol}`).find("i")[0].onclick = () => {
        if ($(`#${playerlol}`).find("i")[1].innerHTML == "play_arrow") {
            $(`#${playerlol}`).find("i")[1].innerHTML = "pause";
            settings.onInput("play");
        }
        settings.onInput("previous");
    };
    $(`#${playerlol}`).find("i")[1].onclick = () => {
        if ($(`#${playerlol}`).find("i")[1].innerHTML == "play_arrow") {
            settings.onInput("play");
        } else if ($(`#${playerlol}`).find("i")[1].innerHTML == "pause") {
            settings.onInput("pause");
        }
    };
    $(`#${playerlol}`).find("i")[2].onclick = () => {
        if ($(`#${playerlol}`).find("i")[1].innerHTML == "play_arrow") {
            $(`#${playerlol}`).find("i")[1].innerHTML = "pause";
            settings.onInput("play");
        }
        settings.onInput("next");
    };
    $(`#${playerlol}`).find(".search").bind("enterKey", function (e) {
        settings.onInput("search", $(`#${playerlol}`).find(".search").val());
        $(`#${playerlol}`).find(".search").val("");
    });
    $(`#${playerlol}`).find(".search").keyup(function (e) {
        if (e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });
};
web.elements.elements.cards = (addto, settings) => {
    web.style.require("cards");
    web.elements.elements.COUNT++;
    var elementscount = web.elements.elements.COUNT;
    $(addto).append(`<cardlist id="${elementscount}" class=""></cardlist>`);

    if (settings.small) {
        $(`#${elementscount}`).addClass("small");
    }
    if (settings.hidden) {
        $(`#${elementscount}`).addClass("hidden");
    }
    if (settings.effect) {
        $(`#${elementscount}`).addClass("effect");
    }
    if (settings.max_width || settings.max_width == undefined) {
        $(`#${elementscount}`).addClass("max-width");
    }
    if (settings["grid_columns"] != undefined) {
        $(`#${elementscount}`).addClass(`grid_columns_${settings.grid_columns}`);
    }
    if (settings.cardtype == "lline" || settings.cardtype == undefined || settings.cardtype == null) {
        var elementscountid = elementscount;
        for (let index2 = 0; index2 < settings.cards.length; index2++) {
            const card = settings.cards[index2];
            if (card["subtitle"] != undefined) {
                elementscount++;
                $(`#${elementscountid}`).append(`<card id="${card.id}"class="lline ${settings["tilt"] == true ? "js-tilt" : ""} subtitle disablehover ${settings.effect ? index2 == 0 ? "left" : index2 == (settings.cards.length - 1) ? "right" : "" : ""}"><span class="title">${card.title}</span><span class="subtitle">${card.subtitle}</span></card>`);

            } else {
                elementscount++;
                $(`#${elementscountid}`).append(`<card id="${card.id}" class="lline ${settings["tilt"] == true ? "js-tilt" : ""} disablehover ${settings.effect ? index2 == 0 ? "left" : index2 == (settings.cards.length - 1) ? "right" : "" : ""}"><span class="title">${card.title}</span></card>`);

            }
        }
    }
};
web.elements.elements.imageList = (addto, settings) => {
    web.style.require("cards");
    web.elements.elements.COUNT++;
    var elementscount = web.elements.elements.COUNT;
    elementscount++;
    $(addto).append(`<cardlist id="${elementscount}" class=""></cardlist>`);
    $(`#${elementscount}`).addClass("max-width");
    var elementscountid = elementscount;
    elementscount++;
    $(`#${elementscountid}`).append(`<card id="${elementscount}"class="imgbox invisible disablehover"></card>`);

    $(`#${elementscountid}`).append(`<card id="${elementscount}"class="imgbox disablehover"><img src="https://images.pexels.com/photos/1072851/pexels-photo-1072851.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"><span class="title">Big Project: HomeSYS - Smart Home Combined<span class="subtitle">We want to create a place for every IoT Device!<br><br>Join us over Discord and Develop with us or check our GitHub repository!</span></span></card>`);

    elementscount++;
    $(`#${elementscountid}`).append(`<card id="${elementscount}"class="imgbox disablehover"><img src="https://images.pexels.com/photos/1411590/pexels-photo-1411590.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"><span class="title">Searching for Devs!<span class="subtitle">We have many stuff to do and We need YOU!<br><br>Join US over Discord!</span></span></card>`);
};
web.elements.elements.title = (addto, settings) => {
    web.style.require("elements");
    web.elements.elements.COUNT++;
    var elementscount = web.elements.elements.COUNT;
    if (settings["subtitle"] != undefined || settings.length >= 1) {
        $(addto).append(`<br>`);
        $(addto).append(`<h2 id="${elementscount}">${settings.title}</h2>`);
        $(addto).append(`<h4>${settings.subtitle}</h4>`);
        $(addto).append(`<br>`);
    } else {
        $(addto).append(`<h2 id="${elementscount}">${settings.title}</h2>`);
    }
}
web.elements.elements.search = (addto, settings) => {
    web.style.require("elements");
    web.style.require("cards");
    b.elements.elements.COUNT++;
    var elementscount = web.elements.elements.COUNT;
    var ecofbox = elementscount;
    $(addto).append(`<cardlist id="${elementscount}" class="max-width grid_columns_1"><card id="3" class="search disablehover"><i class="material-icons">close</i><input type="text" name="" id="" placeholder="${settings.searchtext}"><ul id="searchlist"></ul></card></cardlist>`);
    var list = [];
    $(`#${ecofbox}`).find("i")[0].onclick = () => {
        settings.onclose();
    };
    $("#" + ecofbox).find("input")[0].onkeyup = (d) => {
        if (d.key == "Enter") {
            $(`#${ecofbox}`).find("ul").find("li")[0].click();
        }
        if (settings.lastSearch == $("#" + ecofbox).find("input")[0].value) return;
        settings.lastSearch = $("#" + ecofbox).find("input")[0].value;
        if (settings.tagSearch == true) {
            var smart = $("#" + ecofbox).find("input")[0].value.toLowerCase().split(' ');
            var tags = [];
            var name = "";
            smart.forEach(element => {
                if (element.startsWith("#") || element.startsWith("!")) {
                    tags.push(element);
                } else if (element != "") {
                    name += " " + element;
                }
            });
            name = name.slice(1);
            settings.list = settings.index;
            tags.forEach(element => {
                if (element.startsWith("#")) {
                    settings.list = settings.list.filter(x => x.tags.includes(element.slice(1)));
                } else if (element.startsWith("!")) {
                    settings.list = settings.list.filter(x => !x.tags.includes(element.slice(1)));
                }
                if (settings.list.length == 0) {
                    return;
                }
            });

            settings.list = settings.list.filter(x => x.name.toLowerCase().includes(name.toLowerCase()));
        } else {
            settings.list = settings.index.filter(e => e.name.toLowerCase().includes($("#" + ecofbox).find("input")[0].value.toLowerCase()));
        }
        if (settings['disableList'] == true) {

        } else {
            $(`#${ecofbox}`).find("ul").html("");
            settings.list.forEach(e => {
                var tags = "";
                if (e.tags != undefined) {
                    e.tags.forEach(e => tags += '<span class="tag">' + e + '</span>');
                }
                $(`#${ecofbox}`).find("ul").append(`<li onclick="web.oncommand('${ecofbox + "#" + e.id}')"><left>${(e.icon != null || e.icon == "" ? `<img onerror="$(this).get(0).src += '#test'" src="${e.icon}">` : "") + e.name}</left><right>${e.text != undefined ? e.text : ""}${tags}${(settings.editable == true) ? `<i id="e${ecofbox + "e" + e.id}" class="material-icons-round">edit</i>` : ""}${(settings.removeable == true) ? `<i id="w${ecofbox + "w" + e.id}" class="material-icons-round">delete</i>` : ""}</right></li>`);
                if (settings.removeable == true) {
                    $(`#w${ecofbox + "w" + e.id}`)[0].onclick = () => {
                        settings.remove({ id: "w" + ecofbox + "w" + e.id, element: e, settings: settings });
                    };
                    $(`#e${ecofbox + "e" + e.id}`)[0].onclick = () => {
                        settings.edit({ id: "e" + ecofbox + "e" + e.id, element: e, settings: settings });
                    };
                }
            });
            if (settings.list.length == 0) {
                $(`#${ecofbox}`).find("ul").html("<li class=\"gray\">" + settings.error.notfound + "</li>");
            }
            if (d.key == "Enter") {
                $(`#${ecofbox}`).find("ul").find("li")[0].click();
            }
            if (d.key == "Escape") {
                settings.onclose();
            }
        }

        settings.onsearch($("#" + ecofbox).find("input")[0].value);
    };
    settings.drawList = () => {
        settings.list = settings.index.filter(e => e.name.toLowerCase().includes($("#" + ecofbox).find("input")[0].value.toLowerCase()));
        $(`#${ecofbox}`).find("ul").html("");
        settings.list.forEach(e => {
            var tags = "";
            if (e.tags != undefined) {
                e.tags.forEach(e => tags += '<span class="tag">' + e + '</span>');
            }
            $(`#${ecofbox}`).find("ul").append(`<li onclick="web.oncommand('${ecofbox + "#" + e.id}')"><left>${(e.icon != null ? `<img onerror="$(this).get(0).src += '#test'" src="${e.icon}">` : "") + e.name}</left><right>${e.text != undefined ? e.text : ""}${tags}${(settings.editable == true) ? `<i id="e${ecofbox + "e" + e.id}" class="material-icons-round">edit</i>` : ""}${(settings.removeable == true) ? `<i id="w${ecofbox + "w" + e.id}" class="material-icons-round">delete</i>` : ""}</right></li>`);
            if (settings.removeable == true) {
                $(`#w${ecofbox + "w" + e.id}`)[0].onclick = () => {
                    settings.remove({ id: "w" + ecofbox + "w" + e.id, element: e, settings: settings });
                };
                $(`#e${ecofbox + "e" + e.id}`)[0].onclick = () => {
                    settings.edit({ id: "e" + ecofbox + "e" + e.id, element: e, settings: settings });
                };
            }
        });

    };
    if (settings.drawOnLoad == true) {
        waitFor(80, settings.drawList);
    }
    callback({ id: elementscount, settings: settings, input: $("#" + ecofbox).find("input") });
    return { id: elementscount, settings: settings };
}
web.elements.elements.uploader = (addto, settings) => {
    web.style.require("elements");
    web.style.require("cards");
    web.elements.elements.COUNT++;
    var elementscount = web.elements.elements.COUNT;
    if (settings.dontCreateLayout != true) {
        addLayout("fixedWindow");
        $("#fixedWindow").addClass("upload");
    } else {
        $("#fixedWindow").addClass("maxed");
    }
    $("#fixedWindow").append(`
        <form class="uploader" method="post" action="" enctype="multipart/form-data">
            <span class="info">
                <span class="title">${settings.title}</span>
                <button type="button" focus onclick="$('#fixedWindow').remove()" class="two">${settings.closebutton == null ? "Done" : settings.closebutton}</button>
            </span>
            ${settings.form == undefined ? "" : settings.form}
            <ul></ul>
            <input type="file" name="file" id="file">
            <button type="submit" class="hide" id="uploaderUpload">forceupload</button>
        </form>`);
    $("input#file").change(function () {
        var ele = document.getElementById($(this).attr('id'));
        result = ele.files;
        for (var x = 0; x < result.length; x++) {
            var fle = result[x];
        }
        if (result.length == 1) {
            uploadname = result[0].name.replace(".png", "");
            $("form.uploader").attr("action", settings.getUrl(uploadname));
        }
        var data = new FormData($("form.uploader")[0]);

        $.ajax({
            url: settings.getUploadUrl(uploadname),
            type: 'post',
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            cache: false,
            data: data,
            beforeSend: () => {
                $("form.uploader").find("ul").append(`<li id="uploader_${uploadname}"><img src="${settings.getUrl(uploadname)}"><span>${uploadname}</span><div class="progressS"><span style="width: 0%" class="progress"></span></li>`);
            },
            success: function () {
                $("form.uploader").find("#uploader_" + uploadname).find(".progress").css("width", "100%");
                settings.on("success", { uploader: $("#fixedWindow"), name: uploadname });
            }
        });
    });
    $("form.uploader").submit(function (evt) {
        evt.preventDefault();
    });
    return { id: elementscount, forcepush: () => { $("#fixedWindow").find("#uploaderUpload").click() } };
}
web.elements.elements.buttons = (addto, settings) => {
    web.style.require("elements");
    web.elements.elements.COUNT++;
    var elementscount = web.elements.elements.COUNT;
    elementscount++;
    if (settings["nocenter"] == true) {
        $(addto).append(`<div id="${elementscount}">`);
    } else {
        $(addto).append(`<center id="${elementscount}">`);
    }
    if (settings.big) {
        var test = 0;
        for (let index = 0; index < settings.list.length; index++) {
            const e = settings.list[index];
            $("#" + elementscount).append(`<button class="one" onclick="${e.onclick}">${e.text}</button>`);
            test = index;
            if ((test + 1) == settings.list.length) {
                $("#" + elementscount).append(`<br class="mobilehide">`);
                $("#" + elementscount).append(`<br class="mobilehide">`);
                $("#" + elementscount).append(`<br class="mobilehide">`);
                $("#" + elementscount).append(`<br>`);
            }
        }
    } else {
        $(addto).append(`</center>`);

        for (let index = 0; index < settings.list.length; index++) {
            const e = settings.list[index];
            $("#" + elementscount).append(`<button onclick="${e.onclick}">${e.text}</button>`);

        }

    }
}
web.elements.elements.loginWindow = (addto, settings) => {
    web.style.require("elements");
    web.style.require("cards");
    web.elements.elements.COUNT++;
    var elementscount = web.elements.elements.COUNT;
    $(addto).append(`<cardlist id="${elementscount}" style="max-width:36rem" class="max-width grid_columns_1"><card id="3" class="animation2 login disablehover"><span class="popup-title">${settings.text.text}</span>${(settings.text.url != null) ? '<input type="url" name="" id="login_url" placeholder="' + settings.text.url + '">' : ''}${(settings.text.email != null) ? '<input type="email" name="" id="login_email" placeholder="' + settings.text.email + '">' : ''}<input type="password" name="" id="login_password" placeholder="${settings.text.password}"><span id="loginerrormsg" class="errormsg"></span><input type="button" name="" id="login_button" value="${settings.text.button}"></card></cardlist>`);
    $("#" + elementscount).find("input")[1].focus();
    $("#" + elementscount).find("input")[1].onkeyup = (d) => {
        if (d.key == "Enter") {
            $("#login_button")[0].onclick();
        }
    }
    $("#login_button")[0].onclick = (e) => {
        settings.beforelogin($("#login_password")[0].value);
        if (settings.text.url != null) {
            database.apiurl = $('#login_url').val() + "/lib/";
        }
        if (settings.text.email == null) {
            if (settings.noSHA256) {
                database.login("admin", $("#login_password")[0].value, () => { settings.onError() }, () => { settings.afterlogin($("#login_password")[0].value); });
            } else {
                database.login("admin", SHA256($("#login_password")[0].value), () => { settings.onError() }, () => { settings.afterlogin($("#login_password")[0].value); });
            }
        } else {
            if (settings.noSHA256) {
                database.login($("#login_email")[0].value, $("#login_password")[0].value, () => { settings.onError() }, () => { settings.afterlogin(); });
            } else {
                database.login($("#login_email")[0].value, SHA256($("#login_password")[0].value), () => { settings.onError() }, () => { settings.afterlogin(); });
            }
        }
    };
}
web.elements.elements.window = (addto, settings) => {
    web.style.require("elements");
    web.style.require("cards");
    web.elements.elements.COUNT++;
    var elementscount = web.elements.elements.COUNT;
    if (!settings.max_width) {
        $(addto).append(`<cardlist id="${elementscount}" class="max-width grid_columns_1"><card id="3" class="popup disablehover"><span class="popup-title">${settings.text.title}</span>${settings.content}</card></cardlist>`);
    } else {
        $(addto).append(`<cardlist id="${elementscount}" style="max-width:${settings.max_width}" class="max-width grid_columns_1"><card id="3" class="popup disablehover"><span class="popup-title">${settings.text.title}</span>${settings.content}</card></cardlist>`);
    }
    if (settings.buttons != null) {
        var ele = elementscount;
        $('#' + elementscount).find("card").append("<buttonlist></buttonlist>");
        for (let g = 0; g < settings.buttons.length; g++) {
            const element = settings.buttons[g];
            $('#' + elementscount).find("buttonlist").append("<button id=\"" + g + "\"class=\"" + element.color + "\">" + element.text + "</button>");
            $('#' + elementscount).find("buttonlist").find("button")[g].onclick = () => element.onclick({ hide: () => $('#' + ele).addClass("hide"), show: () => $('#' + ele).removeClass("hide") });
        }
    }
}
web.elements.elements.imgList = (addto, settings) => {
    web.style.require("elements");
    web.style.require("cards");
    web.elements.elements.COUNT++;
    var elementscount = web.elements.elements.COUNT;
    elementscount++;
    $(addto).append(`<cardlist id="${elementscount}" class=""></cardlist>`);
    if (settings.max_width) {
        $(`#${elementscount}`).addClass("max-width");
        if (settings.max_width != true) {
            $("#" + elementscount).css("max-width", settings.max_width);
        }
    }
    if (settings["grid_columns"] != undefined) {
        $(`#${elementscount}`).addClass(`grid_columns_${settings.grid_columns}`);
    } else if (settings["grid_columns"] == undefined) {
        $(`#${elementscount}`).addClass(`grid_columns_2`);
    }
    var elementscountid = elementscount;
    for (let index2 = 0; index2 < settings.imgs.length; index2++) {
        const card = settings.imgs[index2];
        if (card["nohover"] == true) {

            $(`#${elementscountid}`).append(`<card class="imgbox ${settings["tilt"] == true ? "js-tilt" : ""} disablehover"><img onerror="$(this).get(0).src += '#test'" style="${settings["zoomed"] == false ? "margin: -.3rem;" : ""}" class="${settings["pixelated"] == true ? "pixelated" : ""}" src="${card.url}"><span class="title">${card.title}<span class="subtitle">${card.subtitle}</span></span></card>`);

        } else {
            $(`#${elementscountid}`).append(`<card class="imgbox ${settings["tilt"] == true ? "js-tilt" : ""}"><img onerror="$(this).get(0).src += '#test'"  style="${settings["zoomed"] == false ? "margin: -.3rem;" : ""}" class="${settings["pixelated"] == true ? "pixelated" : ""}" src="${card.url}"><span class="title">${card.title}<span class="subtitle">${card.subtitle}</span></span></card>`);

        }
    }
}
web.elements.elements.appList = (addto, settings) => {
    web.style.require("elements");
    web.style.require("cards");
    web.elements.elements.COUNT++;
    var elementscount = web.elements.elements.COUNT;
    elementscount++;
    $(addto).append(`<cardlist id="${elementscount}" class="iconlist"></cardlist>`);
    if (settings.max_width) {
        $(`#${elementscount}`).addClass("max-width");
        if (settings.max_width != true) {
            $("#" + elementscount).css("max-width", settings.max_width);
        }
    }
    if (settings["grid_columns"] != undefined) {
        $(`#${elementscount}`).addClass(`grid_columns_${settings.grid_columns}`);
    } else if (settings["grid_columns"] == undefined) {
        $(`#${elementscount}`).addClass(`grid_columns_2`);
    }
    var elementscountid = elementscount;
    for (let index2 = 0; index2 < settings.app.length; index2++) {
        const app = settings.app[index2];
        elementscount++;
        $(`#${elementscountid}`).append(`<card id="${elementscount}"class="iconcard"><img onerror="$(this).get(0).src += '#test'" src="${app.img}"><div><span class="title">${app.title}</span><span class="subtitle">${app.subtitle}</span>${app["button"] != undefined ? `<button ${app["disabled"] == true ? "disabled" : ""} onclick="${app.onclick}">${app.button}</button>` : ""}</div></card>`);
    }
}

web.elements.add = (addto = "#page") => {
    return {
        /**
         * Currently no notes
         */
        bigTitle: (settings) => web.elements.elements.bigTitle(addto, settings),

        /**
         * Currently no notes
         */
        note: (settings) => web.elements.elements.note(addto, settings),

        /**
         * Currently no notes
         */
        player: (settings) => web.elements.elements.player(addto, settings),

        /**
         * Currently no notes
         */
        cards: (settings) => web.elements.elements.cards(addto, settings),

        /**
         * Currently no notes
         */
        imageList: (settings) => web.elements.elements.imageList(addto, settings),

        /**
         * Currently no notes
         */
        title: (settings) => web.elements.elements.title(addto, settings),

        /**
         * Currently no notes
         */
        search: (settings) => web.elements.elements.search(addto, settings),

        /**
         * Currently no notes
         */
        uploader: (settings) => web.elements.elements.uploader(addto, settings),

        /**
         * Currently no notes
         */
        buttons: (settings) => web.elements.elements.buttons(addto, settings),

        /**
         * Currently no notes
         */
        loginWindow: (settings) => web.elements.elements.loginWindow(addto, settings),

        /**
         * Currently no notes
         */
        window: (settings) => web.elements.elements.window(addto, settings),

        /**
         * Currently no notes
         */
        imgList: (settings) => web.elements.elements.imgList(addto, settings),

        /**
         * Currently no notes
         */
        appList: (settings) => web.elements.elements.appList(addto, settings)
    }
}